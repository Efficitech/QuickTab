document.addEventListener('keydown', (event) => {
  if (event.altKey) {
    const pressedKey = String.fromCharCode(event.keyCode).toLowerCase();

    // Retrieve the keybinds from storage and navigate to the URL if it exists
    chrome.storage.local.get('keybinds', (data) => {
      const keybinds = data.keybinds || {}; // Default to empty object if no keybinds are saved
      const url = keybinds[pressedKey];

      if (url) {
        console.log(`Navigating to ${url} for Alt + ${pressedKey}`);
        window.open(url, "_blank")
      }
    });
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'navigate' && message.url) {
    // Redirect the current page to the URL specified in the keybind
	 window.open(message.url, "_blank")
  }
});
