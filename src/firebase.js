import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBM49IUw9Owo3QiDgQ-Kh3t5l2QdAwhUt4",
  authDomain: "lazboyngirl.firebaseapp.com",
  databaseURL: "https://lazboyngirl-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lazboyngirl",
  storageBucket: "lazboyngirl.firebasestorage.app",
  messagingSenderId: "856199966825",
  appId: "1:856199966825:web:1815121ad82c5980d072f8",
  measurementId: "G-N5VZ9RFWTW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
