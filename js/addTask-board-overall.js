/**
 * Displays the category dropdown menu for selecting a task category.
 * 
 * This function renders the category options and updates the dropdown icon to indicate that the dropdown is open.
 */
function showCategory() {
  let categories = document.getElementById('categories');
  categories.innerHTML = returnShowCategoryOverallHtml();
  document.getElementById('categories').classList.remove('d-none');
  document.getElementById('dropDownImg').classList.remove('dropDownImg');
  document.getElementById('dropDownImg').classList.add('dropUpImg');
  choosenCategory = false;
}

/**
 * Sets the selected category for the task and updates the UI to reflect the chosen category.
 * 
 * This function hides the category dropdown and marks the selected category as valid.
 * 
 * @param {number} index - The index of the selected category.
 */
function chooseCategory(index) {
  let chooseCategory = document.getElementById('dropdownCategory');
  chooseCategory.innerHTML = returnChooseCategoryOverallHTML(index);
  document.getElementById('categories').classList.add('d-none');
  choosenCategory = true;
  clickCount = 0;
  document.getElementById('dropDownImg').classList.add('dropDownImg');
  document.getElementById('dropdownCategory').classList.remove('invalid');
}

/**
 * Hides the category dropdown menu.
 * 
 * This function updates the dropdown icon to indicate that the dropdown is closed.
 */
function hideCategory() {
  document.getElementById('dropDownImg').classList.add('dropDownImg');
  document.getElementById('dropDownImg').classList.remove('dropUpImg');
  document.getElementById('categories').classList.add('d-none');
  clickCount = 0;
}

/**
 * Displays the list of contacts for assigning to a task.
 * 
 * This function renders the contact list and adds event listeners to handle contact selection.
 */
function showContacts() {
  let container = document.getElementById('contacts');
  container.innerHTML = contacts.map((c, i) => returnShowContactsOverallHTML(c, i)).join('');
  Array.from(container.getElementsByClassName('contactsOpen')).forEach(el => {
    el.addEventListener('click', function() {
      let contact = contacts[this.getAttribute('data-index')];
      let selectedIndex = selectedContacts.findIndex(c => c.name === contact.name);
      selectedIndex === -1 ? selectedContacts.push(contact) : selectedContacts.splice(selectedIndex, 1);
      this.classList.toggle('selected');
      showAssignedContacts();
    });
  });
}

/**
 * Toggles the visibility of the contacts dropdown menu.
 * 
 * This function shows or hides the contacts dropdown and updates the dropdown icon accordingly.
 */
function toggleContacts() {
  let container = document.getElementById('contacts');
  let img = document.getElementById('dropDownContactsImg');
  if (container.classList.toggle('d-none')) {
    img.classList = 'dropDownImg';
  } else {
    img.classList = 'dropUpImg';
    showContacts();
  }
}

/**
 * Displays the selected contacts in the assigned contacts area.
 * 
 * This function shows the initials of up to five selected contacts and indicates how many more are selected if there are more than five.
 */
function showAssignedContacts() {
  let container = document.getElementById('assignedContacts');
  container.innerHTML = '';
  let maxToShow = 5;
  let totalContacts = selectedContacts.length;
  for (let i = 0; i < Math.min(totalContacts, maxToShow); i++) {
    container.innerHTML += renderAssignedContactsHTML(selectedContacts[i]);
  }
  if (totalContacts > maxToShow) {
    let moreCount = totalContacts - maxToShow;
    let moreContactsColor = "#e3e3e3"; 
    container.innerHTML += `
      <div class="contactInitials more-contacts" style="background-color: ${moreContactsColor};">
        +${moreCount}
      </div>
    `;
  }
}

/**
 * Sets the minimum date for date input fields to the current date.
 * 
 * This function ensures that users cannot select a date earlier than today.
 */
function setMinDate() {
  const dateInputs = ['dateInputAddTask', 'dateInput']; 
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayDate = `${yyyy}-${mm}-${dd}`;
  dateInputs.forEach(id => {
    const dateInput = document.getElementById(id);
    if (dateInput) { 
      dateInput.min = todayDate;
    }
  });
}

/**
 * Resets the previously active priority button to its default state.
 * 
 * @param {number|null} activeButton - The currently active button number, or `null` if none.
 */
function resetPreviousButton(activeButton) {
  if (activeButton === null) return;
  const previousButton = document.getElementById('button' + activeButton);
  const previousImage = document.getElementById('prioImg' + activeButton);
  previousButton.classList.add('hover-shadow');
  previousButton.style = '';
  previousImage.src = getImageSource(activeButton, false);
}

/**
 * Updates the currently active priority button to reflect its active state.
 * 
 * @param {number} buttonNumber - The number of the button to activate.
 */
function updateActiveButton(buttonNumber) {
  const activeButtonElement = document.getElementById('button' + buttonNumber);
  const activeImage = document.getElementById('prioImg' + buttonNumber);
  activeButtonElement.classList.remove('hover-shadow');
  activeButtonElement.style.color = 'white';
  activeButtonElement.style.fontWeight = '600';
  activeButtonElement.style.backgroundColor = getButtonColor(buttonNumber);
  activeImage.src = getImageSource(buttonNumber, true);
}

/**
 * Handles the click event on a priority button.
 * 
 * This function resets the previously active button, sets the new button as active, and updates the UI accordingly.
 * 
 * @param {number} buttonNumber - The number of the button that was clicked.
 */
function handleClick(buttonNumber) {
  resetPreviousButton(activeButton);
  activeButton = buttonNumber;
  updateActiveButton(buttonNumber);
}

/**
 * Gets the background color associated with a priority button.
 * 
 * @param {number} buttonNumber - The number of the priority button.
 * @returns {string} The background color for the specified button.
 */
