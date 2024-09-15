let subtaskInfos = [];
let isSubtaskEditMode = false; 

/**
 * Event listener that triggers when the user clicks anywhere on the document.
 * 
 * This listener calls the `handleClickOutsideEdit` function, which is responsible for handling 
 * cases where the user clicks outside of a specific element (typically an edit field or dropdown),
 * and potentially triggers an action such as closing or saving changes.
 */
document.addEventListener('click', handleClickOutsideEdit);


/**
 * Opens the task editing interface for the specified task.
 * 
 * This function retrieves the task by its ID, and if found, renders the task edit UI.
 * 
 * @param {number} taskId - The ID of the task to edit.
 */
function editTask(taskId) {
  let task = getTaskById(taskId); 
  if (!task) {
      console.error('Task not found.');
      return;
  }
  document.getElementById('editTaskContainer').innerHTML = `<div class="openedTask" id="editTask" onclick="event.stopPropagation()"></div>`;
  currentTaskBeingEdited = task;
  renderEditHTML(task);
}

/**
 * Renders the HTML content for editing the specified task.
 * 
 * This function updates the UI with the task's current details, including description, priority, and subtasks.
 * 
 * @param {Object} task - The task object containing the details to render.
 */
function renderEditHTML(task) {
  let openedEdit = document.getElementById('editTask');
  document.getElementById('editTaskContainer').classList.remove('d-none');
  document.getElementById('editTaskContainer').classList.add('openedTaskContainer');
  let today = new Date().toISOString().split('T')[0];
  openedEdit.innerHTML = returnOpenEditHTML(task, today);
  checkForDescription(task);
  renderEditPriorityButtons(task);
  renderEditSubtasks(task);
}

/**
 * Checks if the task has a description and displays it, or shows a placeholder if not.
 * 
 * @param {Object} task - The task object containing the description.
 */
function checkForDescription(task) {
  let textarea = document.getElementById('taskDescriptionTextarea');
  textarea.value = task.description || 'No description';
}

/**
 * Renders the priority buttons for the task edit UI.
 * 
 * This function highlights the current priority of the task and allows the user to change it.
 * 
 * @param {Object} task - The task object containing the current priority.
 */
function renderEditPriorityButtons(task) {
  let buttonsArea = document.getElementById('editPriorityButtons');
  buttonsArea.innerHTML = returnEditPriorityButtonsHTML();
  switchButton(task.priority);
}

/**
 * Displays the list of contacts that can be assigned to the task.
 * 
 * This function shows the dropdown list of contacts and marks those already assigned to the task.
 */
function showContactsToChoose() {
  document.getElementById('dropDownImg').classList.add('dropUpImg');
  if (!currentTaskBeingEdited) {
    console.error('No task is currently being edited.');
    return;
  }
  const contactsToChooseElement = document.getElementById('contactsToChoose');
  contactsToChooseElement.innerHTML = '';
  contactsToChooseElement.classList.remove('d-none');
  const assignedContacts = currentTaskBeingEdited.assignedContacts || [];
  renderContactsList(contacts, assignedContacts, contactsToChooseElement);
}

/**
 * Renders the list of contacts with selection indicators for those assigned to the task.
 * 
 * @param {Array<Object>} contactsList - The list of all contacts.
 * @param {Array<Object>} assignedContacts - The list of contacts assigned to the task.
 * @param {HTMLElement} contactsToChooseElement - The HTML element where the contacts list will be rendered.
 */
function renderContactsList(contactsList, assignedContacts, contactsToChooseElement) {
  contactsList.forEach(contact => {
    const isAssigned = assignedContacts.some(assignedContact => assignedContact.name === contact.name);
    const contactClass = isAssigned ? 'selected' : '';
    const initials = contact.initials;
    const color = contact.color;

    contactsToChooseElement.innerHTML += returnContactsToChooseHTML(contact.name, contactClass, color, initials);
  });
}

/**
 * Toggles the assignment of a contact to the current task.
 * 
 * This function assigns a contact to the task if not already assigned, or unassigns them if they are.
 * 
 * @param {string} contactName - The name of the contact to toggle.
 */
function toggleContactAssignment(contactName) {
  if (!currentTaskBeingEdited) {
      console.warn('No task is currently being edited.');
      return;
  }
  const task = currentTaskBeingEdited;
  const contact = contacts.find(c => c.name === contactName);
  if (!contact) {
      console.warn('Contact not found.');
      return;
  }
  if (isContactAssigned(task, contactName)) {
      unassignContact(task, contactName);
  } else {
      assignContact(task, contact);
  }
  showContactsToChoose(); 
}

