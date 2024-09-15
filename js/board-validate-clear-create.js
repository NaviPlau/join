/**
 * Clears the task form and resets the form fields to their default state.
 * 
 * This function resets the task form, clears selected category, assigned contacts, 
 * and subtasks, and resets other related variables and elements to their initial state.
 */
function clearForm() {
  const form = document.getElementById('taskFormAddTask');
  form.reset();
  document.getElementById('dropdownCategory').innerHTML = `
    <span class="spanCategory">Select task category</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
  `;
  document.getElementById('assignedContacts').innerHTML = ``;
  document.getElementById('newSubtasksAddTask').innerHTML = ``;
  choosenCategory = false;
  clickCount = 0;
  selectedContacts = [];
  addTaskBoardInfos = [];
  handleClick(5);
}

/**
 * Validates the task form before submitting.
 * 
 * This function checks all input fields, category selection, and other required fields 
 * in the task form to ensure they are correctly filled out.
 * 
 * @returns {boolean} Returns `true` if the form is valid, otherwise `false`.
 */
function validateFormAddTaskBoard() {
  clearValidationErrors();
  const form = document.getElementById('taskFormAddTask');
  const inputs = form.querySelectorAll('input, textarea, select');
  const validInputs = validateInputFields(inputs);
  const validCategory = validateCategorySelection(choosenCategory);
  setTimeout(() => clearValidationErrors(), 2000);
  return validInputs && validCategory;
}

/**
 * Validates the task category selection.
 * 
 * This function checks if a task category has been selected and highlights the category dropdown if not.
 * 
 * @param {boolean} choosenCategory - Indicates whether a category has been chosen.
 * @returns {boolean} Returns `true` if a category is selected, otherwise `false`.
 */
function validateCategorySelection(choosenCategory) {
  if (!choosenCategory) {
    document.getElementById('dropdownCategory').classList.add('invalid');
    return false;
  }
  return true;
}

/**
 * Validates the input fields in the task form.
 * 
 * This function checks if required fields are filled and if date fields have valid values.
 * 
 * @param {NodeList} inputs - A list of input elements to validate.
 * @returns {boolean} Returns `true` if all inputs are valid, otherwise `false`.
 */
function validateInputFields(inputs) {
  let valid = true;
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainerAddTask');
    if (input.required && !input.value.trim()) {
      valid = false;
      parentP?.classList.add('invalid');
    }
    if (input.type === 'date' && new Date(input.value) < new Date().setHours(0, 0, 0, 0)) {
      valid = false;
      parentP?.classList.add('invalid');
    }
  });
  return valid;
}

/**
 * Clears all validation error indicators from the task form.
 * 
 * This function removes the 'invalid' class from all input containers and the category dropdown.
 */
function clearValidationErrors() {
  document.querySelectorAll('.inputContainerAddTask')
    .forEach(p => p.classList.remove('invalid'));
  document.getElementById('dropdownCategory')
    .classList.remove('invalid');
}

/**
 * Handles the click event for creating a new task.
 * 
 * This function validates the task form, collects task data, sends it to Firebase,
 * clears the form, and closes the task creation dialog.
 * 
 * @returns {Promise<void>} A promise that resolves when the task data has been sent.
 */
async function handleCreateButtonClick() {
  if (validateFormAddTaskBoard()) {
    const taskData = collectData();
    if (taskData) {
      try {
        await sendTaskDataToFirebaseAddTask(taskData); 
        clearForm();
        closeAddTaskBoard();
      } catch (error) {
        console.error('Failed to send task data to Firebase:', error); 
      }
    } else {
      console.error('Task data collection failed');
    }
  } 
}

/**
 * Submits the task form if validation passes.
 * 
 * This function prevents the default form submission if validation fails.
 * 
 * @param {Event} event - The form submission event.
 */
function submitForm(event) {
  if (!validateFormAddTaskBoard()) {
    event.preventDefault();
  } else {
    document.getElementById('taskFormAddTask').submit();
  }
}

/**
 * Displays a success message when a task is successfully added.
 * 
 * This function shows a success message in the UI for a short period.
 */
function showSuccessMessageAddTask() {
  const successContainer = document.getElementById('successContainer');
  const successMessageAddTask = document.getElementById('sucessMessageAddTask');
  if (!successContainer) {
      console.warn("Element with id 'successContainer' not found");
      return;
  }
  if (!successMessageAddTask) {
      console.warn("Element with id 'sucessMessageAddTask' not found");
      return;
  }
  successContainer.classList.remove('d-none');
  successMessageAddTask.innerHTML = `Your task was added to ${addTaskColumn}`;
  setTimeout(() => {
    successContainer.classList.add('d-none');
  }, 1000);
}
