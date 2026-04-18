import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANUDo5yxklUrJQAkj6GPEHExiKmVrlmKg",
  authDomain: "flybeth-c266f.firebaseapp.com",
  projectId: "flybeth-c266f",
  storageBucket: "flybeth-c266f.firebasestorage.app",
  messagingSenderId: "640562640798",
  appId: "1:640562640798:web:403755c243371912ef488f",
  measurementId: "G-SCXGEWKDWE"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
