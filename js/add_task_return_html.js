/**
 * Returns the HTML string to reset the subtask input area.
 * 
 * This function generates the HTML for displaying the default subtask input field 
 * where users can click to add a new subtask.
 * 
 * @returns {string} The HTML string to reset the subtask input area.
 */
function returnResetSubtaskHtml() {
  return `
    <p>
      <input type="text" autofocus name="" placeholder="Add new subtask" id="subtaskInput" readonly onclick="writeSubtask()" />
      <img src="assets/img/png/Subtasks icons11.png" alt="" />
    </p>
  `;
}

/**
 * Returns the HTML string to display the subtask input field for adding a new subtask.
 * 
 * This function generates the HTML for the input field and buttons to add a subtask 
 * when a user starts the process of writing a subtask.
 * 
 * @returns {string} The HTML string for the subtask input field.
 */
function returnWriteSubtaskHtmlAddTask() {
  return `
      <div class="addSubtask">
          <input type="text" name="" autofocus id="subtaskInput" minlength="3" required placeholder="Enter subtask"/>
          <div class="d-flex">
              <img src="assets/img/png/subtaskX.png" onclick="resetSubtask()" alt="" />
              <img src="assets/img/png/subtaskDone.png" onclick="addSubtask();" alt="" />
          </div>
      </div>
  `;
}

/**
 * Returns the HTML string to display a subtask in the task form.
 * 
 * This function generates the HTML for displaying each subtask, 
 * including the options to edit or delete the subtask.
 * 
 * @param {string} subtaskText - The text of the subtask to display.
 * @param {number} s - The index of the subtask in the list.
 * @returns {string} The HTML string for displaying the subtask.
 */
function returnShowAddTaskSubtaskHTML(subtaskText, s) {
  return `
    <li onmouseenter="showActions(this)" onmouseleave="hideActions(this)">
      <div class="subtask-item" >
        <div class="subtask-content" onclick="editSubtask(${s})">
          <span class="custom-bullet" >•</span>
          ${subtaskText}
        </div>
        <div class="subtask-icons d-none">
          <img src="assets/img/png/editSubtask.png" onclick="editSubtask(${s})" alt="" />
          <div class="vertical-line"></div>
          <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
        </div>
      </div>
    </li>
  `;
}

/**
 * Returns the HTML string for editing a specific subtask.
 * 
 * This function generates the HTML for the input field and buttons to edit a subtask
 * when a user chooses to modify an existing subtask.
 * 
 * @param {number} index - The index of the subtask being edited.
 * @returns {string} The HTML string for editing the subtask.
 */
function returnEditSubtaskAddtaskIfHtml(index) {
  return `
    <div class="addSubtask">
      <input type="text" id="editSubtaskInput" value="${subtaskInfos[index]}" minlength="3" required />
      <div class="d-flex">
        <img src="assets/img/png/subtaskDone.png" onclick="saveSubtask(${index})" alt="" />
        <img src="assets/img/png/delete.png" onclick="deleteSubtask(${index})" alt="" />
      </div>
    </div>
  `;
}

/**
 * Returns the HTML string to display a subtask in its non-editable state.
 * 
 * This function generates the HTML for displaying a subtask when it is not being edited,
 * allowing the user to click to edit or delete the subtask.
 * 
 * @param {number} index - The index of the subtask in the list.
 * @returns {string} The HTML string for displaying the subtask in its non-editable state.
 */
function returnEditSubtaskAddTaskElseHtml(index) {
  return `
    <div class="addSubtask">
      <div style="width:100%" onclick="editSubtask(${index})">
        ${subtaskInfos[index]}
      </div>
      <div class="d-flex">
        <img src="assets/img/png/subtaskDone.png" onclick="showSubtasks()" alt="" />
        <img src="assets/img/png/delete.png" onclick="deleteSubtask(${index}) preventDefault()" alt="" />
      </div>
    </div>
  `;
}

/**
 * Returns the HTML string to reset the category dropdown in the task form.
 * 
 * This function generates the HTML for resetting the task category dropdown
 * to its default state with the placeholder text.
 * 
 * @returns {string} The HTML string to reset the category dropdown.
 */
function returnAddTaskDropCategoryHtml() {
  return `
    <span class="spanCategory">Select task category</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
  `;
}
