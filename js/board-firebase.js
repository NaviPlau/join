/**
 * The base URL for the Firebase database where tasks are stored.
 * @constant {string}
 */
const BASE_URL = 'https://join-57676-default-rtdb.europe-west1.firebasedatabase.app/tasks/';

/**
 * Fetches tasks from the Firebase database and updates the local tasks array.
 * 
 * This function retrieves all tasks from the Firebase database, filters out null entries,
 * and updates the local `tasks` array. It then stores the tasks in `localStorage` and renders them.
 * 
 * @returns {Promise<void>} A promise that resolves when the tasks have been fetched and processed.
 */
async function getTasksFromDataBase() {
  try {
      const response = await fetch(BASE_URL + '.json');
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      const responseAsJson = await response.json();
      const tasksArray = Object.keys(responseAsJson)
          .filter(key => responseAsJson[key] !== null)
          .map(key => ({ id: key, ...responseAsJson[key] }));
      tasks.length = 0;
      tasks.push(...tasksArray);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
  } catch (error) {
      console.warn('There was a problem with the fetch operation:', error);
  }
}

/**
 * Updates a task in the Firebase database.
 * 
 * This function sends a PUT request to Firebase to update the specified task.
 * 
 * @param {Object} task - The task object to update in Firebase.
 * @returns {Promise<void>} A promise that resolves when the task has been updated.
 */
async function updateTaskInFirebase(task) {
  try {
      const response = await fetch(`${BASE_URL}${task.id}.json`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
      });
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      const updatedTask = await response.json();
  } catch (error) {
      console.warn('There was a problem with the fetch operation:', error);
  }
}

/**
 * Sends new task data to Firebase and updates the task list.
 * 
 * This function initializes the tasks node in Firebase if necessary, fetches and sorts existing tasks,
 * updates their IDs, and saves the new task. Finally, it fetches the updated tasks list from Firebase.
 * 
 * @returns {Promise<void>} A promise that resolves when the new task has been saved and the tasks list updated.
 */
async function sendTaskDataToFirebaseAddTask() {
  try {
    await initializeTasksNode();

    const tasksArray = await fetchAndSortTasksAddTask();
    await updateTaskIdsAddTask(tasksArray);
    
    const nextIndex = tasksArray.length;
    const taskData = collectData();
    if (!taskData) {
      throw new Error("No task data to send");
    }

    await saveNewTaskAddTask(taskData, nextIndex);
    getTasksFromDataBase();
  } catch (error) {
    console.warn('Error saving data to Firebase:', error);
  }
}

/**
 * Fetches and sorts tasks from Firebase.
 * 
 * This function retrieves tasks from Firebase, sorts them by their IDs, and returns the sorted array.
 * 
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of sorted tasks.
 * @throws {Error} If the fetch operation fails.
 */
async function fetchAndSortTasksAddTask() {
  const response = await fetch(`${BASE_URL}.json`);
  if (!response.ok) {
    throw new Error(`HTTP error during fetch tasks! Status: ${response.status}`);
  }

  const existingTasks = await response.json();
  let tasksArray = existingTasks ? Object.keys(existingTasks).map(key => ({ ...existingTasks[key], id: parseInt(key) })) : [];

  tasksArray.sort((a, b) => a.id - b.id);
  return tasksArray;
}

/**
 * Updates the IDs of tasks in Firebase to ensure they are sequential.
 * 
 * This function iterates over the sorted tasks and updates their IDs in Firebase if they are not sequential.
 * 
 * @param {Array<Object>} tasksArray - The array of sorted tasks.
 * @returns {Promise<void>} A promise that resolves when all task IDs have been updated.
 */
async function updateTaskIdsAddTask(tasksArray) {
  const promises = tasksArray.map((task, index) => {
    if (task.id !== index) {
      task.id = index;
      return fetch(`${BASE_URL}/${index}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });
    }
  });

  await Promise.all(promises);
}

/**
 * Saves a new task to Firebase.
 * 
 * This function sends a PUT request to Firebase to save the new task at the next available index.
 * 
 * @param {Object} taskData - The data of the task to save.
 * @param {number} nextIndex - The index at which to save the new task.
 * @returns {Promise<Object>} A promise that resolves to the saved task data.
 * @throws {Error} If the save operation fails.
 */
async function saveNewTaskAddTask(taskData, nextIndex) {
  const taskResponse = await fetch(`${BASE_URL}/${nextIndex}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  if (!taskResponse.ok) {
    throw new Error(`HTTP error during save task! Status: ${taskResponse.status}`);
  }

  return await taskResponse.json();
}

/**
 * Updates a task in Firebase and refreshes the UI.
 * 
 * This function updates the task in Firebase, re-renders the task board, and opens the updated task in the UI.
 * 
 * @param {Object} updatedTask - The task object to update and display.
 */
function updateTaskInFirebaseAndUI(updatedTask) {
  updateTaskInFirebase(updatedTask).then(() => {
      renderTasks();
      closeEdit();
      openTask(updatedTask);
  }).catch(error => {
      console.warn('Error updating task in Firebase:', error);
  });
}
