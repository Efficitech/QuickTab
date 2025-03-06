const keybindsContainer = document.getElementById('keybinds-container');
const addKeybindButton = document.getElementById('addKeybind');

const availableKeys = 'abcdefghijklmnopqrstuvwxyz';  // Only alphabet keys

// Function to create a new row for keybind input
const createKeybindRow = (key = '', url = '') => {
  const row = document.createElement('div');
  row.classList.add('keybind-row');

  // Dropdown for selecting the key (only alphabet keys)
  const dropdown = document.createElement('select');
  availableKeys.split('').forEach((keyOption) => {
    const option = document.createElement('option');
    option.value = keyOption;
    option.textContent = `Alt + ${keyOption.toUpperCase()}`;
    if (keyOption === key) {
      option.selected = true;
    }
    dropdown.appendChild(option);
  });

  // URL input field
  const urlInput = document.createElement('input');
  urlInput.type = 'url';
  urlInput.placeholder = 'Enter URL';
  urlInput.value = url;

  // Add event listener to auto-save changes
  urlInput.addEventListener('input', () => updateKeybind(row, dropdown, urlInput));
  dropdown.addEventListener('change', () => updateKeybind(row, dropdown, urlInput));

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteKeybind(row, key));

  // Add the elements to the row
  row.appendChild(urlInput);
  row.appendChild(dropdown);
  row.appendChild(deleteButton);
  keybindsContainer.appendChild(row);
};

// Function to update the keybinds in storage when a change is made
const updateKeybind = (row, dropdown, urlInput) => {
  const keybinds = {};

  // Collect all keybinds from the rows
  const rows = keybindsContainer.querySelectorAll('.keybind-row');
  rows.forEach((row) => {
    const urlInput = row.querySelector('input');
    const dropdown = row.querySelector('select');
    let url = urlInput.value.trim();
    const key = dropdown.value;

    // Add 'https://' if missing
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (url) {
      keybinds[key] = url;
    }
  });

  // Save the updated keybinds to storage
  chrome.storage.local.set({ keybinds: keybinds });
};

// Load saved keybinds from storage
const loadKeybinds = () => {
  chrome.storage.local.get('keybinds', (data) => {
    const keybinds = data.keybinds || {};
    Object.entries(keybinds).forEach(([key, url]) => {
      createKeybindRow(key, url); // Create a row for each saved keybind
    });
  });
};

// Add a new keybind row when the button is clicked
addKeybindButton.addEventListener('click', () => createKeybindRow());

// Delete the keybind from storage and UI
const deleteKeybind = (row, key) => {
  // Remove keybind from storage
  chrome.storage.local.get('keybinds', (data) => {
    const keybinds = data.keybinds || {};
    delete keybinds[key];

    // Save the updated keybinds to storage
    chrome.storage.local.set({ keybinds: keybinds }, () => {
      // Remove the row from the UI
      keybindsContainer.removeChild(row);
    });
  });
};

// Load keybinds when popup is opened
document.addEventListener('DOMContentLoaded', loadKeybinds);

// Handle keydown event for triggering actions
document.addEventListener('keydown', (event) => {
  if (event.altKey) {
    const pressedKey = event.key.toLowerCase(); // Convert key to lowercase

    // Retrieve the keybinds from storage and navigate to the URL if it exists
    chrome.storage.local.get('keybinds', (data) => {
      const keybinds = data.keybinds || {};
      const url = keybinds[pressedKey];

      if (url) {
        console.log(`Navigating to ${url} for Alt + ${pressedKey}`);
        window.open(url, "_blank");
      }
    });
  }
});
