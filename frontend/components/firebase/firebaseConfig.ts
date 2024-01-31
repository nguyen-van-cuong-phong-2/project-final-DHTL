// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAKw4dTsZwTDWbpg-_4Sy2E0GDrrfrGZnY",
    authDomain: "bluebook-db882.firebaseapp.com",
    projectId: "bluebook-db882",
    storageBucket: "bluebook-db882.appspot.com",
    messagingSenderId: "222429820880",
    appId: "1:222429820880:web:df8700dd4764fd47c26bd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app }
