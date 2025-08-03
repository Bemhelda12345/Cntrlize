// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtSB855fSpikoqatfFrXJ4T7w5osPngwk",
  authDomain: "centralize-524ea.firebaseapp.com",
  databaseURL: "https://centralize-524ea-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "centralize-524ea",
  storageBucket: "centralize-524ea.firebasestorage.app",
  messagingSenderId: "1029942918862",
  appId: "1:1029942918862:web:3d3d6eeb049ab8e872da9f",
  measurementId: "G-D81WQW7E55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
