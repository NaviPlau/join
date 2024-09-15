/**
 * Renders tasks on the board by loading tasks from local storage, clearing existing columns, 
 * and rendering tasks to the appropriate columns.
 * 
 * @param {Array<Object>} [tasksToRender=tasks] - The array of tasks to render. Defaults to the global `tasks` array.
 */
function renderTasks(tasksToRender = tasks) {
    loadTasksFromLocalStorage();
    clearColumnsBoard();
    renderTasksToColumnsBoard(tasksToRender);
    updateNoTaskMessagesBoard();
}

/**
 * Clears the content of all task columns on the board.
 * 
 * This function clears the content of the 'toDo', 'inProgress', 'awaitFeedback', and 'done' columns.
 */
function clearColumnsBoard() {
    const columns = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    columns.forEach(columnId => {
        const columnElement = document.getElementById(columnId);
        if (columnElement) {
            columnElement.innerHTML = '';
        }
    });
}

/**
 * Renders the tasks to the appropriate columns on the board.
 * 
 * This function iterates over the tasks and renders each task into the corresponding column 
 * based on its status ('toDo', 'inProgress', 'awaitFeedback', 'done').
 * 
 * @param {Array<Object>} tasksToRender - The array of tasks to render.
 */
function renderTasksToColumnsBoard(tasksToRender) {
    tasksToRender.forEach((task, i) => {
        const columnElement = document.getElementById(task.column);
        if (columnElement) {
            const taskHtml = returnRenderHtml(i, task);
            columnElement.innerHTML += taskHtml;
            categoryColor(i, task);
            renderPriority(i);
            renderContacts(i);
            renderSubtasks(i);
        }
    });
}

/**
 * Updates the board by showing a message if there are no tasks in a column.
 * 
 * This function checks each task column and displays a "No tasks" message if the column is empty.
 */
function updateNoTaskMessagesBoard() {
    const columns = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    columns.forEach(columnId => {
        const columnElement = document.getElementById(columnId);
        if (columnElement) {
            const noTaskMessage = columnElement.querySelector('.noTask');
            if (columnElement.querySelectorAll('.taskCard').length === 0) {
                if (!noTaskMessage) {
                    const messageHtml = `<div class="noTask">No tasks in ${columnId.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>`;
                    columnElement.innerHTML += messageHtml;
                }
            } else {
                if (noTaskMessage) {
                    noTaskMessage.remove();
                }
            }
        }
    });
}

/**
 * Applies the appropriate category color to a task card.
 * 
 * This function adds a CSS class to the task category element based on the task's category.
 * 
 * @param {number} i - The index of the task.
 * @param {Object} task - The task object containing category information.
 */
function categoryColor(i, task) {
    const categoryElement = document.getElementById(`taskCategory${i}`);
    if (categoryElement) {
        if (task.category === 'User Story') {
            categoryElement.classList.add('userTask');
        } else if (task.category === 'Technical task') {
            categoryElement.classList.add('technicalTask');
        }
    }
}

/**
 * Renders the priority icon for a task.
 * 
 * This function sets the inner HTML of the priority element based on the task's priority level.
 * 
 * @param {number} i - The index of the task.
 */
function renderPriority(i) {
    const priorityElement = document.getElementById(`priority${i}`);
    if (priorityElement) {
        if (tasks[i].priority === 'Low') {
            priorityElement.innerHTML = `<img src="./assets/img/svg/low.svg" alt="Low Priority">`;
        }
        if (tasks[i].priority === 'Medium') {
            priorityElement.innerHTML = `<img src="./assets/img/png/mediumColor.png" alt="Medium Priority">`;
        }
        if (tasks[i].priority === 'Urgent') {
            priorityElement.innerHTML = `<img src="./assets/img/svg/urgent.svg" alt="Urgent Priority">`;
        }
    }
}

/**
 * Renders the assigned contacts for a task.
 * 
 * This function displays the assigned contacts for a task, showing their initials and a color-coded background.
 * 
 * @param {number} i - The index of the task.
 */
function renderContacts(i) {
    const renderedContacts = document.getElementById(`contacts${i}`);
    if (!renderedContacts) return;

    const validContacts = getValidContactsBoard(i);
    renderValidContactsBoard(renderedContacts, validContacts);
}

/**
 * Retrieves the valid contacts assigned to a task.
 * 
 * This function filters and returns the contacts that are valid and assigned to the task.
 * 
 * @param {number} i - The index of the task.
 * @returns {Array<string>} An array of valid contact names.
 */
function getValidContactsBoard(i) {
    const assignedContacts = tasks[i].assignedContacts || [];
    return assignedContacts
        .map(c => c.name)
        .filter(name => contacts.some(c => c.name === name));
}

