/**
 * Handles the drop event for a task, updating its position within the task board.
 * 
 * @async
 * @param {DragEvent} event - The drop event triggered by the user.
 */
async function drop(event) {
  event.preventDefault();
  const { taskId, taskElement, targetColumnId } = getDropEventDetails(event);
  if (taskElement && targetColumnId) {
    const task = getTask(taskId);
    if (task) {
      await moveTask(task, targetColumnId);
    } else {
      console.error('Task not found in tasks array:', { taskId, tasks });
    }
  } else {
    console.error('Task element or target column not found:', { taskElement, targetColumnId });
  }

  if (taskElement) {
    taskElement.classList.remove('taskCardClickHold');
  }
}

/**
 * Extracts the details from the drop event, including the task ID, task element, and target column ID.
 * 
 * @param {DragEvent} event - The drop event triggered by the user.
 * @returns {Object} - An object containing the task ID, task element, and target column ID.
 * @returns {string} taskId - The ID of the dragged task.
 * @returns {HTMLElement} taskElement - The DOM element representing the task.
 * @returns {string} targetColumnId - The ID of the column where the task is dropped.
 */
function getDropEventDetails(event) {
  const taskId = event.dataTransfer.getData('text/plain');
  return {
    taskId,
    taskElement: document.getElementById(taskId),
    targetColumnId: event.target.closest('.taskColumn').id
  };
}

/**
 * Retrieves a task object based on its task ID.
 * 
 * @param {string} taskId - The ID of the task to retrieve.
 * @returns {Object|null} - The task object if found, otherwise null.
 */
function getTask(taskId) {
  const taskIndex = parseInt(taskId.replace('taskCard', ''));
  return tasks[taskIndex];
}

/**
 * Moves a task to a new column and updates the task list.
 * 
 * @async
 * @param {Object} task - The task object to move.
 * @param {string} targetColumnId - The ID of the target column.
 */
async function moveTask(task, targetColumnId) {
  task.column = targetColumnId;
  await updateTaskInFirebase(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

/**
 * Allows the drop event to occur on the target element.
 * 
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Handles the start of a drag event for a task.
 * 
 * @param {DragEvent} event - The drag event triggered by the user.
 */
function drag(event) {
  const taskId = event.target.id;
  const taskElement = document.getElementById(taskId);
  taskElement.classList.add('taskCardClickHold');
  event.dataTransfer.setData('text/plain', taskId);
}

/**
 * Handles the end of a drag event, cleaning up any visual indicators.
 * 
 * @param {DragEvent} event - The drag event triggered by the user.
 */
function dragEnd(event) {
  const taskId = event.target.id;
  const taskElement = document.getElementById(taskId);
  taskElement.classList.remove('taskCardClickHold');
  document.querySelectorAll('.taskColumn').forEach(column => {
      column.classList.remove('columnDragTo');
  });
}

/**
 * Adds a visual indication when a task is held by mouse.
 * 
 * @param {MouseEvent} event - The mouse event triggered by the user.
 */
function mouseHold(event) {
  const taskCard = event.currentTarget;
  taskCard.classList.add('taskCardClickHold');
}

/**
 * Removes the visual indication when the mouse is released.
 * 
 * @param {MouseEvent} event - The mouse event triggered by the user.
 */
function mouseRelease(event) {
  const taskCard = event.currentTarget;
  taskCard.classList.remove('taskCardClickHold');
}

/**
 * Removes the visual indication when the mouse leaves the task element.
 * 
 * @param {MouseEvent} event - The mouse event triggered by the user.
 */
function mouseLeave(event) {
  const taskCard = event.currentTarget;
  taskCard.classList.remove('taskCardClickHold');
}

/**
 * Handles the drag enter event for a column, adding a visual indicator.
 * 
 * @param {DragEvent} event - The drag event triggered by the user.
 */
function dragEnter(event) {
  event.preventDefault();
  const column = event.currentTarget;
  column.classList.add('columnDragTo');
}

/**
 * Handles the drag leave event for a column, removing the visual indicator.
 * 
 * @param {DragEvent} event - The drag event triggered by the user.
 */
function dragLeave(event) {
  const column = event.currentTarget;
  column.classList.remove('columnDragTo');
}
