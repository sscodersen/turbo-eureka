// Create a context menu item
chrome.contextMenus.create({
  id: "ask-chatgpt",
  title: "Ask ChatGPT",
  contexts: ["all"],
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ask-chatgpt") {
    // Open an EventSource connection to the API endpoint
    const eventSource = new EventSource("http://localhost:3000/sse");

    // Listen for SSE "message" events
    eventSource.addEventListener("message", async (event) => {
      // Parse the data from the event
      const data = JSON.parse(event.data);

      // Check if the message type is "reply"
      if (data.type === "reply") {
        // Send a message to the content script with the reply
        chrome.tabs.sendMessage(tab.id, {
          type: "RECEIVE_CHATGPT_REPLY",
          reply: data.reply,
        });

        // Close the SSE connection
        eventSource.close();
      }
    });

    // Listen for SSE "error" events
    eventSource.addEventListener("error", (event) => {
      // Log the error
      console.error("SSE error:", event);

      // Close the SSE connection
      eventSource.close();
    });

    // Send a message to the API endpoint with the user input
    eventSource.send(JSON.stringify({ message: info.selectionText }));
  }
});

