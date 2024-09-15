/**
 * Initializes the input field for adding a new subtask in the task creation form.
 * 
 * This function renders the input field for subtasks, sets up event listeners for focus out and keydown events,
 * and focuses the input field.
 */
function writeSubtaskAddTask() {
  let subtaskArea = document.getElementById('subtaskContainerAddTask');
  subtaskArea.innerHTML = returnWriteSubtaskAddTaskBoardHTML();
  let inputField = document.getElementById('subtaskInput');
  inputField.addEventListener('focusout', function() {
      if (!this.value.trim()) {
          resetSubtask();
      }
  });
  inputField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          addSubtaaskBoard(); 
      }
  });
  inputField.focus();
}

/**
 * Adds a new subtask to the task creation form.
 * 
 * This function validates the subtask input, adds it to the list of subtasks, displays the subtasks,
 * and resets the subtask input field.
 */
function addSubtaaskBoard() {
  let subtaskInput = document.getElementById('subtaskInput');
  let subtaskInfo = subtaskInput.value;
  if (subtaskInfo.length < 3) {
    subtaskInput.value = ''; 
    subtaskInput.placeholder = 'Min 3 characters needed'; 
    subtaskInput.style.borderColor = 'red'; 
    return; 
  }
  addTaskBoardInfos.push(subtaskInfo);
  showSubtasksAddTask();
  resetSubtask();
}

/**
 * Resets the subtask input field in the task creation form.
 * 
 * This function clears the input field and prepares it for the next subtask entry.
 */
function resetSubtask() {
  document.getElementById('subtaskContainerAddTask').innerHTML = returnResetBoardSubtaskHtml();
}

/**
 * Displays the list of subtasks in the task creation form.
 * 
 * This function renders each subtask in the list, allowing the user to view and manage them.
 */
function showSubtasksAddTask() {
  let newSubtask = document.getElementById('newSubtasksAddTask');
  newSubtask.innerHTML = '';
  for (let s = 0; s < addTaskBoardInfos.length; s++) {
    newSubtask.innerHTML += returnShowSubtasksAddTaskHtml(s, addTaskBoardInfos);
  }
}

/**
 * Edits an existing subtask in the task creation form.
 * 
 * This function replaces the subtask text with an input field for editing, and sets up the event listener
 * to save the subtask when the user presses Enter.
 * 
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtaskAddTask(index) {
  let newSubtask = document.getElementById('newSubtasksAddTask');
  if (index >= 0) {
    newSubtask.innerHTML = returnIfEditSubtaskAddTaskHTML(index, addTaskBoardInfos);
  } else {
    newSubtask.innerHTML = returnElseEditSubtaskAddTaskHtml(index, addTaskBoardInfos);
  }
  let inputField = document.getElementById('editSubtaskInputAddTask');
  if (inputField) {
    inputField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        saveSubtaskAddTask(index);
      }
    });
    inputField.focus();
  }
}

/**
 * Saves the edited subtask in the task creation form.
 * 
 * This function validates the input, updates the subtask in the list, and redisplays the updated subtasks.
 * 
 * @param {number} index - The index of the subtask being edited.
 */
function saveSubtaskAddTask(index) {
  let editInput = document.getElementById('editSubtaskInputAddTask');
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
  addTaskBoardInfos[index] = editedSubtask;
  showSubtasksAddTask();
}

/**
 * Deletes a subtask from the task creation form.
 * 
 * This function removes the subtask from the list and updates the displayed subtasks.
 * 
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtaskAddTask(index) {
  addTaskBoardInfos.splice(index, 1);
  showSubtasksAddTask();
}

/**
 * Displays the action icons (edit/delete) for a subtask when it is hovered over.
 * 
 * @param {HTMLElement} element - The subtask element that was hovered over.
 */
function showActions(element) {
  let actions = element.querySelector('.subtaskIconsAddTask');
  if (actions) {
    actions.classList.remove('d-none');
  }
}

/**
 * Hides the action icons (edit/delete) for a subtask when it is no longer hovered over.
 * 
 * @param {HTMLElement} element - The subtask element that was hovered away from.
 */
function hideActionsAddTask(element) {
  let actions = element.querySelector('.subtaskIconsAddTask');
  if (actions) {
    actions.classList.add('d-none');
  }
}
