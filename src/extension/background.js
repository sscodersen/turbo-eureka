// Create a context menu item
chrome.contextMenus.create({
  id: "ask-chatgpt",
  title: "Ask ChatGPT",
  contexts: ["all"],
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ask-chatgpt") {
    // Create a new chat conversation
    const chatChannel = new BroadcastChannel("chat_channel");
    chatChannel.postMessage({ type: "NEW_CONVERSATION" });

    // Send a message to the content script with the conversation ID
    chrome.tabs.sendMessage(tab.id, { type: "ASK_CHATGPT", conversationId: chatChannel.name });

    // Listen for new messages from the chat conversation
    const eventSource = new EventSource(`https://api.openai.com/v1/conversations/${chatChannel.name}/messages/stream`);
    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "message") {
        // Send the message to the content script
        chrome.tabs.sendMessage(tab.id, { type: "CHATGPT_MESSAGE", message: message.data[0].text });
      }
    };
  }
});
