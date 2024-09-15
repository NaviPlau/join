/**
 * The base URL for the Firebase Realtime Database.
 * 
 * @constant {string}
 */
const BASE_URL = "https://join-57676-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches the contacts from the Firebase database.
 * 
 * This function makes an asynchronous request to the Firebase database to retrieve all stored contacts.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the contacts object, or null if the operation fails.
 */
async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contacts = await response.json();
        return contacts;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
}

/**
 * Initializes the login page by adding event listeners and loading remembered credentials.
 * 
 * This function is executed when the DOM is fully loaded. It sets up various event listeners and loads any saved
 * credentials if the "Remember Me" checkbox was previously checked.
 */
document.addEventListener('DOMContentLoaded', function () {
    addLoginButtonListener();
    addGuestLoginListener();
    addRememberMeCheckboxListener();
    loadRememberedCredentials();
    addInputListeners();
});

/**
 * Adds an event listener to the login button.
 * 
 * This function prevents the default form submission and checks the provided email and password against
 * the stored user data in the Firebase database.
 */
function addLoginButtonListener() {
    document.querySelector('.logIn').addEventListener('click', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('repeatPassword').value;
        checkEmailAndLogin(email, password);
    });
}

/**
 * Checks the provided email and password against the stored user data in Firebase.
 * 
 * This function sends a request to fetch the registered user information and handles the login process
 * based on the provided email and password.
 * 
 * @param {string} email - The email provided by the user.
 * @param {string} password - The password provided by the user.
 */
function checkEmailAndLogin(email, password) {
    fetch(`${BASE_URL}/registerInfo.json`)
        .then(response => response.json())
        .then(data => handleLoginResponse(data, email, password))
        .catch(error => handleLoginError(error));
}

/**
 * Handles the response from the login request and validates the user's credentials.
 * 
 * This function checks if the provided email exists and if the password matches. If successful, it logs the user in.
 * 
 * @param {Object} data - The user data fetched from Firebase.
 * @param {string} email - The email provided by the user.
 * @param {string} password - The password provided by the user.
 */
function handleLoginResponse(data, email, password) {
    if (data && data.email) {
        const emailIndex = data.email.indexOf(email);
        if (emailIndex === -1) {
            showInvalidMessage('invalid', 'Email or password invalid.', 'invalidEmail');
            showInvalidMessage('invalid', 'Email or password invalid.', 'invalidPassword');
        } else {
            validatePasswordAndLogin(data, emailIndex, password);
        }
    } else {
        alert('No users found in the database.');
    }
}

/**
 * Validates the user's password and logs them in if successful.
 * 
 * This function checks if the provided password matches the stored password. If valid, it stores the user's
 * information in local storage and redirects to the summary page.
 * 
 * @param {Object} data - The user data fetched from Firebase.
 * @param {number} emailIndex - The index of the user's email in the data array.
 * @param {string} password - The password provided by the user.
 */
async function validatePasswordAndLogin(data, emailIndex, password) {
    if (data.password[emailIndex] === password) {
        localStorage.setItem('loggedInUserName', data.name[emailIndex]);
        localStorage.setItem('loggedInUserEmail', data.email[emailIndex]);
        const contacts = await fetchContacts();
        if (contacts) {
            localStorage.setItem('contacts', JSON.stringify(contacts));
        } else {
            console.error('Failed to fetch contacts');
        }
        window.location.href = 'summary.html';
    } else {
        showInvalidMessage('invalid', 'Email or password invalid.', 'invalidPassword');
        showInvalidMessage('invalid', 'Email or password invalid.', 'invalidEmail');
    }
}

/**
 * Displays an invalid message on the login form.
 * 
 * This function updates the HTML content of the specified container with an error message and
 * applies the 'invalid' class to the relevant input fields.
 * 
 * @param {string} containerId - The ID of the container to display the message in.
 * @param {string} message - The message to display.
 * @param {string} className - The class name of the input field to mark as invalid.
 */
function showInvalidMessage(containerId, message, className) {
    document.getElementById(containerId).innerHTML = message;
    document.getElementById(className).classList.add('invalid');
}

/**
 * Handles errors during the login process.
 * 
 * This function displays an alert with the error message if the login process fails.
 * 
 * @param {Error} error - The error object containing details about the failure.
 */
function handleLoginError(error) {
    alert(`Error: ${error.message}`);
}

/**
 * Adds an event listener to the guest login button.
 * 
 * This function logs the user in as a guest and stores the username as 'Guest' in local storage.
 */
function addGuestLoginListener() {
    document.querySelector('.guestLogIn').addEventListener('click', function (event) {
        localStorage.setItem('loggedInUserName', 'Guest');
    });
}

/**
 * Adds an event listener to the "Remember Me" checkbox.
 * 
 * This function stores the user's credentials in local storage if the checkbox is checked, and
 * clears them if the checkbox is unchecked.
 */
function addRememberMeCheckboxListener() {
    const rememberMeCheckbox = document.querySelector('.check input[type="checkbox"]');
    rememberMeCheckbox.addEventListener('change', function () {
        const email = document.getElementById('email').value;
        const password = document.getElementById('repeatPassword').value;
        handleRememberMeChange(this.checked, email, password);
    });
}

/**
 * Handles the "Remember Me" checkbox state change.
 * 
 * This function stores or clears the user's credentials based on whether the checkbox is checked or unchecked.
 * 
 * @param {boolean} isChecked - The state of the checkbox.
 * @param {string} email - The email provided by the user.
 * @param {string} password - The password provided by the user.
 */
