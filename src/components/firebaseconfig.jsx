// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-fx5omjaBOwJyySmXNKZ1Eri0I9b1i3A",
  authDomain: "moderntech-1a943.firebaseapp.com",
  projectId: "moderntech-1a943",
  storageBucket: "moderntech-1a943.firebasestorage.app",
  messagingSenderId: "693443635939",
  appId: "1:693443635939:web:6f119c73b4f6b2b4a7f3d6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { signInWithEmailAndPassword, onAuthStateChanged, signOut };
export default app;
