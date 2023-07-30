// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDTUmLdmXgYWr5ZdiPps7CPWOdnbkuB8RY",
  authDomain: "drc-project-d08da.firebaseapp.com",
  projectId: "drc-project-d08da",
  storageBucket: "drc-project-d08da.appspot.com",
  messagingSenderId: "991178808969",
  appId: "1:991178808969:web:ab4f2c060b00715448b058",
  measurementId: "G-YDHXB2Q6BZ",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
