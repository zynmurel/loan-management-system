// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAovtURtW21Ij_uTNVAu-BGRKZxr9esDMk",
  authDomain: "imageuploadforthesises.firebaseapp.com",
  projectId: "imageuploadforthesises",
  storageBucket: "imageuploadforthesises.appspot.com",
  messagingSenderId: "255663088615",
  appId: "1:255663088615:web:5b31db93cd972fdeadd342"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app)