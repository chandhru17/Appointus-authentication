// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const userTypeRadios = document.getElementsByName('userType');
    const serviceProviderFields = document.getElementById('serviceProviderFields');
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const passwordStrengthMessage = document.getElementById('passwordStrengthMessage');
    const contactNumberInput = document.getElementById('contactNumber');
    const contactNumberMessage = document.getElementById('contactNumberMessage');
    const emailInput = document.getElementById('email');
    const emailMessage = document.getElementById('emailMessage');

    // Function to toggle Service Provider fields
    function toggleFields() {
        const selectedType = document.querySelector('input[name="userType"]:checked').value;
        if (selectedType === 'serviceProvider') {
            serviceProviderFields.classList.remove('hidden');
            const inputs = serviceProviderFields.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.hasAttribute('data-original-required')) {
                    if (input.hasAttribute('required')) {
                        input.setAttribute('data-original-required', 'true');
                    }
                    input.required = true;
                }
            });
        } else {
            serviceProviderFields.classList.add('hidden');
            const inputs = serviceProviderFields.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.getAttribute('data-original-required')) {
                    input.required = true;
                } else {
                    input.required = false;
                }
                input.value = ''; // Optionally clear the fields
            });
        }
    }

    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleFields);
    });

    toggleFields();

    // Password strength checker function
    function checkPasswordStrength(password) {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!/\d/.test(password)) {
            return 'Password must contain at least one digit.';
        }
        if (!/[@$!%*?&]/.test(password)) {
            return 'Password must contain at least one special character.';
        }
        return ''; // No error means the password is strong
    }

    // Contact number validation function
    function validateContactNumber(contactNumber) {
        const regex = /^[0-9]{10}$/;
        if (!regex.test(contactNumber)) {
            return 'Contact number must be exactly 10 digits and contain only numbers.';
        }
        return ''; // No error means the contact number is valid
    }

    // Email validation function
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return 'Please enter a valid email address.';
        }
        return ''; // No error means the email is valid
    }

    // Event listener for password input
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const message = checkPasswordStrength(password);

        if (message) {
            passwordStrengthMessage.textContent = message;
            passwordStrengthMessage.style.color = 'red';
        } else {
            passwordStrengthMessage.textContent = 'Password is strong!';
            passwordStrengthMessage.style.color = 'green';
        }
    });

    // Event listener for contact number input
    contactNumberInput.addEventListener('input', () => {
        const contactNumber = contactNumberInput.value;
        const message = validateContactNumber(contactNumber);

        if (message) {
            contactNumberMessage.textContent = message;
            contactNumberMessage.style.color = 'red';
        } else {
            contactNumberMessage.textContent = 'Valid contact number!';
            contactNumberMessage.style.color = 'green';
        }
    });

    // Event listener for email input
    emailInput.addEventListener('input', () => {
        const email = emailInput.value;
        const message = validateEmail(email);

        if (message) {
            emailMessage.textContent = message;
            emailMessage.style.color = 'red';
        } else {
            emailMessage.textContent = 'Valid email address!';
            emailMessage.style.color = 'green';
        }
    });

    // Form submission handler
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(signupForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        const userType = document.querySelector('input[name="userType"]:checked').value;
        const email = data['email'];
        const password = data['password'];
        const contactNumber = data['contactNumber'];

        // Check email validity before proceeding
        const emailFeedback = validateEmail(email);
        if (emailFeedback) {
            emailMessage.textContent = emailFeedback;
            emailMessage.style.color = 'red';
            return;
        }

        // Check password strength before proceeding
        const passwordFeedback = checkPasswordStrength(password);
        if (passwordFeedback) {
            passwordStrengthMessage.textContent = passwordFeedback;
            passwordStrengthMessage.style.color = 'red';
            return;
        }

        // Check contact number validity before proceeding
        const contactNumberFeedback = validateContactNumber(contactNumber);
        if (contactNumberFeedback) {
            contactNumberMessage.textContent = contactNumberFeedback;
            contactNumberMessage.style.color = 'red';
            return;
        }

        try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Prepare additional data
            let additionalData = {
                userType,
                fullName: data['fullName'],
                contactNumber,
                email,
                location: data['location'],
                createdAt: serverTimestamp()
            };

            if (userType === 'serviceProvider') {
                additionalData = {
                    ...additionalData,
                    businessName: data['businessName'],
                    serviceType: data['serviceType'],
                    serviceDescription: data['serviceDescription'],
                    operatingHours: data['operatingHours'],
                    serviceAreas: data['serviceAreas'],
                    pricingDetails: data['pricingDetails'],
                    businessAddress: data['businessAddress']
                };
            }

            // Store additional user data in Firestore
            await setDoc(doc(db, "users", user.uid), additionalData);

            alert('Registration successful!');
            signupForm.reset();
            toggleFields();
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error during signup:', errorCode, errorMessage);
            alert(`Error: ${errorMessage}`);
        }
    });
});
