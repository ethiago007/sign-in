// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcmsneRytW1AdEs2Ku9Gn5om4gZwlW6BA",
  authDomain: "sign-in-3d6f4.firebaseapp.com",
  projectId: "sign-in-3d6f4",
  storageBucket: "sign-in-3d6f4.firebasestorage.app",
  messagingSenderId: "675413960973",
  appId: "1:675413960973:web:e690c2e8a8e32cfc702844",
  measurementId: "G-PTE7K1H2SS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

const analytics = getAnalytics(app);