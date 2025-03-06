chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('keybinds', (data) => {
    if (!data.keybinds) {
      chrome.storage.local.set({ keybinds: {} });
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.altKey) {
    const keyPressed = event.key.toLowerCase(); // Get the key pressed (e.g., 'z', 'x', 'a')
    chrome.storage.local.get('keybinds', (data) => {
      const keybinds = data.keybinds || {};
      const url = keybinds[keyPressed];

      if (url) {
        // Open the URL in a new tab (background tab)
        chrome.tabs.create({ url: url }); // active: false keeps the tab in the background
      }
    });
  }
});

