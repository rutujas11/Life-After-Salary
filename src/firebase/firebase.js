import { initializeApp } from "firebase/app";

import {
  getAuth
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3VHM7ikT5LBfX7yPCFqOZJiZpGPDuThc",
  authDomain: "life-after-salary.firebaseapp.com",
  projectId: "life-after-salary",
  storageBucket: "life-after-salary.firebasestorage.app",
  messagingSenderId: "253068048641",
  appId: "1:253068048641:web:5b3851f097591299464300",
  measurementId: "G-WWSNCG7WKS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
export default app;
