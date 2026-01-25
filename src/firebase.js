import { signInAnonymously } from "firebase/auth";
import { auth, db } from "./utils/firebase";

export { auth, db };
export const appId = "pc-tycoon-v1"; // Your unique game ID

// Helper to ensure we are always logged in
export const initAuth = () => signInAnonymously(auth);