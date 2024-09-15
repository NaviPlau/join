/**
 * Base URL for the Firebase tasks database.
 * 
 * @constant {string}
 */
const BASE_TASKS_URL = 'https://join-57676-default-rtdb.europe-west1.firebasedatabase.app/';


/**
 * Fetches the existing tasks from the Firebase database.
 * 
 * This function makes a GET request to the Firebase database to retrieve all existing tasks.
 * 
 * @returns {Promise<Object>} A promise that resolves to the JSON object containing all tasks.
 * @throws Will throw an error if the fetch operation fails.
 */
async function fetchExistingTasks() {
  const response = await fetch(`${BASE_TASKS_URL}.json`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Adjusts task IDs and updates them in Firebase.
 * 
 * This function sorts the tasks by their IDs and ensures that each task has a consecutive ID.
 * If a task ID is not consecutive, it updates the task with the correct ID in the Firebase database.
 * 
 * @param {Object} existingTasks - The object containing existing tasks from Firebase.
 * @returns {Promise<number>} A promise that resolves to the next index to be used for a new task.
 * @throws Will throw an error if any update operation fails.
 */
async function adjustTaskIdsAndUpdate(existingTasks) {
  let tasksArray = existingTasks ? Object.keys(existingTasks).map(key => ({
    ...existingTasks[key],
    id: parseInt(key)
  })) : [];
  
  tasksArray.sort((a, b) => a.id - b.id);

  await Promise.all(tasksArray.map(async (task, index) => {
    if (task.id !== index) {
      task.id = index;
      const response = await fetch(`${BASE_TASKS_URL}/${index}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
  }));

  return tasksArray.length; 
}

/**
 * Collects the new task data from the form.
 * 
 * This function gathers all the necessary data from the form to create a new task.
 * 
 * @returns {Object|null} The task data object, or null if data collection fails.
 */
function collectNewTaskData() {
  const taskData = collectData();
  if (!taskData) {
    console.error("No task data to send");
    return null;
  }
  return taskData;
}

/**
 * Sends a new task to Firebase.
 * 
 * This function sends the collected task data to Firebase, creating a new task with the specified index.
 * 
 * @param {number} nextIndex - The index to be assigned to the new task.
 * @param {Object} taskData - The data of the new task to be sent.
 * @returns {Promise<Object>} A promise that resolves to the JSON object of the newly created task.
 * @throws Will throw an error if the task creation operation fails.
 */
async function sendNewTask(nextIndex, taskData) {
  const taskResponse = await fetch(`${BASE_TASKS_URL}/${nextIndex}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });

  if (!taskResponse.ok) {
    throw new Error(`HTTP error! Status: ${taskResponse.status}`);
  }

  return await taskResponse.json();
}

/**
 * Sends the task data to Firebase, handling the entire process from initialization to saving the new task.
 * 
 * This function initializes the tasks node, fetches existing tasks, adjusts task IDs, and sends the new task data to Firebase.
 * 
 * @async
 * @returns {Promise<void>}
 * @throws Will log an error to the console if any step in the process fails.
 */
async function sendTaskDataToFirebase() {
  try {
    await initializeTasksNode();
    const existingTasks = await fetchExistingTasks();
    const nextIndex = await adjustTaskIdsAndUpdate(existingTasks);
    const taskData = collectNewTaskData();
    if (!taskData) return; 
    const responseAsJson = await sendNewTask(nextIndex, taskData);
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}

/**
 * Adds a timeout to remove the invalid state from form elements after a delay.
 * 
 * This function ensures that the invalid markers are removed after a set time (2000ms).
 */
function validateFormTimeout() {
  setTimeout(() => {
    document.querySelectorAll('.invalid').forEach(element => {
      element.classList.remove('invalid');
    });
  }, 2000); 
}

/**
 * Validates if a category has been selected.
 * 
 * This function checks if the `choosenCategory` variable is set to true. If not, it marks the category dropdown as invalid.
 * 
 * @returns {boolean} True if a category is selected, otherwise false.
 */
function validateFormCategory() {
  let valid = false;
  if (!choosenCategory) {
    valid = false;
    document.getElementById('dropdownCategory').classList.add('invalid');
  } else {
    valid = true;
  }
  return valid;
}