/**
 * Pauses the execution for a specified amount of time.
 * 
 * @param {number} ms - The number of milliseconds to pause.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Opens a dialog with an animation effect.
 * 
 * This function makes the dialog visible, applies CSS classes to trigger animations,
 * and displays a grey background overlay.
 * 
 * @returns {Promise<void>} A promise that resolves after the dialog is fully opened.
 */
async function openDialog() {
  const dialogContainer = document.getElementById("dialog-contacts");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey-background").classList.remove("hidden");
}

/**
 * Closes the currently open dialog with an animation effect.
 * 
 * This function hides the dialog, removes CSS classes to reverse animations, 
 * and hides the grey background overlay.
 * 
 * @returns {Promise<void>} A promise that resolves after the dialog is fully closed.
 */
async function closeDialog() {
  const dialogContainer = document.getElementById("dialog-contacts");
  const inputs = dialogContainer.querySelectorAll('input, textarea');
  inputs.forEach(input => input.value = '');
  inputs.forEach(input => input.classList.remove('error'));
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey-background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
}

/**
 * Opens the edit dialog for a specific contact with an animation effect.
 * 
 * This function sets the current contact's data in the edit form, displays the dialog,
 * and updates the initials and avatar circle.
 * 
 * @param {number} index - The index of the contact to edit.
 * @returns {Promise<void>} A promise that resolves after the dialog is fully opened.
 */
async function openDialogEdit(index) {
  const contact = contacts[index];
  const initials = openDialogEditGenerateInitials(contact.name);
  currentContactIndex = index;
  openDialogEditShow();
  openDialogEditPopulateForm(contact, index);
  await openDialogEditAnimate();
  openDialogEditShowGreyBackground();
  openDialogEditUpdateBigLetterCircle(contact, initials);
}

/**
 * Generates initials from a contact's name.
 * 
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials generated from the name.
 */
function openDialogEditGenerateInitials(name) {
  const nameParts = name.split(' ');
  return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
}

/**
 * Displays the edit dialog.
 */
function openDialogEditShow() {
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
}

/**
 * Populates the edit form with the selected contact's data.
 * 
 * @param {Object} contact - The contact object containing the data to populate.
 * @param {number} index - The index of the contact being edited.
 */
function openDialogEditPopulateForm(contact, index) {
  document.getElementById('inputEditName').value = contact.name;
  document.getElementById('inputEditEmail').value = contact.email;
  document.getElementById('inputEditPhone').value = contact.phone;
  document.getElementById('inputEditName').dataset.index = index;
  document.getElementById('inputEditEmail').dataset.index = index;
  document.getElementById('inputEditPhone').dataset.index = index;
}

/**
 * Animates the opening of the edit dialog.
 * 
 * @returns {Promise<void>} A promise that resolves after the animation is applied.
 */
async function openDialogEditAnimate() {
  const dialogContainer = document.getElementById("dialog-edit");
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
}

/**
 * Displays the grey background overlay.
 */
function openDialogEditShowGreyBackground() {
  document.getElementById("grey-background").classList.remove("hidden");
}

/**
 * Updates the avatar circle with the contact's initials and color.
 * 
 * @param {Object} contact - The contact object containing the data to display.
 * @param {string} initials - The initials of the contact.
 */
function openDialogEditUpdateBigLetterCircle(contact, initials) {
  document.getElementById('bigLetterCircle').innerHTML = generateBigLetterCircle(contact, initials);
}

/**
 * Closes the edit dialog with an animation effect.
 * 
 * This function hides the dialog, removes CSS classes to reverse animations, 
 * and hides the grey background overlay.
 * 
 * @returns {Promise<void>} A promise that resolves after the dialog is fully closed.
 */
async function closeDialogEdit() {
  const dialogContainer = document.getElementById("dialog-edit");

  const inputs = dialogContainer.querySelectorAll('input, textarea');
  inputs.forEach(input => input.classList.remove('error'));

  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey-background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
}

/**
 * Opens a notification dialog with a custom message.
 * 
 * This function displays a message in a dialog and handles its visibility and animations.
 * 
 * @param {string} message - The message to display in the dialog.
 */
async function openDialogContact(message) {
  const dialogContainer = document.getElementById("succesfullyCreated");
  const dialogResponse = document.getElementById('succesfullyDeleted');
  dialogResponse.innerHTML = message;
  openDialogContactTimeout(dialogContainer);
}

/**
 * Handles the timing and animation of the notification dialog.
 * 
 * @param {HTMLElement} dialogContainer - The dialog element to animate.
 */
async function openDialogContactTimeout(dialogContainer) {
  setTimeout(async () => {
    dialogContainer.open = true;
    await sleep(300);
    dialogContainer.classList.add("dialog-open");
    dialogContainer.classList.add("d-flex");
    await sleep(1000);
    dialogContainer.classList.remove("dialog-open");
    await sleep(300);
    dialogContainer.classList.remove("d-flex");
    dialogContainer.open = false;
  }, 300);
}

/**
 * Shows the edit and delete options for a contact on mobile devices.
 */
function showEditContactMobile() {
  let containerEditDeleteMobile = document.querySelector('.contact-box-edit-delete');
  let editContactPoints = document.querySelector('.editContactPoints');
  containerEditDeleteMobile.style.display = "flex";

  function handleClickOutside(event) {
    if (!containerEditDeleteMobile.contains(event.target) &&
        !editContactPoints.contains(event.target)) {
      containerEditDeleteMobile.style.display = "none"; 
      document.removeEventListener('click', handleClickOutside); 
    }
  }

  document.addEventListener('click', handleClickOutside);
}
