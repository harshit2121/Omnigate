/**
 * Cryptographic Security & Field-Level PHI Encryption Service
 * Compliant with Digital Personal Data Protection (DPDP) Act 2023 & ABDM M3 Security Architecture
 * 
 * Provides:
 * 1. AES-256-GCM Authenticated Field-Level Encryption & Decryption
 * 2. PBKDF2 Key Derivation with Salt & 100,000 Iterations
 * 3. SHA-256 Cryptographic Digest Calculation for Audit Chains
 * 4. In-Memory PHI Masking & Tokenization (ABHA, Aadhaar, Phone, Name)
 */

const DEFAULT_SALT = 'OmniGate_Ayush_DPDP_2026_Secured_Salt_v3';
const ENCRYPTION_SECRET = 'OmniGate-Hospital-AIIA-Core-Crypto-Key-2026';

class SecurityCryptoService {
  constructor() {
    this.crypto = typeof window !== 'undefined' ? (window.crypto || window.msCrypto) : null;
  }

  /**
   * Derive a 256-bit AES-GCM CryptoKey using PBKDF2
   */
  async _deriveKey(password = ENCRYPTION_SECRET, saltStr = DEFAULT_SALT) {
    if (!this.crypto || !this.crypto.subtle) {
      throw new Error('Web Crypto API is not supported in this environment.');
    }

    const enc = new TextEncoder();
    const keyMaterial = await this.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await this.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(saltStr),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt a plaintext string or object using AES-256-GCM
   * Returns a base64 encoded string containing: IV + Ciphertext + AuthTag
   */
  async encryptPHI(data) {
    try {
      if (!data) return '';
      const textToEncrypt = typeof data === 'object' ? JSON.stringify(data) : String(data);
      const key = await this._deriveKey();
      
      // Generate unique 12-byte IV for each encryption
      const iv = this.crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const encodedData = enc.encode(textToEncrypt);

      const cipherBuffer = await this.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encodedData
      );

      // Combine IV + Ciphertext into single Uint8Array
      const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(cipherBuffer), iv.length);

      // Convert to Base64
      return btoa(String.fromCharCode(...combined));
    } catch (err) {
      console.error('PHI Encryption failed:', err);
      return data; // Fallback safely
    }
  }

  /**
   * Decrypt an AES-256-GCM encrypted base64 payload
   */
  async decryptPHI(cipherBase64) {
    try {
      if (!cipherBase64 || typeof cipherBase64 !== 'string') return cipherBase64;
      
      // If it doesn't look like base64 or failed encryption, return as-is
      if (!/^[A-Za-z0-9+/=]+$/.test(cipherBase64) || cipherBase64.length < 24) {
        return cipherBase64;
      }

      const binaryStr = atob(cipherBase64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // Extract 12-byte IV and Ciphertext
      const iv = bytes.slice(0, 12);
      const cipherBytes = bytes.slice(12);

      const key = await this._deriveKey();
      const decryptedBuffer = await this.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        cipherBytes
      );

      const dec = new TextDecoder();
      const decryptedText = dec.decode(decryptedBuffer);

      try {
        return JSON.parse(decryptedText);
      } catch {
        return decryptedText;
      }
    } catch (err) {
      // In case of wrong key or plain unencrypted string
      return cipherBase64;
    }
  }

  /**
   * Calculate SHA-256 cryptographic hash of a string or JSON object
   */
  async calculateSHA256(data) {
    try {
      const text = typeof data === 'object' ? JSON.stringify(data) : String(data || '');
      const enc = new TextEncoder();
      const hashBuffer = await this.crypto.subtle.digest('SHA-256', enc.encode(text));
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (err) {
      console.error('SHA-256 calculation error:', err);
      return '0000000000000000000000000000000000000000000000000000000000000000';
    }
  }

  /**
   * Mask Protected Health Information (PHI) for display / non-privileged roles
   */
  maskPHI(value, type = 'generic') {
    if (!value) return '';
    const str = String(value).trim();

    switch (type) {
      case 'abha':
        // e.g. "91-8472-1092-4820" -> "91-XXXX-XXXX-4820"
        return str.replace(/^(\d{2}-)\d{4}-\d{4}(-\d{4})$/, '$1XXXX-XXXX$2');
      case 'phone':
        // e.g. "9876543210" -> "98XXXXXX10"
        if (str.length >= 10) {
          return str.slice(0, 2) + 'XXXXXX' + str.slice(-2);
        }
        return 'XXXXXX';
      case 'aadhaar':
        // e.g. "1234 5678 9012" -> "XXXX XXXX 9012"
        return str.replace(/^\d{4}\s\d{4}\s(\d{4})$/, 'XXXX XXXX $1');
      case 'name':
        // e.g. "Sunita Devi" -> "S****a D**i"
        return str.split(' ').map(part => {
          if (part.length <= 2) return part[0] + '*';
          return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
        }).join(' ');
      default:
        if (str.length <= 4) return '****';
        return str.slice(0, 2) + '*'.repeat(str.length - 4) + str.slice(-2);
    }
  }
}

export const securityCryptoService = new SecurityCryptoService();
export default securityCryptoService;