function handleRememberMeChange(isChecked, email, password) {
    if (isChecked) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
    } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        document.getElementById('email').value = '';
        document.getElementById('repeatPassword').value = '';
    }
}

/**
 * Loads the remembered credentials from local storage.
 * 
 * This function populates the email and password fields with the saved credentials if the "Remember Me" checkbox was previously checked.
 */
function loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('repeatPassword').value = rememberedPassword;
        document.querySelector('.check input[type="checkbox"]').checked = true;
    } else {
        document.getElementById('email').value = '';
        document.getElementById('repeatPassword').value = '';
    }
}

/**
 * Adds input listeners to clear invalid messages when the user types.
 * 
 * This function removes the 'invalid' class and clears error messages when the user begins typing in the input fields.
 */
function addInputListeners() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('repeatPassword');
    emailInput.addEventListener('input', function () {
        clearInvalidMessages();
    });
    passwordInput.addEventListener('input', function () {
        clearInvalidMessages();
    });
}

/**
 * Clears any invalid messages from the login form.
 * 
 * This function resets the invalid state for email and password fields by removing the 'invalid' class and clearing the error messages.
 */
function clearInvalidMessages() {
    document.getElementById('invalid').innerHTML = '';
    document.getElementById('invalidEmail').classList.remove('invalid');
    document.getElementById('invalidPassword').classList.remove('invalid');
}

/**
 * This function handles the overlay animation display logic. It checks if the sessionStorage
 * has a flag indicating whether the animation has already been played. If true, it hides the 
 * overlay and shows the main elements. If false, it checks the window width to apply specific 
 * animations, sets the sessionStorage flag, and then triggers the animation with a timeout.
 */
function animationCheck() {
    const overlay = document.querySelector('.overlay');
    if (sessionStorage.getItem('sessionStorageAnimation') === 'true') {
        if (overlay) {
            overlay.style.display = 'none';
            showElementsAnimationMobile();
        }
    } else {
        checkWindowWidth()
        sessionStorage.setItem('sessionStorageAnimation', 'true');
        overlay.style.display = 'flex';
        hideElementsAnimationMobile();
        setTimeout(() => {
            overlay.style.display = 'none';
            showElementsAnimationMobile();
        }, 2800);
    }
}

/**
 * This function checks the current window width and triggers specific animations 
 * based on different screen size breakpoints (1000px and 600px).
 */

function checkWindowWidth(){
    if (window.innerWidth < 1000) {
        animateOverlayUnder1000px();
    }if (window.innerWidth < 600) {
        animateLogoUnder600px();
    }
}

/**
 * This function animates the overlay for screen widths under 1000px. It changes the overlay's 
 * background color, applies appropriate CSS classes for the animation, and eventually hides 
 * the overlay after a delay.
 */
function animateOverlayUnder1000px() {
    let overlay = document.querySelector('.overlay');
    overlay.style.backgroundColor = 'transparent';
    if (window.innerWidth < 1000) {
        overlay.classList.remove('animationOverlayDekstop');
        overlay.classList.add('animationOverlayDekstopUnder1000px');
        hideElementsAnimationMobile();
    }
    setTimeout(() => {
        showElementsAnimationMobile();
        overlay.classList.add('d-none');
    }, 2800);
}

/**
 * This function handles the animation specifically for screen widths under 600px. 
 * It modifies the overlay and logo's styles, and triggers a sequence of animations.
 */
function animateLogoUnder600px() {
    let overlay = document.querySelector('.overlay');
    overlay.style.backgroundColor = 'var(--gray)';
    let animatedIcon = document.querySelector('.animated-icon');
    animatedIcon.src = "./assets/img/png/Join logo vector.png";
    if (window.innerWidth < 600) {
        overlay.classList.remove('animationOverlayDekstopUnder1000px');
        animatedIcon.classList.remove('animationLogoDekstop');
        animatedIcon.classList.add('animationLogoUnder600px');
    }
    setTimeOutsUnder600px()
}

/**
 * This function sets up the timeout logic for the animation sequence when the screen 
 * width is under 600px, including changing the overlay's background color and hiding it.
 */
function setTimeOutsUnder600px(){
    let overlay = document.querySelector('.overlay');
    setTimeout(() => {
        overlay.style.backgroundColor = 'transparent';
    }, 1600);
    setTimeout(() => {
        overlay.classList.add('d-none');
        showElementsAnimationMobile();
    }, 2800);
}

/**
 * This function hides specific elements on the mobile screen by adding the 'd-none' class, which presumably sets their display to none.
 */
function hideElementsAnimationMobile(){
    document.getElementById('registerContainer').classList.add('d-none')
    document.getElementById('signUpMobile').classList.add('d-none')
    document.querySelector('.headSection').classList.add('d-none')
    document.querySelector('.policy').classList.add('d-none')
}

/**
 * This function shows the elements on the mobile screen by removing the 'd-none' class, making them visible again.
 */
function showElementsAnimationMobile(){
    document.getElementById('registerContainer').classList.remove('d-none')
    document.getElementById('signUpMobile').classList.remove('d-none')
    document.querySelector('.headSection').classList.remove('d-none')
    document.querySelector('.policy').classList.remove('d-none')
}

/**
 * The window.onload event triggers the animationCheck function once the window has fully loaded, 
 * ensuring the animations and element visibility logic are handled correctly.
 */
window.onload = function () {
    animationCheck()
};