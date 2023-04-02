// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ASK_CHATGPT") {
      // Get the current text input or textarea element
      const activeElement = document.activeElement;
      if (
        !activeElement ||
        !(activeElement.isContentEditable ||
          activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
          activeElement.nodeName.toUpperCase() === "INPUT")
      ) {
        alert(
          "No text input found. Select this option after clicking inside a textarea that contains text or on a text input with text."
        );
        return;
      }
  
      // Get the text to send to ChatGPT
      const text = activeElement.value.trim();
      if (!text) {
        alert(
          "No text found. Select this option after typing some text in the input."
        );
        return;
      }
  
      // Show a loading cursor while the request is sent
      showLoadingCursor();
  
      // Send the text to the API endpoint
      fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          // Insert the reply after the current text input or textarea
          const reply = `\n\nChatGPT says: ${data.reply}`;
          if (activeElement.isContentEditable) {
            const replyNode = document.createTextNode(reply);
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.collapse(false);
            range.insertNode(replyNode);
            selection.collapseToEnd();
          } else {
            activeElement.value += reply;
          }
  
          // Restore the cursor
          restoreCursor();
        })
        .catch((error) => {
          restoreCursor();
          alert(
            "Error. Make sure you're running the server by following the instructions on https://github.com/gragland/chatgpt-chrome-extension. Also make sure you don't have an adblocker preventing requests to localhost:3000."
          );
          throw new Error(error);
        });
    }
  });
  
  const showLoadingCursor = () => {
    const style = document.createElement("style");
    style.id = "cursor_wait";
    style.innerHTML = `* {cursor: wait;}`;
    document.head.insertBefore(style, null);
  };
  
  const restoreCursor = () => {
    document.getElementById("cursor_wait").remove();
  };