/**
 * Renders the HTML structure for the "Add Task" board.
 * 
 * This function creates the entire HTML content for the task creation interface, including
 * form fields for title, description, assigned contacts, due date, priority, category, and subtasks.
 * It also includes buttons for clearing the form and creating the task.
 * 
 * @param {HTMLElement} addTaskContainer - The container element where the "Add Task" board HTML will be rendered.
 */
function renderAddTaskBoardHtml(addTaskContainer) {
  addTaskContainer.innerHTML = `
      <section class="addTask" id="boardAddTask">
          <div class="boardAddTaskTitle">
              <h1>Add Task</h1>
              <img src="./assets/img/png/close.png" onclick="closeAddTaskBoardOnX()">
          </div>
          <form id="taskFormAddTask">
            <div class="formLeft">
              <div class="eachInput">
                <span>Title<b style="color: red">*</b></span>
                <p class="inputContainerAddTask"><input id="titleInputAddTask" required type="text" /></p>
              </div>
              <div class="eachInput">
                <span>Description</span>
                <p><textarea name="" id=""></textarea></p>
              </div>
              <div class="eachInput">
                <span>Assigned to</span>
                <div class="categoryDropDown" id="dropdownContacts" onclick="toggleContacts()">
                  <span class="spanCategory">Select Contacts to assign</span>
                  <img class="dropDownImg" id="dropDownContactsImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
                </div>
                <div id="contacts" class="contacts d-none"></div>
                <div id="assignedContacts" class="assignedContacts"></div>
              </div>
            </div>
            <div class="separator"></div>
            <div class="formLeft">
              <div class="eachInput">
                <span>Due date <b style="color: red">*</b></span>
                <p class="inputContainerAddTask"><input required type="date" id="dateInputAddTask"/></p>
              </div>
              <div class="eachInput">
                <span>Prio</span>
                <div class="d-flex prioArea">
                  <button type="button" id="button4" onclick="handleClick(4)" class="buttonCenter prioButton">
                    Urgent <img id="prioImg4" src="assets/img/svg/urgent.svg" alt="" />
                  </button>
                  <button type="button" id="button5" onclick="handleClick(5)" class="buttonCenter prioButton">
                    Medium <img id="prioImg5" src="assets/img/png/mediumColor.png" alt="" />
                  </button>
                  <button type="button" id="button6" onclick="handleClick(6)" class="buttonCenter prioButton">
                    Low <img id="prioImg6" src="assets/img/svg/low.svg" alt="" />
                  </button>
                </div>
              </div>
              <span style="margin-bottom: -6px; margin-top: -8px;">Category <b style="color: red">*</b></span>
              <div class="categoryDropDown" id="dropdownCategory" onclick="showCategory()">
                <span class="spanCategory">Select task category</span>
                <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
              </div>
              <div id="categories"></div>
              <div class="eachInput">
                <span>Subtasks</span>
                <div id="subtaskContainerAddTask">
                  <p>
                    <input type="text" name="" placeholder="Add new subtask" readonly onclick="writeSubtaskAddTask()" />
                    <img onclick="writeSubtaskAddTask()" src="assets/img/png/Subtasks icons11.png" alt="" />
                  </p>
                </div>
                <ul id="newSubtasksAddTask" style="display: flex;"></ul>
              </div>
            </div>
          </form>
          <section class="buttonsSection d-flex" style="margin-top: 150px">
            <span><b style="color: red">*</b> This field is Required</span>
            <div class="buttonArea">
              <button id="clearButton" onclick="clearForm()" class="buttonCenter clear">
                Clear
                <img src="assets/img/png/iconoir_cancel.png" alt="" />
              </button>
              <button type="submit" onclick="handleCreateButtonClick()" id="createButton" class="buttonCenter createButton">
                Create Task <img src="assets/img/png/check.png" alt="" />
              </button>
            </div>
          </section>
        </section>
  `;
}

/**
* Returns the HTML string for the subtask input field in the task creation form.
* 
* This function provides the HTML for the subtask input field and the associated action buttons (save, cancel).
* 
* @returns {string} The HTML string for the subtask input field and actions.
*/
function returnWriteSubtaskAddTaskBoardHTML() {
return `
    <div class="addSubtaskAddBoard">
        <input type="text" name="" autofocus id="subtaskInput" minlength="3" required placeholder="Enter subtask"/>
        <div class="d-flex">
            <img src="assets/img/png/subtaskX.png" onclick="resetSubtask()" alt="" />
            <img src="assets/img/png/subtaskDone.png" onclick="addSubtaaskBoard();" alt="" />
        </div>
    </div>
`;
}

/**
* Returns the HTML string for displaying a subtask in the task creation form.
* 
* This function generates the HTML to display each subtask in the list, with options to edit or delete the subtask.
* 
* @param {number} s - The index of the subtask in the list.
* @param {Array<string>} addTaskBoardInfos - The array containing the list of subtasks.
* @returns {string} The HTML string for displaying the subtask.
*/
function returnShowSubtasksAddTaskHtml(s, addTaskBoardInfos) {
return `
  <li onmouseenter="showActions(this)" onmouseleave="hideActionsAddTask(this)">
    <div class="subtask-item">
      <div class="subtask-content">
        <span class="custom-bullet">•</span>
        <div style="width:100%" onclick="editSubtaskAddTask(${s})">${addTaskBoardInfos[s]}</div>
      </div>
      <div class="subtaskIconsAddTask d-none">
        <img src="assets/img/png/editSubtask.png" onclick="editSubtaskAddTask(${s})" alt="" />
        <div class="vertical-line"></div>
        <img src="assets/img/png/delete.png" onclick="deleteSubtaskAddTask(${s})" alt="" />
      </div>
    </div>
  </li>
`;
}

/**
* Returns the HTML string for editing a subtask in the task creation form (if the subtask index is valid).
* 
* This function provides the HTML for editing an existing subtask, allowing the user to modify or delete it.
* 
* @param {number} index - The index of the subtask to edit.
* @param {Array<string>} addTaskBoardInfos - The array containing the list of subtasks.
* @returns {string} The HTML string for editing the subtask.
*/
function returnIfEditSubtaskAddTaskHTML(index, addTaskBoardInfos) {
return `
    <div class="addSubtask">
      <input type="text" id="editSubtaskInputAddTask" value="${addTaskBoardInfos[index]}" minlength="3" required />
      <div class="d-flex">
        <img src="assets/img/png/subtaskDone.png" onclick="saveSubtaskAddTask(${index})" alt="" />
        <img src="assets/img/png/delete.png" onclick="deleteSubtaskAddTask(${index})" alt="" />
      </div>
    </div>
  `;
}

/**
* Returns the HTML string for displaying a subtask in edit mode in the task creation form.
* 
* This function provides the HTML for showing the subtask text with options to edit or delete it.
* 
* @param {number} index - The index of the subtask to edit.
* @param {Array<string>} addTaskBoardInfos - The array containing the list of subtasks.
* @returns {string} The HTML string for displaying the subtask in edit mode.
*/
function returnElseEditSubtaskAddTaskHtml(index, addTaskBoardInfos) {
return `
    <div class="addSubtask">
      <div style="width:100%" onclick="editSubtaskAddTask(${index})">
        ${addTaskBoardInfos[index]}
      </div>
      <div class="d-flex">
        <img src="assets/img/png/subtaskDone.png" onclick="showSubtasksAddTask()" alt="" />
        <img src="assets/img/png/delete.png" onclick="deleteSubtaskAddTask(${index})" alt="" />
      </div>
    </div>
  `;
}
