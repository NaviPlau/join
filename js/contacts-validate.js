/**
 * Validates the contact form and adds the contact if all validations pass.
 * 
 * This function checks the validity of the name, email, and phone fields. 
 * If all fields are valid, it adds the contact, closes the dialog, and opens a success dialog.
 */
function validateForm() {
    let isValid = true;

    if (!validateNameContact()) {
        isValid = false;
    }

    if (!validateEmailContact()) {
        isValid = false;
    }

    if (!validatePhoneContact()) {
        isValid = false;
    }

    if (isValid) {
        addContact();
        closeDialog();
        openDialogContact("Contact was successfully created");
    }
}

/**
 * Sets an error message on an input element and applies an error class.
 * 
 * @param {HTMLElement} inputElement - The input element to set the error on.
 * @param {string} message - The error message to display as the placeholder.
 */
function setError(inputElement, message) {
    inputElement.dataset.originalPlaceholder = inputElement.placeholder;
    inputElement.placeholder = message;
    inputElement.classList.add('error');
}

/**
 * Clears the error message and removes the error class from an input element.
 * 
 * @param {HTMLElement} inputElement - The input element to clear the error from.
 */
function clearError(inputElement) {
    if (inputElement.dataset.originalPlaceholder) {
        inputElement.placeholder = inputElement.dataset.originalPlaceholder;
    }
    inputElement.classList.remove('error');
}

/**
 * Validates the contact's name field.
 * 
 * The name must consist of two words (first and last name), and each word must only contain letters.
 * The total length of the name must not exceed 20 characters.
 * 
 * @returns {boolean} Returns `true` if the name is valid, otherwise `false`.
 */
function validateNameContact() {
    const nameInput = document.getElementById('name');
    
    nameInput.removeEventListener('input', clearErrorOnInput);
    nameInput.addEventListener('input', clearErrorOnInput);
    
    if (!nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) || nameInput.value.length > 20) {
        setError(nameInput, 'John Doe 20 Letters');
        nameInput.value = '';
        return false;
    } else {
        clearError(nameInput);
        return true;
    }
}

/**
 * Event handler that clears the error state from an input field when the user modifies its content.
 * 
 * This function is triggered by an `input` event on an input field. It calls the `clearError` 
 * function, which removes any error messages or styling from the targeted input field.
 * 
 * @param {Event} event - The input event object, which contains information about the event 
 *                        that triggered the handler, including the target input element.
 */
function clearErrorOnInput(event) {
    clearError(event.target);
}


/**
 * Validates the contact's email field.
 * 
 * The email must be in a valid format (e.g., test@test.com).
 * 
 * @returns {boolean} Returns `true` if the email is valid, otherwise `false`.
 */
function validateEmailContact() {
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        clearError(emailInput);
    });
    if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError(emailInput, '(test@test.test)');
        emailInput.value = '';
        return false;
    } else {
        clearError(emailInput);
        return true;
    }
}

/**
 * Validates the contact's phone field.
 * 
 * The phone number must only contain digits.
 * 
 * @returns {boolean} Returns `true` if the phone number is valid, otherwise `false`.
 */
function validatePhoneContact() {
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        clearError(phoneInput);
    });
    if (!phoneInput.value.match(/^\d+$/)) {
        setError(phoneInput, '(0176123123)');
        phoneInput.value = '';
        return false;
    } else {
        clearError(phoneInput);
        return true;
    }
}

/**
 * Validates the edit contact form and saves the edited contact if all validations pass.
 * 
 * This function checks the validity of the name, email, and phone fields in the edit form. 
 * If all fields are valid, it saves the edited contact.
 */
function validateEditForm() {
    let isValid = true;
    if (!validateNameContactEdit()) {
        isValid = false;
    }
    if (!validateEmailContactEdit()) {
        isValid = false;
    }
    if (!validatePhoneContactEdit()) {
        isValid = false;
    }
    if (isValid) {
        editContact();
    }
}

/**
 * Validates the contact's name field in the edit form.
 * 
 * The name must consist of two words (first and last name), and each word must only contain letters.
 * The total length of the name must not exceed 20 characters.
 * 
 * @returns {boolean} Returns `true` if the name is valid, otherwise `false`.
 */
function validateNameContactEdit() {
    const nameInput = document.getElementById('inputEditName');
    const namePattern = /^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/;
    nameInput.addEventListener('input', function() {
        clearError(nameInput);
    });
    if (!nameInput.value.match(namePattern) || nameInput.value.length > 20) {
        setError(nameInput, 'John Doe 20 Letters');
        nameInput.value = '';
        return false;
    } else {
        clearError(nameInput);
        return true;
    }
}

/**
 * Validates the contact's email field in the edit form.
 * 
 * The email must be in a valid format (e.g., test@test.com).
 * 
 * @returns {boolean} Returns `true` if the email is valid, otherwise `false`.
 */
function validateEmailContactEdit() {
    const emailInput = document.getElementById('inputEditEmail');
    emailInput.addEventListener('input', function() {
        clearError(emailInput);
    });
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.match(emailPattern)) {
        setError(emailInput, '(test@test.de)');
        emailInput.value = '';
        return false;
    } else {
        clearError(emailInput);
        return true;
    }
}

/**
 * Validates the contact's phone field in the edit form.
 * 
 * The phone number must only contain digits.
 * 
 * @returns {boolean} Returns `true` if the phone number is valid, otherwise `false`.
 */
function validatePhoneContactEdit() {
    const phoneInput = document.getElementById('inputEditPhone');
    phoneInput.addEventListener('input', function() {
        clearError(phoneInput);
    });
    const phonePattern = /^\d+$/;
    if (!phoneInput.value.match(phonePattern)) {
        setError(phoneInput, '(0176123123)');
        phoneInput.value = '';
        return false;
    } else {
        clearError(phoneInput);
        return true;
    }
}
