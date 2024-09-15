let currentTaskId = null;

/**
 * Opens a task and displays its details in the task container.
 * 
 * This function sets the current task ID, displays the task container, and populates it with the task's details.
 * 
 * @param {Object} task - The task object containing details to be displayed.
 */
function openTask(task) {
  currentTaskId = task.id;
  let openedTaskContainer = document.getElementById('openedTaskContainer');
  openedTaskContainer.classList.add('openedTaskContainer');
  openedTaskContainer.classList.remove('d-none');
  openedTaskContainer.innerHTML = returnOpenedTaskHtml(task);
  checkforOpenedDecsripiton(task);
  renderOpenTaskAssignedContacts(task);
  renderOpenTaskSubtasks(task);
  checkforOpenedTitle(task);
  openedCategoryColor(task);
}

/**
 * Applies the appropriate category color to the opened task.
 * 
 * This function adds a CSS class to the task category element based on the task's category.
 * 
 * @param {Object} task - The task object containing category information.
 */
function openedCategoryColor(task) {
  const categoryElement = document.getElementById(`openedTaskCategory`);
  if (categoryElement) {
    if (task.category === 'User Story') {
      categoryElement.classList.add('userTask');
    } else if (task.category === 'Technical task') {
      categoryElement.classList.add('technicalTask');
    }
  }
}

/**
 * Checks and displays the task's description.
 * 
 * If the task has no description, a default message "No Description" is displayed.
 * 
 * @param {Object} task - The task object containing the description.
 */
function checkforOpenedDecsripiton(task) {
  let openedTaskDescription = document.getElementById('openedTaskDescription');
  if (task.description === "") {
    openedTaskDescription.innerHTML = `No Description`;
  } else {
    openedTaskDescription.innerHTML = `${task.description}`;
  }
}

/**
 * Checks and displays the task's title.
 * 
 * If the task has no title, a default message "No Title" is displayed.
 * 
 * @param {Object} task - The task object containing the title.
 */
function checkforOpenedTitle(task) {
  let openedTaskTitle = document.getElementById('openedTaskTitle');
  if (task.title === "") {
    openedTaskTitle.innerHTML = `No Title`;
  } else {
    openedTaskTitle.innerHTML = `${task.title}`;
  }
}

/**
 * Renders the contacts assigned to the opened task.
 * 
 * This function populates the task's contact section with assigned contacts or displays 
 * a message if no contacts are assigned.
 * 
 * @param {Object} task - The task object containing assigned contacts.
 */
function renderOpenTaskAssignedContacts(task) {
  let openedAssignedContacts = document.getElementById('openedAssignedContacts');
  openedAssignedContacts.innerHTML = '';
  const validContacts = getValidContactsAssignedContacts(task.assignedContacts);
  if (validContacts.length === 0) {
    openedAssignedContacts.innerHTML = 'No contacts assigned';
    return;
  }
  const contactsHTML = renderContactsHTML(validContacts);
  openedAssignedContacts.innerHTML = contactsHTML;
}

/**
 * Filters and returns valid contacts assigned to the task.
 * 
 * This function checks if the assigned contacts exist in the global `contacts` list.
 * 
 * @param {Array<Object>} assignedContacts - The list of assigned contacts.
 * @returns {Array<Object>} An array of valid contacts.
 */
function getValidContactsAssignedContacts(assignedContacts) {
  if (!assignedContacts || assignedContacts.length === 0) {
    return [];
  }
  return assignedContacts.filter(assignedContact => 
    contacts.some(contact => contact.name === assignedContact.name)
  );
}

/**
 * Generates HTML for the valid assigned contacts.
 * 
 * This function creates the HTML structure to display the assigned contacts in the task view.
 * 
 * @param {Array<Object>} validContacts - The list of valid contacts.
 * @returns {string} The HTML string representing the contacts.
 */
function renderContactsHTML(validContacts) {
  let contactsHTML = '';
  validContacts.forEach(contact => {
    const { name, initials, color } = contact;
    contactsHTML += returnOpenTaskAssignedContactsHTML(name, color, initials);
  });
  return contactsHTML;
}

/**
 * Renders the subtasks of the opened task.
 * 
 * This function displays the subtasks in the task view or shows a message if there are no subtasks.
 * 
 * @param {Object} task - The task object containing subtasks.
 */
function renderOpenTaskSubtasks(task) {
  let openedSubtasksArea = document.getElementById('openedSubtasks');
  openedSubtasksArea.innerHTML = '';
  if (!task.subtasks || task.subtasks.length === 0) {
    openedSubtasksArea.innerHTML = 'No Subtasks';
  } else {
    let subtasksHTML = '';
    task.subtasks.forEach((subtask, subtaskIndex) => {
      subtasksHTML += returnOpenTaskSubtaskHTML(task.id, subtaskIndex, subtask);
    });
    openedSubtasksArea.innerHTML = subtasksHTML;
  }
}

/**
 * Marks a subtask as completed or not completed.
 * 
 * This function updates the completion status of a subtask, saves the changes to Firebase,
 * and re-renders the tasks on the board.
 * 
 * @param {number} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask within the task.
 * @param {boolean} completed - The completion status of the subtask.
 */
async function setSubtaskCompleted(taskId, subtaskIndex, completed) {
  let task = tasks.find(t => t.id === taskId);
  if (task) {
    task.subtasks[subtaskIndex].completed = completed;
    await updateTaskInFirebase(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  } else {
    console.error(`Task with id ${taskId} not found`);
  }
}

/**
 * Deletes a task by its ID.
 * 
 * This function removes the task from Firebase and the local task list, then re-renders the task board.
 * 
 * @param {number} taskId - The ID of the task to be deleted.
 */
async function deleteTask(taskId) {
  try {
    const response = await fetch(`${BASE_URL}${taskId}.json`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    closeOpenedTask();
  } catch (error) {
    console.error('There was a problem with the delete operation:', error);
  }
}
