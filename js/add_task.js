
let clickCount = 0;
let choosenCategory = false;
let category = ["User Story", "Technical task"];
let activeButton = 2;
let selectedContacts = [];
let contacts = localStorage.getItem('contacts');
let subtaskInfos = [];

/**
 * Checks if the 'contacts' data is available in its stringified form.
 * 
 * If the 'contacts' data exists (i.e., is not null or undefined), it parses the JSON string 
 * to convert it into a JavaScript object or array. If the 'contacts' data does not exist, 
 * it initializes 'contacts' as an empty array.
 * 
 * @type {string|null} contacts - The stringified JSON data from storage.
 * @returns {Array|Object} contacts - The parsed contacts data, or an empty array if no data is found.
 */
if (contacts) {
  contacts = JSON.parse(contacts);
} else {
  contacts = [];
}


/**
 * Handles the form submission event.
 * 
 * This function validates the form before submission. If the form is invalid, the submission is prevented.
 * 
 * @param {Event} event - The form submission event.
 */
function submitForm(event) {
  if (!validateForm()) {
    event.preventDefault();
  } else {
    document.getElementById('taskForm').submit();
  }
}

/**
 * Validates the task form.
 * 
 * This function checks if the required inputs are filled out and if a category is selected. If the form is invalid,
 * it marks the invalid fields and returns false.
 * 
 * @returns {boolean} True if the form is valid, otherwise false.
 */
function validateForm() {
  resetInvalidStates();
  let validInputs = validateInputs();
  let validCategory = validateFormCategory();
  let valid = validInputs && validCategory;
  validateFormTimeout();
  return valid;
}

/**
 * Validates the input fields within the task form.
 * 
 * This function checks each required input field and ensures that it is filled out. It also validates the date input.
 * 
 * @returns {boolean} True if all required inputs are valid, otherwise false.
 */
function validateInputs() {
  const form = document.getElementById('taskForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  let valid = true;
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
    if (input.required && !input.value.trim()) {
      valid = false;
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }
    validateDateInput(input);
  });
  
  return valid;
}

/**
 * Resets the invalid state of form elements.
 * 
 * This function removes the 'invalid' class from all input containers and the category dropdown.
 */
function resetInvalidStates() {
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');
}

/**
 * Validates the date input field.
 * 
 * This function checks if the selected date is in the future or today. If not, it marks the date input as invalid.
 * 
 * @param {HTMLInputElement} input - The date input element to validate.
 */
function validateDateInput(input) {
  if (input.type === 'date') {
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      valid = false;
      const parentP = input.closest('.inputContainer');
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }
  }
}

/**
 * Shows the category dropdown when the user clicks on the category dropdown.
 * 
 * This function toggles the visibility of the category dropdown based on the click count.
 */
document.getElementById("dropdownCategory").addEventListener("click", function() {
  clickCount++;
  if (clickCount % 2 === 1) {
    showCategory();
  } else {
    hideCategory();
  }
});

/**
 * Handles clicks outside the category dropdown to close it.
 * 
 * @param {Event} event - The click event.
 */
function handleClickOutside(event) {
  const container = document.getElementById('dropdownCategory');
  if (!container.contains(event.target)) {
    hideCategory();
  }
}

document.addEventListener('click', handleClickOutside);

/**
 * Adds event listeners to input and textarea fields to remove the invalid state when the user starts typing.
 */
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', function() {
    const parentP = input.closest('.inputContainer');
    if (parentP && input.value.trim()) {
      parentP.classList.remove('invalid');
    }
  });
});

/**
 * Removes the invalid state from the category dropdown when a category is selected.
 */
document.getElementById('dropdownCategory').addEventListener('click', function() {
  if (choosenCategory) {
    document.getElementById('dropdownCategory').classList.remove('invalid');
  }
});

/**
 * Handles clicks outside the contacts dropdown to close it.
 * 
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function(event) {
  let contactsContainer = document.getElementById('contacts');
  let dropdownContacts = document.getElementById('dropdownContacts');
  if (!contactsContainer.classList.contains('d-none') && !dropdownContacts.contains(event.target) && !contactsContainer.contains(event.target)) {
    contactsContainer.classList.add('d-none');
    document.getElementById('dropDownContactsImg').classList.add('dropDownImg');
    document.getElementById('dropDownContactsImg').classList.remove('dropUpImg');
  }
});

/**
 * Initiates the process for writing a new subtask.
 * 
 * This function displays the subtask input field and sets up event listeners for adding a subtask.
 */
function writeSubtask() {
  let subtaskArea = document.getElementById('subtaskContainer');
  subtaskArea.innerHTML = returnWriteSubtaskHtmlAddTask();
  let inputField = document.getElementById('subtaskInput');
  document.querySelectorAll('.addSubtask img').forEach(function(image) {
      image.addEventListener('mousedown', function(event) {
          event.preventDefault(); 
      });
  });
  inputField.addEventListener('focusout', function(event) {
    resetSubtask();
  });
  inputField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault(); 
          addSubtask(); 
      }
  });
  inputField.focus();
}

/**
 * Adds a new subtask to the list.
 * 
 * This function validates the subtask input and adds it to the subtask list if valid.
 */
