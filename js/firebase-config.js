// Firebase Configuration & Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCu4qlHG39vayE5f0u6K0SmdKVJaKqLeSM",
  authDomain: "school-2dc85.firebaseapp.com",
  projectId: "school-2dc85",
  storageBucket: "school-2dc85.firebasestorage.app",
  messagingSenderId: "1062698726694",
  appId: "1:1062698726694:web:a2e37b5b8a2a3410073de7",
  measurementId: "G-WJ2PMGL136"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;
try {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (err) {
  console.log("Analytics initialization info:", err.message);
}

// Initialize Cloud Firestore
const db = getFirestore(app);

export { 
  app, 
  analytics, 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp 
};
