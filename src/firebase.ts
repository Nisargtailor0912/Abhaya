import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa7I5PWefOCNBlgisd5eZLBM2ozRYJOc4",
  authDomain: "abhaya-091207.firebaseapp.com",
  projectId: "abhaya-091207",
  storageBucket: "abhaya-091207.firebasestorage.app",
  messagingSenderId: "852887005188",
  appId: "1:852887005188:web:b6b013ce63f67e40286d51"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
