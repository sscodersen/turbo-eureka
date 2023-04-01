const eventSource = new EventSource("http://localhost:3000/stream");
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "UPDATE") {
    const activeElement = getActiveElement();
    if (activeElement) {
      if (
        activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        activeElement.nodeName.toUpperCase() === "INPUT"
      ) {
        // Insert after selection
        activeElement.value =
          activeElement.value.slice(0, activeElement.selectionEnd) +
          `\n\n${data.reply}` +
          activeElement.value.slice(
            activeElement.selectionEnd,
            activeElement.length
          );
      } else {
        // Special handling for contenteditable
        const replyNode = document.createTextNode(`\n\n${data.reply}`);
        const selection = window.getSelection();

        if (selection.rangeCount === 0) {
          selection.addRange(document.createRange());
          selection.getRangeAt(0).collapse(activeElement, 1);
        }

        const range = selection.getRangeAt(0);
        range.collapse(false);

        // Insert reply
        range.insertNode(replyNode);

        // Move the cursor to the end
        selection.collapse(replyNode, replyNode.length);
      }
    } else {
      // Alert reply since no active text area
      alert(`ChatGPT says: ${data.reply}`);
    }
  }
  };