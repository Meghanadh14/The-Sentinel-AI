// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj6XH6sAVz3P7LN8mGk2QLpI8iLtrHYhA",
  authDomain: "sentinel-ai-logs-ef1e6.firebaseapp.com",
  databaseURL: "https://sentinel-ai-logs-ef1e6-default-rtdb.firebaseio.com",
  projectId: "sentinel-ai-logs-ef1e6",
  storageBucket: "sentinel-ai-logs-ef1e6.firebasestorage.app",
  messagingSenderId: "974587715619",
  appId: "1:974587715619:web:ac98bb021df6349e345196",
  measurementId: "G-TZ5W4P01R0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);