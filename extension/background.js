// Create a context menu item
chrome.contextMenus.create({
  id: "ask-chatgpt",
  title: "Ask ChatGPT",
  contexts: ["selection"],
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ask-chatgpt") {
    // Send a message to the content script with the selected text
    chrome.tabs.sendMessage(tab.id, { type: "ASK_CHATGPT", text: info.selectionText });
  }
});
