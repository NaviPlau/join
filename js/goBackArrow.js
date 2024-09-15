/**
 * Redirects the user to the appropriate page based on their login status.
 * 
 * This function checks if the `loggedInUserName` is stored in `localStorage`. 
 * If no username is found (i.e., the user is not logged in), the function 
 * redirects the user to the "index.html" page. If a username is found, 
 * the user is redirected to the "summary.html" page.
 */
function goBack() {
  var loggedInUserName = localStorage.getItem("loggedInUserName");
  if (loggedInUserName === null || loggedInUserName === "") {
    window.history.back();
  } else {
    window.location.href = "summary.html";
  }
}