/**
 * Checks if a contact is assigned to the task.
 * 
 * @param {Object} task - The task object containing the list of assigned contacts.
 * @param {string} contactName - The name of the contact to check.
 * @returns {boolean} Returns `true` if the contact is assigned, otherwise `false`.
 */
function isContactAssigned(task, contactName) {
  const assignedContacts = task.assignedContacts || [];
  return assignedContacts.some(assignedContact => assignedContact.name === contactName);
}

/**
 * Assigns a contact to the task.
 * 
 * @param {Object} task - The task object to assign the contact to.
 * @param {Object} contact - The contact object to assign.
 */
function assignContact(task, contact) {
  if (!task.assignedContacts) {
    task.assignedContacts = [];
  }
  if (!task.assignedContacts.some(c => c.name === contact.name)) {
    task.assignedContacts.push(contact);
  }
}
/**
 * Shows the action buttons for editing or deleting a subtask.
 * 
 * This function displays the actions when a subtask is hovered over.
 * 
 * @param {HTMLElement} element - The element that was hovered over to show the actions.
 */
function showActions(element) {
  let actions = element.querySelector('.d-none');
  if (actions && editSubtaskBoard(index)) {
    return;
  } else {
    actions.classList.remove('d-none');
  }
}

/**
 * Hides the action buttons for a subtask.
 * 
 * This function hides the actions when the subtask is no longer hovered over.
 * 
 * @param {HTMLElement} element - The element that was hovered away from.
 */
function hideActions(element) {
  let actions = element.querySelector('.d-flex:not(.d-none)');
  if (actions) {
    actions.classList.add('d-none');
  }
}

/**
 * Unassigns a contact from the task.
 * 
 * @param {Object} task - The task object to unassign the contact from.
 * @param {string} contactName - The name of the contact to unassign.
 */
function unassignContact(task, contactName) {
  if (!task.assignedContacts) {
    return;
  }
  const contactIndex = task.assignedContacts.findIndex(c => c.name === contactName);
  if (contactIndex > -1) {
      task.assignedContacts.splice(contactIndex, 1);
  }
}

/**
 * Renders the subtasks for editing in the task edit UI.
 * 
 * This function displays the existing subtasks and provides an interface for adding or editing subtasks.
 * 
 * @param {Object} task - The task object containing the subtasks to render.
 */
function renderEditSubtasks(task) {
  subtaskInfos = task.subtasks || [];
  let editSubtaskArea = document.getElementById('editSubtasks');
  editSubtaskArea.innerHTML = returnEditSubtasksHTML();
  showSubtasks();  
}

/**
 * Initiates the subtask writing process by rendering the input field for a new subtask.
 */
function startWritingSubtask() {
  if (!isSubtaskEditMode) {
    writeSubtask();
    isSubtaskEditMode = true; 
  } else {
    isSubtaskEditMode = false;
  }
}

/**
 * Renders the input field for entering a new subtask.
 * 
 * This function focuses the input field and adds an event listener for the Enter key to save the subtask.
 */
function writeSubtask() {
  let subtaskArea = document.getElementById('editAreaSubtask');
  subtaskArea.innerHTML = returnWriteSubtaskHTML();
  let subtaskInput = document.getElementById('subtaskInput2');
  subtaskInput.focus();
  subtaskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      addSubtask();  
    }
  });
}

/**
 * Validates the input for a subtask.
 * 
 * This function checks that the subtask input has at least 3 characters and updates the UI accordingly.
 * 
 * @param {HTMLInputElement} subtaskInput - The input element for the subtask.
 * @param {HTMLElement} editSubtask - The container element for the subtask.
 * @returns {boolean} Returns `true` if the input is valid, otherwise `false`.
 */
function validateSubtaskInput(subtaskInput, editSubtask) {
  if (subtaskInput.value.trim().length < 3) {
    subtaskInput.value = '';
    subtaskInput.placeholder = 'Min 3 characters needed';
    editSubtask.classList.add('error-container');
    subtaskInput.classList.add('error-placeholder');
    return false;
  } else {
    subtaskInput.placeholder = 'Enter subtask';
    editSubtask.classList.remove('error-container');
    subtaskInput.classList.remove('error-placeholder');
    return true;
  }
}

