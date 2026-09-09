/**
 * Voice Assistant & Accessibility Engine
 * Web Speech API wrapper for Multilingual Speech-to-Text & Text-to-Speech
 * Designed for Low-Literacy, Elderly & High-throughput Kiosk environments
 */

class VoiceAssistant {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.currentLanguage = 'hi-IN'; // Default Hindi for Ministry of Ayush OPDs
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;
    }
  }

  setLanguage(langCode) {
    this.currentLanguage = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  speak(text, options = {}) {
    if (!this.synth) return Promise.resolve();

    return new Promise((resolve) => {
      // Cancel any ongoing speech
      this.synth.cancel();

      if (!text || text.trim() === '') {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || this.currentLanguage;
      utterance.rate = options.rate || 0.95; // Slightly slower for clear kiosk audibility
      utterance.pitch = options.pitch || 1.0;

      // Select natural voice if available
      const voices = this.synth.getVoices();
      const targetLang = (options.lang || this.currentLanguage).toLowerCase();
      const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLang.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  startListening({ onResult, onError, onEnd, lang }) {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        if (onError) onError(new Error('Speech recognition not supported in this browser.'));
        return;
      }
    }

    try {
      this.recognition.lang = lang || this.currentLanguage;
      this.isListening = true;

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (onResult) {
          onResult({
            final: finalTranscript,
            interim: interimTranscript,
            text: finalTranscript || interimTranscript
          });
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
      this.isListening = false;
      if (onError) onError(err);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
      this.isListening = false;
    }
  }

  playAudioCue(type = 'beep') {
    if (typeof window === 'undefined' || !window.AudioContext) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.setValueAtTime(400, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch (e) {
      // Ignore audio context autoplay restrictions
    }
  }
}

export const voiceAssistant = new VoiceAssistant();
export default voiceAssistant;
