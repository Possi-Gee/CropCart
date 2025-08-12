
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "cropconnect-39mf4",
  appId: "1:474665081714:web:2c41cc1ca2e7ba44d65beb",
  storageBucket: "cropconnect-39mf4.firebasestorage.app",
  apiKey: "AIzaSyBC3yXSfZRKQoB8Vpr211yVgDTnUjFpo_w",
  authDomain: "cropconnect-39mf4.firebaseapp.com",
  messagingSenderId: "474665081714",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