/**
 * Renders the valid contacts into the task card.
 * 
 * This function displays up to five assigned contacts in the task card. If there are more than five contacts, 
 * it shows the number of additional contacts.
 * 
 * @param {HTMLElement} renderedContacts - The HTML element where the contacts will be rendered.
 * @param {Array<string>} validContacts - The array of valid contact names to display.
 */
function renderValidContactsBoard(renderedContacts, validContacts) {
    renderedContacts.innerHTML = '';
    validContacts.slice(0, 5).forEach(name => {
        const contact = contacts.find(c => c.name === name);
        if (contact) {
            const { initials, color = '#000' } = contact;
            renderedContacts.innerHTML += `<div class="assignedTaskContacts" style="background-color: ${color};">${initials}</div>`;
        }
    });
    if (validContacts.length > 5) {
        const additionalContacts = validContacts.length - 5;
        renderedContacts.innerHTML += `<div class="assignedTaskContacts" style="background-color: gray;">+${additionalContacts}</div>`;
    }
}

/**
 * Renders the subtasks progress for a task.
 * 
 * This function sets up and updates the progress bar for subtasks in the task card.
 * 
 * @param {number} i - The index of the task.
 */
function renderSubtasks(i) {
    const subtaskArea = document.getElementById(`subtaskArea${i}`);
    if (!subtaskArea) return console.error(`Subtask area not found for task index ${i}`);

    let { progressBar, progressBarFill, subtaskProgressText } = setupProgressBarBoard(subtaskArea);
    updateSubtaskProgressBoard(i, progressBar, progressBarFill, subtaskProgressText);
    handleSubtaskAreaDisplayBoard(subtaskArea, tasks[i].subtasks || []);
}

/**
 * Sets up the progress bar elements in the task card.
 * 
 * This function creates and returns the progress bar elements needed to display subtask progress.
 * 
 * @param {HTMLElement} subtaskArea - The HTML element where the progress bar will be rendered.
 * @returns {Object} An object containing the progress bar elements.
 */
function setupProgressBarBoard(subtaskArea) {
    let progressBar = subtaskArea.querySelector('.progress-bar');
    let progressBarFill = subtaskArea.querySelector('.progress-bar-fill');
    let subtaskProgressText = subtaskArea.querySelector('.subtaskProgressText');
    if (!progressBar) {
        subtaskArea.innerHTML += `<div class='progress-bar'><div class='progress-bar-fill'></div></div><div class='subtaskProgressText'></div>`;
        progressBar = subtaskArea.querySelector('.progress-bar');
        progressBarFill = subtaskArea.querySelector('.progress-bar-fill');
        subtaskProgressText = subtaskArea.querySelector('.subtaskProgressText');
    }
    return { progressBar, progressBarFill, subtaskProgressText };
}

/**
 * Updates the progress of subtasks for a task.
 * 
 * This function calculates and updates the progress bar and text based on the completion of subtasks.
 * 
 * @param {number} i - The index of the task.
 * @param {HTMLElement} progressBar - The progress bar element.
 * @param {HTMLElement} progressBarFill - The fill element of the progress bar.
 * @param {HTMLElement} subtaskProgressText - The element displaying the subtask progress text.
 */
function updateSubtaskProgressBoard(i, progressBar, progressBarFill, subtaskProgressText) {
    const subtasks = tasks[i].subtasks || [];
    const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
    const progress = (completedSubtasks / subtasks.length) * 100;

    progressBarFill.style.width = `${progress}%`;
   
    if(window.innerWidth < 1440){
        subtaskProgressText.textContent = `${completedSubtasks}/${subtasks.length}`;
    }
    if(window.innerWidth > 1440){
        subtaskProgressText.textContent = `${completedSubtasks}/${subtasks.length} Subtasks`;
    }
}

/**
 * Handles the display of the subtask area in the task card.
 * 
 * This function shows or hides the subtask area based on the presence of subtasks.
 * 
 * @param {HTMLElement} subtaskArea - The HTML element representing the subtask area.
 * @param {Array<Object>} subtasks - The array of subtasks for the task.
 */
function handleSubtaskAreaDisplayBoard(subtaskArea, subtasks) {
    const hasSubtasks = subtasks.length > 0;
    subtaskArea.querySelector('.progress-bar').style.display = hasSubtasks ? 'flex' : 'none';
    subtaskArea.querySelector('.subtaskProgressText').style.display = hasSubtasks ? 'flex' : 'none';
    subtaskArea.style.display = hasSubtasks ? 'flex' : 'none';
}
