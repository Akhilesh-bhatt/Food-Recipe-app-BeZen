import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBJN8ZqGTklRMEQfsZo8kg4OsHYSB4rnQk",
  authDomain: "food-recipe-app-1900c.firebaseapp.com",
  projectId: "food-recipe-app-1900c",
  storageBucket: "food-recipe-app-1900c.appspot.com",
  messagingSenderId: "503029372470",
  appId: "1:503029372470:web:d741cd4890cc0f0dfbea97"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()