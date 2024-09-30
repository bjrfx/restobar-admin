// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot } from "firebase/firestore"; // Added onSnapshot
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCBCCmF9Cw0ZOfoZFi21JseVsws_9AFzx0",
    authDomain: "restobar-bcc6f.firebaseapp.com",
    projectId: "restobar-bcc6f",
    storageBucket: "restobar-bcc6f.appspot.com",
    messagingSenderId: "500286216035",
    appId: "1:500286216035:web:49a51dc7d8f3ff4c0aa556",
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, doc, setDoc, collection, addDoc, onSnapshot, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };