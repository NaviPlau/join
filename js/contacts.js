let contacts = [];
let initials = [];
let colorIndex = 0;
let highlightedContactIndex = -1;
const colors = ['#FF7A00','#FF5EB3','#9747FF','#9327FF','#00BEE8','#1FD7C1','#FF745E',
  '#FFA35E','#FC71FF','#FFC701','#0038FF','#C3FF2B','#FFE62B','#FF4646','#FFBB2B'
];

/**
 * Base URL for the contacts data in Firebase.
 * @constant {string}
 */
const BASE_TASKS_URL = 'https://join-57676-default-rtdb.europe-west1.firebasedatabase.app/contacts/';

/**
 * Renders the list of contacts by fetching data from the server and displaying it.
 */
function renderContacts() {
  const contactList = document.getElementById('contactList');
  contactList.innerHTML = ''; 
  fetch(BASE_TASKS_URL + '.json')
    .then(response => response.json())
    .then(data => {
      if (data) {
        renderContactsContactInitials(data);
        renderContactsGroupedContacts();
        if (highlightedContactIndex >= 0) {
          highlightContact(highlightedContactIndex);
        }
      } 
    })
    .catch(error => {
      console.error('Fehler beim Laden der Daten:', error);
    });
}

/**
 * Extracts and stores contact initials from the fetched data.
 * 
 * @param {Object} data - The data fetched from the server.
 */
function renderContactsContactInitials(data){
  contacts = Object.values(data);
  initials = contacts.map(contact => {
    let nameParts = contact.name.split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  });
}

/**
 * Groups contacts by their initials and renders them.
 */
function renderContactsGroupedContacts(){
  const groupedContacts = contacts.reduce((acc, contact, index) => {
    let nameParts = contact.name.split(' ');
    let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    let firstInitial = initials.charAt(0);
    if (!acc[firstInitial]) {
      acc[firstInitial] = [];
    }
    acc[firstInitial].push({ contact, initials, index });
    return acc;
  }, {});
  renderContactsSortedInitials(groupedContacts);
}

/**
 * Sorts the grouped contacts by their initials and renders them in the contact list.
 * 
 * @param {Object} groupedContacts - The contacts grouped by their initials.
 */
function renderContactsSortedInitials(groupedContacts){
  const sortedInitials = Object.keys(groupedContacts).sort();
  sortedInitials.forEach(initial => {
    contactList.innerHTML += generateLetterBox(initial);
    groupedContacts[initial].forEach(({ contact, initials, index }) => {
      contactList.innerHTML += generateContact(contact, initials, index);
    });
  });
}

/**
 * Updates the list of initials for the contacts and saves them to localStorage.
 */
function updateInitials() {
  initials = contacts.map(contact => {
      let nameParts = contact.name.split(' ');
      return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  });
  localStorage.setItem('initials', JSON.stringify(initials));
}

/**
 * Adds a new contact to the list.
 * 
 * This function collects the data from the input fields, creates a new contact, 
 * saves it, and updates the UI.
 */
function addContact() {
  const contactData = getContactData();
  if (contactData) {
    const newContact = createAndSaveContact(contactData);
    updateUI(newContact);
  } else {
    alert('Bitte füllen Sie alle Felder aus.');
  }
}

/**
 * Retrieves the contact data from the input fields.
 * 
 * @returns {Object|null} The contact data if all fields are filled, otherwise null.
 */
function getContactData() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  if (name && email && phone) {
    return { name, email, phone };
  } else {
    return null;
  }
}

/**
 * Creates a new contact object and saves it to the contacts array and server.
 * 
 * @param {Object} contactData - The data of the contact to create.
 * @returns {Object} The newly created contact object.
 */
function createAndSaveContact(contactData) {
  const newContact = {
    id: Date.now(),
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    color: getNextColor(),
    initials: contactData.name.split(' ').map(part => part.charAt(0).toUpperCase()).join(''),
  };
  contacts.push(newContact);
  saveData();
  storeFirstAndLastNames();
  return newContact;
}

/**
 * Updates the UI after adding a new contact.
 * 
 * @param {Object} newContact - The newly added contact.
 */
function updateUI(newContact) {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  renderContacts();
  loadData();
  const lastIndex = contacts.length - 1;
  highlightContact(lastIndex);
  displayContactInfo(lastIndex);
}

/**
 * Returns the next available color for a contact.
 * 
 * @returns {string} The next available color.
 */
function getNextColor() {
  const usedColors = contacts.map(contact => contact.color);
  let availableColors = colors.filter(color => !usedColors.includes(color));
  if (availableColors.length === 0) {
    colorIndex = (colorIndex + 1) % colors.length;
    return colors[colorIndex];
  }
  const nextColor = availableColors[0];
  return nextColor;
}

