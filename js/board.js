const tasks = [];
const contacts = [];
let selectedContacts = [];
let addTaskBoardInfos = [];
let activeButton = null;
let clickCount = 0;
let choosenCategory = false;
let category = ["User Story", "Technical task"];
let addTaskColumn = null;

/**
 * Loads tasks and contacts from local storage.
 * Clears the current arrays and populates them with the saved data.
 */
function loadTasksFromLocalStorage() {
  const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.length = 0;
  tasks.push(...savedTasks);
  contacts.length = 0;
  contacts.push(...savedContacts);
}

/**
 * Filters tasks based on the input provided in the search fields.
 * Uses the input from either desktop or mobile search fields.
 */
function filterTasks() {
  const searchInput = document.getElementById('search').value.toLowerCase();
  const searchMobileInput = document.getElementById('searchMobile').value.toLowerCase();
  const searchTerm = searchInput || searchMobileInput;
  
  const filteredTasks = tasks.filter(task => {
      return task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm);
  });
  
  renderFilteredTasks(filteredTasks);
}

/**
 * Renders the filtered tasks.
 * @param {Array} filteredTasks - The filtered tasks to render.
 */
function renderFilteredTasks(filteredTasks) {
  renderTasks(filteredTasks);
}

/**
 * Closes the opened task details or edit task view.
 * Hides the container displaying the opened or edit task.
 */
function closeOpenedTask() {
  document.getElementById(`openedTaskContainer`).classList.add(`d-none`);
  document.getElementById('openedTaskContainer').classList.remove('openedTaskContainer');
  document.getElementById(`editTaskContainer`).classList.add(`d-none`);
  document.getElementById('editTaskContainer').classList.remove('openedTaskContainer');
}

/**
 * Handles clicks outside the edit or opened task containers.
 * Closes the container if a click is detected outside of it.
 * @param {Event} event - The click event.
 */
function handleClickOutsideEdit(event) {
  const container = document.getElementById('openedTaskContainer');
  if (container.contains(event.target)) {
    document.getElementById('openedTaskContainer').classList.add('d-none');
    container.classList.remove('openedTaskContainer');
  }
  const containerEdit = document.getElementById('editTaskContainer');
  if (containerEdit.contains(event.target)) {
    document.getElementById('editTaskContainer').classList.add('d-none');
    containerEdit.classList.remove('openedTaskContainer');
  }
}

/**
 * Opens the add task board with the specified column type.
 * @param {string} columnType - The type of the column to add the task to.
 */
function openBoardAddTask(columnType) {
  let addTaskContainer = document.getElementById('addTaskContainer');
  addTaskContainer.classList.remove('d-none');
  renderAddTaskBoardHtml(addTaskContainer);
  document.getElementById('boardAddTask').classList.add('slide-in');
  handleClick(5);
  addTaskColumn = columnType;
  setMinDate();
}

/**
 * Closes the add task board and shows a success message.
 * Slides out the container and hides it after a delay.
 */
function closeAddTaskBoard() {
  const taskContainer = document.getElementById('addTaskContainer');
  if (!taskContainer) {
    return;
  }
  showSuccessMessageAddTask();
  taskContainer.classList.add('slideOut');
  setTimeout(() => {
    taskContainer.classList.add('d-none');
    taskContainer.classList.remove('slideOut');
  }, 1000);
}

/**
 * Closes the add task board when the close button (X) is clicked.
 * Hides the task container and clears the form.
 */
function closeAddTaskBoardOnX() {
  const taskContainer = document.getElementById('addTaskContainer');
  taskContainer.classList.add('d-none');
  clearForm();
}

/**
 * Adds an event listener to handle clicks outside the dropdowns.
 * Toggles the visibility of the category dropdown based on clicks.
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function (event) {
  let addBoardTask = document.getElementById('boardAddTask');
  if (!addBoardTask) {
    return;
  }
  let categoryContainer = document.getElementById('categories');
  let dropdownCategory = document.getElementById('dropdownCategory');
  if (dropdownCategory.contains(event.target)) {
    clickCount = clickCount === 0 ? 1 : 0;
    if (clickCount === 1) {
      categoryContainer.classList.remove('d-none');
    } else {
      resetDropDownIconsCategory();
      categoryContainer.classList.add('d-none');
    }
  } else if (!categoryContainer.classList.contains('d-none') && !categoryContainer.contains(event.target)) {
    categoryContainer.classList.add('d-none');
    clickCount = 0;
    resetDropDownIconsCategory();
  }
});

/**
 * Resets the icons of the category dropdown to the default state.
 */
function resetDropDownIconsCategory() {
  document.getElementById('dropDownImg').classList.add('dropDownImg');
  document.getElementById('dropDownImg').classList.remove('dropUpImg');
}

/**
 * Adds an event listener to handle clicks outside the contacts dropdown.
 * Closes the contacts dropdown if a click is detected outside of it.
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function (event) {
  let addBoardTask = document.getElementById('boardAddTask');
  if (!addBoardTask) {
    return;
  }
  let contactsContainer = document.getElementById('contacts');
  let dropdownContacts = document.getElementById('dropdownContacts');
  if (!contactsContainer.classList.contains('d-none') && !dropdownContacts.contains(event.target) && !contactsContainer.contains(event.target)) {
    contactsContainer.classList.add('d-none');
    document.getElementById('dropDownContactsImg').classList.add('dropDownImg');
    document.getElementById('dropDownContactsImg').classList.remove('dropUpImg');
  }
});

/**
 * Adds an event listener to validate the category dropdown on load.
 * Removes the 'invalid' class if a category has been chosen.
 */
document.addEventListener('DOMContentLoaded', function () {
  const dropdownCategory = document.getElementById('dropdownCategory');
  if (dropdownCategory) {
    dropdownCategory.addEventListener('click', function () {
      if (choosenCategory) {
        dropdownCategory.classList.remove('invalid');
      }
    });
  }
});

/**
 * Periodically fetches tasks from the database every 1500000ms (25 minutes).
 */
setInterval(() => {
  getTasksFromDataBase();
}, 1500000);

/**
 * Opens the drag mobile container for the specified task index.
 * Adds an event listener to close the container if a click is detected outside of it.
 * @param {number} i - The index of the task to open the drag container for.
 */
function openDragMobile(i) {
  let dragMobileContainer = document.getElementById(`dragMobileContainer${i}`);
  dragMobileContainer.classList.remove('d-none');
  function handleClickOutsideOpenDragMobile(event) {
    if (!dragMobileContainer.contains(event.target)) {
      dragMobileContainer.classList.add('d-none');
      document.removeEventListener('click', handleClickOutsideOpenDragMobile);
    }
  }
  document.addEventListener('click', handleClickOutsideOpenDragMobile);
}

/**
 * Changes the column of the specified task to "toDo".
 * Updates the task in Firebase and local storage, then re-renders the tasks.
 * @param {number} i - The index of the task to update.
 */
async function changeColumnToDo(i) {
  let taskcard = tasks[i];
  taskcard.column = "toDo";
  updateTaskInFirebase(taskcard);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

/**
 * Changes the column of the specified task to "inProgress".
 * Updates the task in Firebase and local storage, then re-renders the tasks.
 * @param {number} i - The index of the task to update.
 */
async function changeColumnInProgress(i) {
  let taskcard = tasks[i];
  taskcard.column = "inProgress";
  updateTaskInFirebase(taskcard);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

/**
 * Changes the column of the specified task to "awaitFeedback".
 * Updates the task in Firebase and local storage, then re-renders the tasks.
 * @param {number} i - The index of the task to update.
 */
async function changeColumnFeedback(i) {
  let taskcard = tasks[i];
  taskcard.column = "awaitFeedback";
  updateTaskInFirebase(taskcard);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

/**
 * Changes the column of the specified task to "done".
 * Updates the task in Firebase and local storage, then re-renders the tasks.
 * @param {number} i - The index of the task to update.
 */
async function changeColumnDone(i) {
  let taskcard = tasks[i];
  taskcard.column = "done";
  updateTaskInFirebase(taskcard);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}