function getButtonColor(buttonNumber) {
  switch (buttonNumber) {
    case 1:
    case 4:
      return '#FF3D00';
    case 2:
    case 5:
      return '#FFA800';
    case 3:
    case 6:
      return '#7AE229';
  }
}

/**
 * Gets the image source for a priority button based on its state (active or inactive).
 * 
 * @param {number} buttonNumber - The number of the priority button.
 * @param {boolean} isActive - Whether the button is currently active.
 * @returns {string} The image source path for the button.
 */
function getImageSource(buttonNumber, isActive) {
  const state = isActive ? 'White' : '';
  switch (buttonNumber) {
    case 1:
      return `assets/img/${isActive ? 'png' : 'svg'}/urgent${state}.${isActive ? 'png' : 'svg'}`;
    case 2:
      return `assets/img/${isActive ? 'svg' : 'png'}/medium${state ? '' : 'Color'}.${isActive ? 'svg' : 'png'}`;
    case 3:
      return `assets/img/${isActive ? 'png' : 'svg'}/low${state}.${isActive ? 'png' : 'svg'}`;
    case 4:
      return `./assets/img/${isActive ? 'png' : 'svg'}/urgent${state}.${isActive ? 'png' : 'svg'}`;
    case 5:
      return `./assets/img/${isActive ? 'svg' : 'png'}/medium${state ? '' : 'Color'}.${isActive ? 'svg' : 'png'}`;
    case 6:
      return `./assets/img/${isActive ? 'png' : 'svg'}/low${state}.${isActive ? 'png' : 'svg'}`;
  }
}

/**
 * Collects all the data from the task creation form.
 * 
 * This function gathers the task title, description, due date, priority, category, assigned contacts, subtasks, and column.
 * 
 * @returns {Object} The collected task data.
 */
function collectData() {
  const form = getFormAddTask();
  if (!form) return console.info('No form found');

  return {
    title: getInputValueAddTask(form, 'input[type="text"]'),
    description: getInputValueAddTask(form, 'textarea'),
    dueDate: getInputValueAddTask(form, 'input[type="date"]'),
    priority: getPriorityAddTask(activeButton),
    category: getCategoryAddTask(),
    assignedContacts: getAssignedContactsAddTask(),
    subtasks: getSubtasksAddTask(form),
    column: getColumnAddTask(form)
  };
}

/**
 * Retrieves the task creation form element.
 * 
 * This function returns the form element from the DOM, handling different possible form IDs.
 * 
 * @returns {HTMLFormElement|null} The form element, or `null` if not found.
 */
function getFormAddTask() {
  return document.getElementById('taskForm') || document.getElementById('taskFormAddTask');
}

/**
 * Retrieves the value of an input field within the task creation form.
 * 
 * @param {HTMLFormElement} form - The task creation form element.
 * @param {string} selector - The CSS selector for the input field.
 * @returns {string} The value of the input field.
 */
function getInputValueAddTask(form, selector) {
  return form.querySelector(selector).value;
}

/**
 * Retrieves the selected priority level based on the active button.
 * 
 * @param {number} activeButton - The number of the active priority button.
 * @returns {string} The priority level ('Urgent', 'Medium', 'Low').
 */
function getPriorityAddTask(activeButton) {
  switch (activeButton) {
    case 1:
    case 4:
      return 'Urgent';
    case 2:
    case 5:
      return 'Medium';
    case 3:
    case 6:
      return 'Low';
    default:
      console.error("Invalid activeButton value");
      return '';
  }
}

/**
 * Retrieves the selected task category from the dropdown.
 * 
 * @returns {string} The selected category name.
 */
function getCategoryAddTask() {
  return document.getElementById('dropdownCategory').querySelector('span').innerText;
}

/**
 * Retrieves the list of selected contacts for the task.
 * 
 * @returns {Array<Object>} The list of selected contact objects.
 */
function getAssignedContactsAddTask() {
  return selectedContacts || [];
}

/**
 * Retrieves the list of subtasks from the task creation form.
 * 
 * @param {HTMLFormElement} form - The task creation form element.
 * @returns {Array<Object>} The list of subtask objects, each containing a title and completed status.
 */
function getSubtasksAddTask(form) {
  const subtasks = form.id === 'taskForm' ? subtaskInfos : addTaskBoardInfos || [];
  return subtasks.map(subtask => ({ title: subtask, completed: false }));
}

/**
 * Retrieves the column for the task based on the form.
 * 
 * @param {HTMLFormElement} form - The task creation form element.
 * @returns {string} The column name where the task will be placed.
 */
function getColumnAddTask(form) {
  return form.id === 'taskForm' ? 'toDo' : (addTaskColumn || 'toDo');
}

/**
 * Initializes the tasks node in the Firebase database if it does not exist.
 * 
 * This function checks if the tasks node exists and creates it if necessary.
 */
async function initializeTasksNode() {
  try {
    const existingTasks = await fetchTasks();
    if (existingTasks === null) {
      await initializeTasks();
    }
  } catch (error) {
    console.info('Error initializing tasks node:', error);
  }
}

/**
 * Fetches the existing tasks from the Firebase database.
 * 
 * @returns {Object|null} The tasks data, or `null` if not found.
 * @throws {Error} If the network request fails.
 */
async function fetchTasks() {
  const response = await fetch( BASE_TASKS_URL + `.json`);
  if (!response.ok) {
    throw new Error(`HTTP error during initialize tasks node! Status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Initializes the tasks node in the Firebase database by creating an empty object.
 * 
 * @throws {Error} If the network request fails.
 */
async function initializeTasks() {
  const initResponse = await fetch(BASE_TASKS_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!initResponse.ok) {
    throw new Error(`HTTP error during initialize tasks node PUT! Status: ${initResponse.status}`);
  }
}