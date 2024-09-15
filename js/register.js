/**
 * The base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL = "https://join-57676-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * An object to hold the registration information.
 * @type {Object}
 * @property {Array<string>} name - Array of names.
 * @property {Array<string>} email - Array of email addresses.
 * @property {Array<string>} password - Array of passwords.
 * @property {Array<string>} repeatPassword - Array of repeated passwords.
 */
let registerInfo = {
  name: [],
  email: [],
  password: [],
  repeatPassword: []
};

/**
 * Fetches the registration information from Firebase and updates the `registerInfo` object.
 * @async
 * @returns {Promise<void>}
 */
async function fetchRegisterInfo() {
  try {
    let response = await fetch(BASE_URL + "registerInfo.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    if (data) {
      registerInfo = data; 
    }
  } catch (error) {
    console.error('Error fetching registerInfo from Firebase:', error);
  }
}

/**
 * Saves the current `registerInfo` object to Firebase.
 * @async
 * @returns {Promise<void>}
 */
async function saveRegisterInfoToFirebase() {
  try {
    let response = await fetch(BASE_URL + "registerInfo.json", {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerInfo)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    await response.json();
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}

/**
 * Adds new registration information to the `registerInfo` object.
 * @param {Object} newRegisterInfo - The new registration information to add.
 * @param {string} newRegisterInfo.name - The name of the user.
 * @param {string} newRegisterInfo.email - The email of the user.
 * @param {string} newRegisterInfo.password - The password of the user.
 * @param {string} newRegisterInfo.repeatPassword - The repeated password of the user.
 */
function addRegisterInfo(newRegisterInfo) {
  registerInfo.name.push(newRegisterInfo.name);
  registerInfo.email.push(newRegisterInfo.email);
  registerInfo.password.push(newRegisterInfo.password);
  registerInfo.repeatPassword.push(newRegisterInfo.repeatPassword);
}

/**
 * Validates the format of the given name. The name must contain exactly two words and no numbers.
 * @param {string} name - The name to validate.
 * @returns {boolean} `true` if the name is valid, otherwise `false`.
 */
function validateName(name) {
  let words = name.trim().split(/\s+/);
  if (/\d/.test(name)) {
    document.getElementById('invalidName').classList.add('invalid');
    return false;
  }
  
  if (words.length !== 2) {
    document.getElementById('invalidName').classList.add('invalid');
    return false;
  } else {
    document.getElementById('invalidName').classList.remove('invalid');
    return true;
  }
}

/**
 * Handles the form submission event, validates the form, and submits the registration information.
 * @param {Event} event - The form submission event.
 * @async
 * @returns {Promise<void>}
 */
async function handleFormSubmit(event) {
  event.preventDefault(); 
  const registerInfo = extractFormValues();
  if (!validateForm(registerInfo)) {
    return;
  }
  if (await isEmailInUse(registerInfo.email)) {
    displayEmailInUseError();
    return;
  }
  await submitRegistration(registerInfo);
}

/**
 * Extracts the form values and returns them as an object.
 * @returns {Object} The form values.
 * @returns {string} return.name - The name input.
 * @returns {string} return.email - The email input.
 * @returns {string} return.password - The password input.
 * @returns {string} return.repeatPassword - The repeated password input.
 */
function extractFormValues() {
  return {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    repeatPassword: document.getElementById('repeatPassword').value
  };
}

/**
 * Validates the registration form.
 * @param {Object} registerInfo - The registration information to validate.
 * @returns {boolean} `true` if the form is valid, otherwise `false`.
 */
function validateForm(registerInfo) {
  if (!validateName(registerInfo.name)) {
    displayNameError();
    return false;
  }
  if (!displayRequiredPasswordFormat()) {
    return false;
  }
  if (registerInfo.password !== registerInfo.repeatPassword) {
    displayPasswordMismatchError();
    return false;
  }
  if (!document.getElementById('acceptPolicy').checked) {
    displayPolicyError();
    return false;
  }
  return true;
}

/**
 * Displays an error message for an invalid name.
 */
function displayNameError() {
  document.getElementById('wrongRepeat').innerHTML = `Name must contain exactly two words and no numbers`;
}

/**
 * Displays an error message for not accepting the privacy policy.
 */
function displayPolicyError() {
  document.getElementById('wrongRepeat').innerHTML = `You must accept our Privacy Policy`;
}

/**
 * Validates the password format and displays an error message if it is invalid.
 * The password must be at least 8 characters long and contain numbers, upper, and lowercase letters.
 * @returns {boolean} `true` if the password format is valid, otherwise `false`.
 */
function displayRequiredPasswordFormat() {
  let password = document.getElementById('password').value;
  let passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
  if (password.length < 8) {
    document.getElementById('wrongRepeat').innerHTML = `Password must be at least 8 characters long.`;
    document.getElementById('invalidPassword').classList.add('invalid');
    return false;
  }
  if (!passwordPattern.test(password)) {
    document.getElementById('wrongRepeat').innerHTML = `Password must have at least numbers, upper and lowercase letters`;
    document.getElementById('invalidPassword').classList.add('invalid');
    return false;
  }
  return true;
}

/**
 * Displays an error message when the passwords do not match.
 */
function displayPasswordMismatchError() {
  document.getElementById('wrongRepeat').innerHTML = `The passwords don't match`;
  document.getElementById('invalid').classList.add('invalid');
}

/**
 * Checks if the given email is already in use.
 * @param {string} email - The email to check.
 * @async
 * @returns {Promise<boolean>} `true` if the email is in use, otherwise `false`.
 */
async function isEmailInUse(email) {
  await fetchRegisterInfo(); 
  return registerInfo.email.includes(email);
}

/**
 * Displays an error message when the email is already in use or invalid.
 */
function displayEmailInUseError() {
  document.getElementById('wrongRepeat').innerHTML = `Email already in use or invalid!`;
  document.getElementById('invalidEmail').classList.add('invalid');
}

/**
 * Submits the registration information by adding it to `registerInfo` and saving it to Firebase.
 * @param {Object} registerInfo - The registration information to submit.
 * @async
 * @returns {Promise<void>}
 */
async function submitRegistration(registerInfo) {
  addRegisterInfo(registerInfo); 
  await saveRegisterInfoToFirebase(); 
  showSuccessMessage();
}

/**
 * Displays a success message and redirects to the index page after a delay.
 */
function showSuccessMessage() {
  let successButton = document.getElementById('signedUpCont');
  successButton.classList.remove('d-none');
  document.getElementById('signedUp').classList.add('animation');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);
}

/**
 * Initializes event listeners when the DOM content is loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('form').addEventListener('submit', handleFormSubmit);
  document.getElementById('email').addEventListener('input', resetErrorState);
  document.getElementById('password').addEventListener('input', resetErrorState);
  document.getElementById('repeatPassword').addEventListener('input', resetErrorState);
  document.getElementById('name').addEventListener('input', resetErrorState); 
});

/**
 * Toggles the visibility of the password input field between text and password.
 */
function showPassword() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
    document.getElementById('visibility').src = "assets/img/png/visibility.png";
  } else {
    x.type = "password";
    document.getElementById('visibility').src = "assets/img/png/visibility_off.png";
  }
}

/**
 * Resets the error state by clearing error messages and removing invalid classes.
 */
function resetErrorState() {
  document.getElementById('wrongRepeat').innerHTML = ''; 
  document.getElementById('invalid').classList.remove('invalid');
  document.getElementById('invalidEmail').classList.remove('invalid');  
  document.getElementById('invalidName').classList.remove('invalid'); 
  document.getElementById('invalidPassword').classList.remove('invalid');
  document.getElementById('policyInvalid').classList.remove('invalid');
}
