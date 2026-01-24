import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This looks for the variable you set in Vercel, 
// or the one we're about to set in your .env.local file.
const firebaseConfig = JSON.parse(
  process.env.REACT_APP_FIREBASE_CONFIG || "{}"
);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = "pc-tycoon-v1"; // Your unique game ID

// Helper to ensure we are always logged in
export const initAuth = () => signInAnonymously(auth);