/**
 * Adds an event listener to the subtask input to handle changes in its value.
 * 
 * @param {HTMLInputElement} subtaskInput - The input element for the subtask.
 * @param {HTMLElement} editSubtask - The container element for the subtask.
 */
function addInputEventListener(subtaskInput, editSubtask) {
  subtaskInput.addEventListener('input', function() {
    if (subtaskInput.value.trim().length >= 3) {
      subtaskInput.placeholder = 'Enter subtask';
      editSubtask.classList.remove('error-container');
      subtaskInput.classList.remove('error-placeholder');
    }
  });
}

/**
 * Clears the subtask input and adds the subtask to the list of subtasks.
 * 
 * @param {HTMLInputElement} subtaskInput - The input element for the subtask.
 * @param {Array<Object>} subtaskInfos - The array of subtask information.
 */
function clearInputAndAddSubtask(subtaskInput, subtaskInfos) {
  subtaskInfos.push({ completed: false, title: subtaskInput.value.trim() });
  subtaskInput.value = '';
}

/**
 * Adds a new subtask to the task.
 * 
 * This function validates the input, adds the subtask to the list, and updates the UI to display the new subtask.
 */
function addSubtask() {
  let subtaskInput = document.getElementById('subtaskInput2');
  let subtaskInfo = subtaskInput.value.trim();
  let editSubtask = document.getElementById('editSubtasks');
  addInputEventListener(subtaskInput, editSubtask);
  if (!validateSubtaskInput(subtaskInput, editSubtask)) {
    return;
  }
  clearInputAndAddSubtask(subtaskInput, subtaskInfos);
  showSubtasks();
  renderEditSubtasks({ subtasks: subtaskInfos });
}

/**
 * Appends the generated HTML for a subtask to the specified container.
 * 
 * @param {HTMLElement} container - The container element where the subtask HTML will be appended.
 * @param {string} html - The HTML string representing the subtask.
 */
function appendSubtaskHTML(container, html) {
  container.innerHTML += html;
}

/**
 * Displays the list of subtasks in the task edit UI.
 * 
 * This function renders the current subtasks in the edit UI, allowing for viewing and editing.
 */
function showSubtasks() {
  let newSubtask = document.getElementById('newSubtasks');
  newSubtask.innerHTML = ''; 
  subtaskInfos.forEach((subtask, index) => {
    const subtaskHTML = returnSubtaskHTML(index, subtask.title);
    appendSubtaskHTML(newSubtask, subtaskHTML);
  });
}

/**
 * Edits a subtask by enabling the input field for editing.
 * 
 * This function replaces the subtask text with an input field for editing.
 * 
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtaskBoard(index) {
  let subtaskContainers = document.querySelectorAll('#newSubtasks .subtask-content');
  let subtaskContainer = subtaskContainers[index];
  let subtaskTitle = subtaskInfos[index].title;
  subtaskContainer.innerHTML = returnEditSubtaskHTML(index, subtaskTitle);
  let editInput = document.getElementById('editSubtaskInput');
  editInput.focus(); 
  editInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();  
      saveSubtask(index); 
    }
  });
}

/**
 * Handles errors in the subtask input field.
 * 
 * This function updates the UI to indicate an error when the subtask input is invalid.
 * 
 * @param {HTMLInputElement} editInput - The input element for the subtask.
 */
function handleEditInputError(editInput) {
  editInput.value = '';
  editInput.placeholder = 'Min 3 characters needed';
  editInput.style.borderColor = 'red';
  editInput.classList.add('error-placeholder');
  editInput.addEventListener('focus', function() {
    editInput.placeholder = 'Enter subtask';
    editInput.style.borderColor = '';
    editInput.classList.remove('error-placeholder');
  }, { once: true });
}

/**
 * Saves the edited subtask.
 * 
 * This function validates the edited subtask and updates it in the list of subtasks.
 * 
 * @param {number} index - The index of the subtask being edited.
 */
function saveSubtask(index) {
  let editInput = document.getElementById('editSubtaskInput');
  let editedSubtask = editInput.value.trim();
  if (editedSubtask.length < 3) {
    handleEditInputError(editInput);
    return;
  }
  subtaskInfos[index].title = editedSubtask;
  showSubtasks();
}

/**
 * Deletes a subtask from the list.
 * 
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
  subtaskInfos.splice(index, 1);
  showSubtasks();
}
