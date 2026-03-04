import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk6yXI-QYd85qd-_1VshveXXHSlm5bKVo",
  authDomain: "up-exam-mantra.firebaseapp.com",
  projectId: "up-exam-mantra",
  storageBucket: "up-exam-mantra.firebasestorage.app",
  messagingSenderId: "508833223039",
  appId: "1:508833223039:web:2435b355a5ba4581ad4a4a",
  measurementId: "G-T3EVZ2V1HE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
