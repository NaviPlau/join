/**
 * Generates the HTML for a contact card.
 * 
 * This function creates a contact card with the contact's initials, name, and email. 
 * The name and email are truncated if necessary. The contact card is clickable and 
 * triggers the `displayContactInfo` function when clicked.
 * 
 * @param {Object} contact - The contact object containing name, email, color, and other information.
 * @param {string} initials - The initials of the contact.
 * @param {number} index - The index of the contact in the list.
 * @returns {string} The HTML string for the contact card.
 */
function generateContact(contact, initials, index) {
  const truncatedName = truncate(contact.name);
  const truncatedEmail = truncate(contact.email);

  return `
    <div id="contact${index}" class="contacts" onclick="displayContactInfo(${index})">
      <div class="letter-circle" style="background-color: ${contact.color};">${initials}</div>
      <div class="contact-info">
        <span>${truncatedName}</span>
        <a class="contact-email" href="#">${truncatedEmail}</a>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for a letter box.
 * 
 * This function creates a letter box with the given initial, followed by a separator.
 * 
 * @param {string} initial - The initial letter to display in the letter box.
 * @returns {string} The HTML string for the letter box.
 */
function generateLetterBox(initial) {
  return `<div class="letter-box">${initial}</div>
            <div class="contact-seperator"></div>`;
}

/**
 * Generates the HTML for detailed contact information.
 * 
 * This function creates a detailed view of a contact, including options to edit or delete 
 * the contact, and displays the contact's name, email, and phone number.
 * 
 * @param {Object} contact - The contact object containing name, email, phone, color, and other information.
 * @param {string} initials - The initials of the contact.
 * @param {number} index - The index of the contact in the list.
 * @returns {string} The HTML string for the detailed contact information.
 */
function generateContactInfo(contact, initials, index) {
  return `
  <div class="contacts-info">
      <div class="contacts-info-name">
        <div class="big-letter-circle" style="background-color: ${contact.color};">${initials}</div>
        <div class="contact-box-name">
          <h3>${contact.name}</h3>
          <div class="contact-box-edit-delete">
            <div onclick="openDialogEdit(${index})" class="edit-link">
              <svg class="icon-edit" width="18" height="18" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" />
              </svg>Edit
            </div>
            <div onclick="deleteContact(${index})" class="delete-link">
              <svg class="icon-delete" width="16" height="18" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" />
              </svg>Delete
            </div>
          </div>
        </div>
      </div>
      <div class="contacts-information">
        <span>Contact Information</span>
      </div>
      <div class="contacts-info-email-phone">
        <div class="contacts-info-email">
          <span style="font-weight: 700;">Email</span>
          <span style="color: #007CEE;"> 
            <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>
          </span>
        </div>
        <div class="contacts-info-phone">
          <span style="font-weight: 700;">Phone</span>
          <span>${contact.phone}</span>
        </div>
      </div>
      </div>
    `;
}

/**
 * Generates the HTML for a large circle displaying the contact's initials.
 * 
 * This function creates a large circle with the contact's initials, styled with the 
 * contact's specific color.
 * 
 * @param {Object} contact - The contact object containing color information.
 * @param {string} initials - The initials of the contact.
 * @returns {string} The HTML string for the large circle with initials.
 */
function generateBigLetterCircle(contact, initials) {
  return `
    <div class="bigLetterCircle" style="background-color: ${contact.color}";>${initials}
    </div>
    `;
}

/**
 * Generates the HTML for the delete button in a dialog.
 * 
 * This function creates a delete button that triggers the `deleteContact` function 
 * and a save button that triggers the `validateEditForm` function, both within a dialog.
 * 
 * @param {number} index - The index of the contact in the list.
 * @returns {string} The HTML string for the delete button dialog.
 */
function generateDeleteButtonDialog(index){
  return `
  <button onclick="deleteContact(${index}), closeDialogEdit()" class="button-delete">
  Delete
</button>
<button onclick="validateEditForm(${index})" class="button-save">
  Save
  <img
    class="check-icon-button"
    src="./assets/img/png/check.png"
    alt="check"
  />
</button>
  `;
}
