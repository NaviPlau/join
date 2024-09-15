/**
 * Returns the HTML string for displaying the category dropdown menu.
 * 
 * This function generates the HTML for the dropdown that allows the user to choose between different task categories.
 * 
 * @returns {string} The HTML string for the category dropdown menu.
 */
function returnShowCategoryOverallHtml() {
  return `
      <div class="openedDropDown">
        <span class="spanHover" onclick="chooseCategory(0)">${category[0]}</span>
        <span class="spanHover" onclick="chooseCategory(1)"> ${category[1]}</span>
      </div>
    `;
}

/**
 * Returns the HTML string for displaying the selected category in the dropdown.
 * 
 * This function generates the HTML for showing the chosen category in the dropdown after selection.
 * 
 * @param {number} index - The index of the selected category in the `category` array.
 * @returns {string} The HTML string for the chosen category display.
 */
function returnChooseCategoryOverallHTML(index) {
  return `
    <span onclick="showCategory()" class="spanCategory">${category[index]}</span>
    <img class="dropDownImg" id="dropDownImg" src="./assets/img/png/arrow_drop_down (1).png" alt="">
  `;
}

/**
 * Returns the HTML string for displaying a contact in the contact selection dropdown.
 * 
 * This function generates the HTML for each contact displayed in the dropdown, allowing users to assign contacts to a task.
 * 
 * @param {Object} contact - The contact object containing the contact's information.
 * @param {number} index - The index of the contact in the contact list.
 * @returns {string} The HTML string for displaying the contact in the dropdown.
 */
function returnShowContactsOverallHTML(contact, index) {
  return `
    <div class="contactsOpen ${selectedContacts.some(sc => sc.name === contact.name) ? 'selected' : ''}" 
      data-index="${index}">
      <div class="contactInitials" style="background-color: ${contact.color};">
        ${contact.initials}
      </div>
      <div class="contactName">
        <span style="width:100%;">${contact.name}</span>
        <img src="./assets/img/png/Rectangle 5.png" alt="">
      </div>
    </div>
  `;
}

/**
 * Returns the HTML string for displaying an assigned contact.
 * 
 * This function generates the HTML for a contact's initials to be shown in the task's assigned contacts area.
 * 
 * @param {Object} contact - The contact object containing the contact's information.
 * @returns {string} The HTML string for displaying the contact's initials in the assigned contacts area.
 */
function renderOverallAssignedContactsHTML(contact) {
  return `
    <div class="contactInitials" style="background-color: ${contact.color}; color:white;">
      ${contact.initials}
    </div>
  `;
}

/**
 * Returns the HTML string for displaying an assigned contact.
 * 
 * This function generates the HTML for a contact's initials to be shown in the assigned contacts section of the task.
 * 
 * @param {Object} contact - The contact object containing the contact's information.
 * @returns {string} The HTML string for displaying the contact's initials in the assigned contacts area.
 */
function renderAssignedContactsHTML(contact) {
  return `
    <div class="contactInitials" style="background-color: ${contact.color}; color:white;">
      ${contact.initials}
    </div>
  `;
}