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




// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB3VHM7ikT5LBfX7yPCFqOZJiZpGPDuThc",
//   authDomain: "life-after-salary.firebaseapp.com",
//   projectId: "life-after-salary",
//   storageBucket: "life-after-salary.firebasestorage.app",
//   messagingSenderId: "253068048641",
//   appId: "1:253068048641:web:5b3851f097591299464300",
//   measurementId: "G-WWSNCG7WKS"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export default app;