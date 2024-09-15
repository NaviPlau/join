/**
 * 
 * @param {string} name -
 */

function goBack() {
    var loggedInUserName = document.getElementById("loggedInUserName").value;
    
    if (loggedInUserName === "") {
        window.location.href = "index.html";
    } else {
        window.location.href = "summary.html";
    }
}