// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
require('dotenv').config();
//console.log(process.env);

const firebaseConfig = {
    apiKey: "process.env.APIKEY",
    authDomain: "process.env.AUTHDOMAIN",
    projectId: "pantrytracker01",
    storageBucket: "pantrytracker01.appspot.com",
    messagingSenderId: "87648405047",
    appId: "1:87648405047:web:bbd4c96d7542419bc361b2",
    measurementId: "G-DSZ5Y2E3NY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };