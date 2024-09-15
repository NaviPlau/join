/**
 * Collects and updates the data for a task being edited.
 * 
 * This function gathers data from the edit form, updates the task with the new information,
 * saves it locally, and updates it in Firebase.
 * 
 * @param {number} taskId - The ID of the task being edited.
 * @returns {Object|null} The updated task object, or `null` if the task was not found.
 */
function collectDataEdit(taskId) {
  const task = getTaskById(taskId);
  if (!task) {
      console.error('Task not found.');
      return null;
  }
  const formData = collectFormData();
  const priority = determinePriority();
  const assignedContacts = getAssignedContacts();
  const subtasks = collectSubtasks();
  const updatedTask = createUpdatedTask(task, formData, priority, assignedContacts, subtasks);
  saveTask(updatedTask, taskId);
  updateTaskInFirebaseAndUI(updatedTask);
  return updatedTask;
}

/**
 * Collects the form data from the task edit form.
 * 
 * This function retrieves the title, description, and due date from the edit form.
 * 
 * @returns {Object} An object containing the title, description, and due date of the task.
 */
function collectFormData() {
  const title = document.getElementById('editTitle').querySelector('input').value;
  const description = document.getElementById('taskDescriptionTextarea').value;
  const dueDate = document.getElementById('dateValue').value;
  return { title, description, dueDate };
}

/**
 * Determines the priority level of the task from the edit form.
 * 
 * This function checks which priority button is selected and returns the corresponding priority level.
 * 
 * @returns {string} The priority level ('Urgent', 'Medium', 'Low').
 */
function determinePriority() {
  const priorityButtons = document.querySelectorAll('#editPriorityButtons .prioButton');
  let priority = '';
  priorityButtons.forEach(button => {
      if (button.classList.contains('urgent')) {
          priority = 'Urgent';
      } else if (button.classList.contains('medium')) {
          priority = 'Medium';
      } else if (button.classList.contains('low')) {
          priority = 'Low';
      }
  });
  return priority;
}

/**
 * Retrieves the contacts assigned to the task being edited.
 * 
 * This function returns the list of contacts currently assigned to the task.
 * 
 * @returns {Array<Object>} An array of contact objects assigned to the task.
 */
function getAssignedContacts() {
  return currentTaskBeingEdited.assignedContacts || [];
}

/**
 * Collects the subtasks from the subtask input fields.
 * 
 * This function gathers the subtasks, including their title and completion status.
 * 
 * @returns {Array<Object>} An array of subtask objects, each containing a title and completion status.
 */
function collectSubtasks() {
  const subtasks = subtaskInfos.map(subtask => ({
      title: subtask.title,
      completed: subtask.completed
  }));
  return subtasks;
}

/**
 * Creates an updated task object with the new data from the edit form.
 * 
 * This function merges the original task data with the updated data from the form.
 * 
 * @param {Object} task - The original task object.
 * @param {Object} formData - The updated form data containing title, description, and due date.
 * @param {string} priority - The updated priority level.
 * @param {Array<Object>} assignedContacts - The updated list of assigned contacts.
 * @param {Array<Object>} subtasks - The updated list of subtasks.
 * @returns {Object} The updated task object.
 */
function createUpdatedTask(task, formData, priority, assignedContacts, subtasks) {
  return {
      ...task,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority,
      assignedContacts,
      subtasks
  };
}

/**
 * Saves the updated task to localStorage.
 * 
 * This function updates the task in localStorage with the new data from the edit form.
 * 
 * @param {Object} updatedTask - The updated task object to save.
 * @param {number} taskId - The ID of the task being updated.
 */
function saveTask(updatedTask, taskId) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      localStorage.setItem('tasks', JSON.stringify(tasks));
  } else {
      console.warn('Task not found in localStorage.');
  }
}

/**
 * Closes the task edit interface and resets the priority button to its default state.
 * 
 * This function hides the task edit UI and resets the priority button selection.
 */
function closeEdit() {
  document.getElementById('editTaskContainer').classList.add('d-none');
  switchButton('Medium');
}

/**
 * Retrieves a task by its ID from localStorage.
 * 
 * This function searches for a task in localStorage by its ID and returns it.
 * 
 * @param {number} taskId - The ID of the task to retrieve.
 * @returns {Object|undefined} The task object if found, or `undefined` if not.
 */
function getTaskById(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks.find(task => task.id === taskId);
}

/**
 * Toggles the visibility of the contacts dropdown list.
 * 
 * This function shows or hides the dropdown list of contacts available for assignment to the task.
 */
function closeContactsDropdown() {
  let contactsToChoose = document.getElementById('contactsToChoose');
  if (contactsToChoose.classList.contains('d-none')) {
    showContactsToChoose();
    document.getElementById('dropDownImg').classList.add('dropUpImg');
  } else {
    contactsToChoose.classList.add('d-none');
    document.getElementById('dropDownImg').classList.remove('dropUpImg');
  }
}

/**
 * Highlights the button corresponding to the task's priority and deactivates the others.
 * 
 * @param {string} priority - The priority level of the task ('Urgent', 'Medium', 'Low').
 */
function switchButton(priority) {
  const buttons = [
      { id: 'button1', priority: 'Urgent', class: 'urgent' },
      { id: 'button2', priority: 'Medium', class: 'medium' },
      { id: 'button3', priority: 'Low', class: 'low' },
  ];
  buttons.forEach(button => {
      const element = document.getElementById(button.id);
      if (button.priority === priority) {
          element.classList.add(button.class);
          element.classList.remove('hover-shadow');
      } else {
          element.classList.remove(button.class);
          element.classList.add('hover-shadow');
      }
  });
}