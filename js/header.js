/**
 * Event listener that triggers when the DOM content is fully loaded and parsed.
 * 
 * This listener calls the `onDOMContentLoaded` function, which initializes the application by 
 * setting up event listeners and handling any necessary startup logic. This is typically where
 * you would perform tasks that require the DOM to be fully constructed.
 */
document.addEventListener('DOMContentLoaded', onDOMContentLoaded);


/**
 * Handler for the DOMContentLoaded event.
 * 
 * Sets up event listeners and initializes the user profile display.
 */
function onDOMContentLoaded() {
  let includesLoadedHandled = false;

  document.addEventListener('includesLoaded', () => handleIncludesLoaded(includesLoadedHandled));
  handleIncludesLoaded(includesLoadedHandled);

  document.addEventListener('click', handleDocumentClick);
}

/**
 * Handles the 'includesLoaded' event.
 * 
 * Ensures that the user profile is only handled once, even if the event is triggered multiple times.
 * 
 * @param {boolean} includesLoadedHandled - A flag to ensure the profile is handled only once.
 */
function handleIncludesLoaded(includesLoadedHandled) {
  if (!includesLoadedHandled) {
    includesLoadedHandled = true;
    handleUserProfile();
  }
}

/**
 * Handles the display of the user's profile initials.
 * 
 * Retrieves the logged-in user's name from localStorage, generates initials, 
 * and updates the relevant DOM element.
 */
function handleUserProfile() {
  let loggedInUserName = localStorage.getItem('loggedInUserName');
  if (loggedInUserName) {
    let initials = getInitials(loggedInUserName);
    updateInitialsElement(initials);
  }
}

/**
 * Generates the initials from the user's name.
 * 
 * @param {string} userName - The full name of the user.
 * @returns {string} The initials generated from the user's name.
 */
function getInitials(userName) {
  let nameParts = userName.split(' ');
  return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
}

/**
 * Updates the DOM element displaying the user's initials.
 * 
 * Also adds a click event listener to toggle the visibility of the logout button.
 * 
 * @param {string} initials - The initials of the logged-in user.
 */
function updateInitialsElement(initials) {
  let initialsElement = document.getElementById('user-profile-initials');
  if (initialsElement) {
    initialsElement.innerHTML = `${initials}`;
    initialsElement.addEventListener('click', toggleLogOutVisibility);
  }
}

/**
 * Toggles the visibility of the logout element.
 * 
 * This function hides or shows the logout button when the user clicks on their initials.
 */
function toggleLogOutVisibility() {
  let logOutElement = document.getElementById('logOut');
  if (logOutElement) {
    logOutElement.classList.toggle('d-none');
  }
}

/**
 * Event listener that handles clicks on the document.
 * 
 * If the user clicks outside the logout button and their initials, the logout button is hidden.
 * 
 * @param {Event} event - The click event.
 */
function handleDocumentClick(event) {
  let logOutElement = document.getElementById('logOut');
  let initialsElement = document.getElementById('user-profile-initials');

  if (logOutElement && !logOutElement.contains(event.target) &&
    !initialsElement.contains(event.target) &&
    !event.target.closest('#logOut')) {
    logOutElement.classList.add('d-none');
  }
}


/**
 * Logs the user out by clearing relevant data from localStorage and sessionStorage.
 */
function logout() {
  localStorage.removeItem('loggedInUserName');
  localStorage.removeItem('loggedInUserEmail');
  sessionStorage.setItem('ShowGreetingScreen', 'false');
  sessionStorage.removeItem('loggedInUserName');
}

/**
 * Includes HTML content from external files into elements with the `w3-include-html` attribute.
 * 
 * This function recursively loads content into all matching elements and calls a callback function 
 * once all content is loaded.
 * 
 * @param {Function} callback - A function to call after all includes are loaded.
 */
function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          elmnt.removeAttribute("w3-include-html");
          includeHTML(callback);
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  if (callback) callback();
}

/**
 * Hides certain elements on the page if the user is not logged in.
 * 
 * This function dynamically inserts CSS to hide elements like the icon bar and user profile initials.
 */
function hideElements() {
  if (!localStorage.getItem('loggedInUserName')) {
    var styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
          .icon-bar { display: none !important; }
          #user-profile-initials { display: none !important; }
          .credit-box { height: 655px !important; }
          .icon-box { width: 42px !important; }
      `;
    document.head.appendChild(styleSheet);
  }
}

/**
 * Event listener that triggers when the DOM content is fully loaded.
 * 
 * This listener initializes the checking of the header logo and its responsiveness.
 */
document.addEventListener('DOMContentLoaded', function () {
  checkForHeaderLogo();
});

/**
 * Updates the header logo based on the window width.
 * 
 * This function checks if the window width is below 600 pixels and updates the logo 
 * in the header accordingly.
 */
function checkForWidthHeader() {
  let logoContainer = document.getElementById('headerLogo');
  if (logoContainer) {
    logoContainer.innerHTML = window.innerWidth < 600
      ? `<img src="assets/img/png/Capa 2.png">`
      : `<span>Kanban Project Management Tool</span>`;
  }
}

/**
 * Checks for the presence of the header logo element and adjusts it based on screen width.
 * 
 * If the header logo is not present, the function rechecks after a delay until the element is found.
 */
function checkForHeaderLogo() {
  let logoContainer = document.getElementById('headerLogo');
  if (logoContainer) {
    checkForWidthHeader();
    window.addEventListener('resize', checkForWidthHeader);
  } else {
    setTimeout(checkForHeaderLogo, 100);
  }
}

includeHTML(hideElements);