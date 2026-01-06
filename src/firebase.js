// frontend/src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAyU-5DyyqFcJ0Xxrx260MctrH92xXpAxU",
  authDomain: "omnigate-hospital-a823d.firebaseapp.com",
  databaseURL: "https://omnigate-hospital-default-rtdb.firebaseio.com",
  projectId: "omnigate-hospital-a823d",
  storageBucket: "omnigate-hospital-a823d.firebasestorage.app",
  messagingSenderId: "383027994808",
  appId: "1:383027994808:web:2f2b809911099dfd8a944d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);  // For IoT real-time triggers

export default app;