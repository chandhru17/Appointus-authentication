// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGN-6XQV4dqD6mtZu8XS63yce4HXZC9KU",
    authDomain: "appointus-signup.firebaseapp.com",
    projectId: "appointus-signup",
    storageBucket: "appointus-signup.appspot.com",
    messagingSenderId: "819096259121",
    appId: "1:819096259121:web:dedf5e87f99fb892d16310"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Form submission handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User logged in:', user.uid);

            // Redirect to dashboard or home page after login
            window.location.href = 'dashboard.html'; // Update this to your actual page
        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessageText = error.message;
            console.error('Error during login:', errorCode, errorMessageText);

            // Display error message to user
            errorMessage.textContent = `Error: ${errorMessageText}`;
            errorMessage.classList.remove('hidden');
        }
    });

    googleSignInBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('User signed in with Google:', user.uid);
            window.location.href = 'dashboard.html'; // Redirect after login
        } catch (error) {
            const errorMessageText = error.message;
            errorMessage.textContent = `Error: ${errorMessageText}`;
            errorMessage.classList.remove('hidden');
        }
    });

});