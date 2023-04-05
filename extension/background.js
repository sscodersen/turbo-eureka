// Connect to the SSE endpoint
const source = new EventSource("http://localhost:3000/sse");

// Listen for incoming messages
source.addEventListener("message", (event) => {
  // Parse the message data as JSON
  const message = JSON.parse(event.data);
  // Send a message to the content script with the server's response
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "CHATGPT_REPLY",
      reply: message.reply,
    });
  });
});

