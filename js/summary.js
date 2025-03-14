const tasks = [];

/**
 * Initializes the greeting when the window loads.
 */
window.onload = updateGreeting;

/**
 * Event listener that updates the greeting element with the logged-in user's name if available.
 */
document.addEventListener('DOMContentLoaded', () => {
    let loggedInUserName = localStorage.getItem('loggedInUserName');
    if (loggedInUserName) {
        let greetNameElement = document.getElementById('greetName');
        if (greetNameElement) {
            greetNameElement.innerHTML = `${loggedInUserName}`;
        }
    } else {
        console.log('No logged-in user name found');
    }
});

/**
 * Returns a greeting based on the current time of day.
 * @returns {string} The greeting message.
 */
function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;
    if (hours < 12) {
        greeting = "Good morning";
    } else if (hours < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }
    return greeting;
}

/**
 * Generates an HTML string containing the current greeting.
 * @returns {string} The HTML content for the greeting.
 */
function generateGreetingHTML() {
    const time = getGreeting();
    const htmlContent = `<div>
        <h1>${time}</h1>
    </div>`;
    return htmlContent;
}

/**
 * Updates the greeting displayed in the element with class 'greetBox1'.
 */
function updateGreeting() {
    const greeting = getGreeting();
    document.querySelector('.greetBox1').textContent = greeting + ',';
}

/**
 * Formats a given date as a string in the format DD-MM-YYYY.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date.
 */
function formatDate(date) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

/**
 * Sets the future date on the element with class 'date'. 
 * If there are urgent tasks, it sets the date to the earliest urgent task's due date.
 * Otherwise, it sets the date to 14 days from now.
 */
function setFutureDate() {
    loadTasksFromLocalStorage();
    const urgentTasks = tasks.filter(task => task.priority === "Urgent");
    if (urgentTasks.length > 0) {
        const earliestUrgentTask = urgentTasks.reduce((earliest, current) => {
            return new Date(current.dueDate) < new Date(earliest.dueDate) ? current : earliest;
        });
        const futureDate = new Date(earliestUrgentTask.dueDate);
        const formattedDate = formatDate(futureDate);
        document.querySelector('.date').textContent = formattedDate;
    } else {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 14);
        const formattedDate = formatDate(futureDate);
        document.querySelector('.date').textContent = formattedDate;
    }
}

/**
 * Loads tasks from local storage and updates the global `tasks` array.
 */
function loadTasksFromLocalStorage() {
    let tasksFromStorage = localStorage.getItem('tasks');
    if (tasksFromStorage) {
        const parsedTasks = JSON.parse(tasksFromStorage);
        tasks.length = 0;
        tasks.push(...parsedTasks);
    }
}

/**
 * Counts the number of tasks in the 'done' column.
 * @returns {number} The count of completed tasks.
 */
function countCompletedTasks() {
    const completedTasksCount = tasks.filter(task => task.column === 'done').length;
    return completedTasksCount;
}

/**
 * Counts the number of tasks in the 'toDo' column.
 * @returns {number} The count of tasks in the 'toDo' column.
 */
function completedTaskstoDoCount() {
    const completedTaskstoDoCount = tasks.filter(task => task.column === 'toDo').length;
    return completedTaskstoDoCount;
}

/**
 * Counts the number of tasks in the 'inProgress' column.
 * @returns {number} The count of tasks in the 'inProgress' column.
 */
function completedTasksInProgress() {
    const completedTasksInProgress = tasks.filter(task => task.column === 'inProgress').length;
    return completedTasksInProgress;
}

/**
 * Counts the number of tasks in the 'awaitFeedback' column.
 * @returns {number} The count of tasks in the 'awaitFeedback' column.
 */
function completedTasksFeedback() {
    const completedTasksFeedback = tasks.filter(task => task.column === 'awaitFeedback').length;
    return completedTasksFeedback;
}

/**
 * Counts the number of tasks with a priority of 'Urgent'.
 * @returns {number} The count of urgent tasks.
 */
function completedTasksUrgent() {
    const completedTasksUrgent = tasks.filter(task => task.priority === 'Urgent').length;
    return completedTasksUrgent;
}

/**
 * Handles window load event and initializes the greeting screen and task list.
 */
window.onload = function () {
    
    const showGreeting = sessionStorage.getItem('ShowGreetingScreen') === 'true';
    if (window.innerWidth <= 850 && !showGreeting) {
        document.getElementById('greeting-container').style.display = 'flex';
        showGreetingMessage();
        
        setTimeout(function () {
            document.getElementById('greeting-container').style.display = 'none';
        }, 2000);

        sessionStorage.setItem('ShowGreetingScreen', 'true');
    } else {
        document.getElementById('greeting-container').style.display = 'none';
        updateGreeting()
    }

    setFutureDate();
    loadTasksFromLocalStorage();
    generateTasks();
};

/**
 * Generates and updates the task counts in the corresponding elements.
 */
function generateTasks() {
    document.getElementById('doneCount').innerHTML = countCompletedTasks();
    document.getElementById('toDoCount').innerHTML = completedTaskstoDoCount();
    document.getElementById('inProgress').innerHTML = completedTasksInProgress();
    document.getElementById('awaitFeedback').innerHTML = completedTasksFeedback();
    document.getElementById('urgentCount').innerHTML = completedTasksUrgent();
    document.getElementById('board').innerHTML = tasks.length;
    console.log(tasks)
}

/**
 * Displays a greeting message and the logged-in user's name.
 */
function showGreetingMessage() {
    const greeting = getGreeting();
    document.getElementById('greeting').textContent = greeting + ',';
    document.getElementById('greeting-name').textContent = localStorage.getItem('loggedInUserName');
}
