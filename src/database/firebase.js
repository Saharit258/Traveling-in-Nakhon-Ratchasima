// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2cZRpLmKdF3PZMcNkssI-QsgTIBMCcKs",
  authDomain: "hotel-001-b5265.firebaseapp.com",
  projectId: "hotel-001-b5265",
  storageBucket: "hotel-001-b5265.appspot.com",
  messagingSenderId: "986302766274",
  appId: "1:986302766274:web:6cbb82921bb4216b782f5b",
  measurementId: "G-TRFLK74H9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;