function addSubtask() {
  let subtaskInput = document.getElementById('subtaskInput');
  let subtaskInfo = subtaskInput.value;
  if (subtaskInfo.length < 3) {
    subtaskInput.value = ''; 
    subtaskInput.placeholder = 'Min 3 characters needed'; 
    subtaskInput.style.borderColor = 'red'; 
    return; 
  } else {
    subtaskInput.placeholder = 'Enter subtask'; 
    subtaskInput.style.borderColor = ''; 
  }
  subtaskInfos.push(subtaskInfo);
  showSubtasks();
  resetSubtask();
}

/**
 * Resets the subtask input field.
 * 
 * This function clears the subtask input area.
 */
function resetSubtask() {
  document.getElementById('subtaskContainer').innerHTML = returnResetSubtaskHtml();
}

/**
 * Displays the list of subtasks in the task form.
 * 
 * This function renders each subtask in the subtask list.
 */
function showSubtasks() {
  let newSubtask = document.getElementById('newSubtasks');
  newSubtask.innerHTML = '';
  for (let s = 0; s < subtaskInfos.length; s++) {
    newSubtask.innerHTML += returnShowAddTaskSubtaskHTML(subtaskInfos[s], s);
  }
}

/**
 * Shows the actions (edit, delete) for a subtask when the user hovers over it.
 * 
 * @param {HTMLElement} element - The subtask element being hovered over.
 */
function showActions(element) {
  let actions = element.querySelector('.subtask-icons');
  if (actions) {
    actions.classList.remove('d-none');
  }
}

/**
 * Hides the actions (edit, delete) for a subtask when the user stops hovering over it.
 * 
 * @param {HTMLElement} element - The subtask element being hovered over.
 */
function hideActions(element) {
  let actions = element.querySelector('.subtask-icons');
  if (actions) {
    actions.classList.add('d-none');
  }
}

/**
 * Updates the HTML for a specific subtask based on its index.
 * 
 * @param {number} index - The index of the subtask to be updated.
 */
function updateSubtaskHtml(index) {
  let newSubtask = document.getElementById('newSubtasks');
  if (index >= 0) {
      newSubtask.innerHTML = returnEditSubtaskAddtaskIfHtml(index);
  } else {
      newSubtask.innerHTML = returnEditSubtaskAddTaskElseHtml(index);
  }
}

/**
 * Edits a subtask by displaying an input field for editing.
 * 
 * @param {number} index - The index of the subtask to be edited.
 */
function editSubtask(index) {
  updateSubtaskHtml(index);
  let inputField = document.getElementById('editSubtaskInput');
  if (inputField) {
      inputField.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
              event.preventDefault(); 
              saveSubtask(index); 
          }
      });
      inputField.focus(); 
  }
}

/**
 * Saves the edited subtask to the subtask list.
 * 
 * This function validates the edited subtask and updates the list.
 * 
 * @param {number} index - The index of the subtask to be saved.
 */
function saveSubtask(index) {
  let editInput = document.getElementById('editSubtaskInput');
  let editedSubtask = editInput.value;
  if (editedSubtask.length < 3) {
    editInput.value = ''; 
    editInput.placeholder = 'Min 3 characters needed'; 
    editInput.style.borderColor = 'red'; 
    return; 
  } else {
    editInput.placeholder = ''; 
    editInput.style.borderColor = ''; 
  }
  subtaskInfos[index] = editedSubtask;
  showSubtasks();
}

/**
 * Deletes a subtask from the subtask list.
 * 
 * @param {number} index - The index of the subtask to be deleted.
 */
function deleteSubtask(index) {
  subtaskInfos.splice(index, 1);
  showSubtasks();
}

/**
 * Handles the form submission when the create button is clicked.
 * 
 * This function validates the form, collects data, and sends it to Firebase. If successful, it shows a success message.
 * 
 * @param {Event} event - The click event.
 */
document.querySelector('.createButton').addEventListener('click', async function(event) {
  event.preventDefault(); 
  if (validateForm()) {
    collectData(); 
    try {
      await sendTaskDataToFirebase(); 
      showSuccessMessage(); 
    } catch (error) {
      console.error('Failed to send task data to Firebase:', error); 
    }
  } 
});

/**
 * Handles the clear button click to reset the form fields and states.
 * 
 * This function resets all form fields, selections, and invalid states.
 * 
 * @param {Event} event - The click event.
 */
document.getElementById('clearButton').addEventListener('click', function(event) {
  const form = document.getElementById('taskForm');
  form.reset();
  document.getElementById('dropdownCategory').innerHTML = returnAddTaskDropCategoryHtml();
  document.getElementById('assignedContacts').innerHTML = ``;
  document.getElementById('newSubtasks').innerHTML = ``;
  choosenCategory = false;
  clickCount = 0;
  selectedContacts = [];
  subtaskInfos = [];
  handleClick(2); 
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');
});

/**
 * Displays a success message after the task is successfully created.
 * 
 * This function shows a success message and redirects the user to the board page after a delay.
 */
function showSuccessMessage() {
  let successButton = document.getElementById('signedUpCont');
  successButton.classList.remove('d-none');
  document.getElementById('signedUp').classList.add('animation');
  setTimeout(() => {
    window.location.href = 'board.html';
  }, 3000);
}
