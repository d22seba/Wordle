// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"; // ← Gleiche Version!
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVGrf30uoNLDBh_6oWCMn1pe2JKP_l2cg",
  authDomain: "wordle-d44f3.firebaseapp.com",
  projectId: "wordle-d44f3",
  storageBucket: "wordle-d44f3.firebasestorage.app",
  messagingSenderId: "516564718880",
  appId: "1:516564718880:web:061d9c1211cb9588257345",
  measurementId: "G-Q0EJ83PD67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.sendword = async function(word) {
  try {
    const docRef = await addDoc(collection(db, "words"), {
      text: word,
      timestamp: new Date()
    });
  } catch (e) {
  }
}