/**
 * Displays the contact information for the selected contact.
 * 
 * @param {number} index - The index of the contact to display.
 */
function displayContactInfo(index) {
  let contactinfo = document.querySelector('.rightInfoBox');
  contactinfo.style.display = 'block';
  const contact = contacts[index];
  let nameParts = contact.name.split(' ');
  let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  const contactInfoDiv = document.querySelector('.contacts-info-box');
  contactInfoDiv.innerHTML = "";
  contactInfoDiv.innerHTML = generateContactInfo(contact, initials, index);
  document.getElementById('button-edit-dialog').innerHTML = generateDeleteButtonDialog(index);
  highlightContact(index);
}

/**
 * Deletes a contact from the list.
 * 
 * @param {number} index - The index of the contact to delete.
 */
function deleteContact(index) {
  if (index < 0 || index >= contacts.length) return; 
  contacts.splice(index, 1);
  fetch(BASE_TASKS_URL + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contacts)
  })
  .then(response => response.json())
  .then(data => {
    contactWasDeleted();
    document.querySelector('.contacts-info-box').innerHTML = '';
  })
  .catch(error => {
    console.error('Fehler beim Löschen des Kontakts:', error);
  });
  if(window.innerWidth < 600){
    setTimeout(() => {
      hideContactInfo();
    }, 1000);
  }
}

/**
 * Handles actions after a contact has been successfully deleted.
 */
function contactWasDeleted(){
  openDialogContact("Contact was successfully deleted");
  renderContacts(); 
  storeFirstAndLastNames();
  loadData();
}

/**
 * Saves the contact data to the server.
 */
function saveData() {
  fetch(BASE_TASKS_URL + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contacts)
  })
  .then(response => response.json())
  .catch(error => {
    console.error('Fehler beim Speichern der Daten:', error);
  });
}

/**
 * Loads the contact data from the server and updates the UI.
 */
function loadData() {
  fetch(BASE_TASKS_URL + '.json')
    .then(response => response.json())
    .then(data => {
      if (data) {
        contacts = Object.values(data);
        initials = contacts.map(contact => contact.initials);
        storeFirstAndLastNames();
        renderContacts(); 
      } 
    })
    .catch(error => {
      console.error('Fehler beim Laden der Daten:', error);
    });
}

/**
 * Edits an existing contact.
 * 
 * This function updates the contact information based on the input fields and saves the changes.
 */
function editContact() {
  const index = document.getElementById('inputEditName').dataset.index;
  const updatedContact = getDataContactEdit(index);
  contacts[index] = updatedContact;
  fetch(BASE_TASKS_URL + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contacts)
  })
  .then(response => response.json())
  .then(data => {
    contactWasEdited(index);
  })
  .catch(error => {
    console.error('Fehler beim Speichern der Daten:', error);
  });
}

/**
 * Retrieves the edited contact data from the input fields.
 * 
 * @param {number} index - The index of the contact being edited.
 * @returns {Object} The updated contact data.
 */
function getDataContactEdit(index){
  const updatedName = document.getElementById('inputEditName').value;
  const updatedEmail = document.getElementById('inputEditEmail').value;
  const updatedPhone = document.getElementById('inputEditPhone').value;
  const updatedContact = {
      ...contacts[index],
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone
  };
  return updatedContact;
}

/**
 * Handles actions after a contact has been successfully edited.
 * 
 * @param {number} index - The index of the contact that was edited.
 */
function contactWasEdited(index){
  loadData(); 
  closeDialogEdit();
  openDialogContact("Contact info has been updated");
  displayContactInfo(index);
  highlightContact(index);
}

/**
 * Stores the contacts' data in localStorage.
 */
function storeFirstAndLastNames() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

/**
 * Truncates a given text to a maximum length.
 * 
 * @param {string} text - The text to truncate.
 * @param {number} [maxLength=16] - The maximum length of the truncated text.
 * @returns {string} The truncated text.
 */
function truncate(text, maxLength = 16) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

/**
 * Highlights the selected contact in the UI.
 * 
 * @param {number} index - The index of the contact to highlight.
 */
function highlightContact(index) {
  const contacts = document.getElementsByClassName('contacts');
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].style.backgroundColor = '';
    contacts[i].style.color = 'black';
  }
  const contactElement = document.getElementById(`contact${index}`);
  if (contactElement) {
    contactElement.style.backgroundColor = 'var(--gray)';
    contactElement.style.color = 'white';
  }
  highlightedContactIndex = index;
}

/**
 * Hides the contact information panel in the UI.
 */
function hideContactInfo(){
  let contactInfoContainer = document.querySelector('.rightInfoBox');
  contactInfoContainer.style.display = "none";
  highlightedContactIndex = -1;
  renderContacts();
}

/**
 * Event listener that loads the contact data when the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  loadData(); 
});
