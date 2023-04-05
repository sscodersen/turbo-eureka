app.get("/sse", (req, res) => {
  const clientId = uuidv4(); // Generate a unique client ID for this connection

  // Send an initial "ping" message to ensure the connection is open
  res.write(": ping\n\n");

  // Listen for a "close" event to clean up the connection
  req.on("close", () => {
    console.log(`Connection closed for client ${clientId}`);
    // Clean up any resources associated with this client ID
  });

  // Set up the SSE stream
  const sendSseEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send a welcome message
  sendSseEvent("message", { text: "Welcome to the SSE stream!" });

  // Example of sending a periodic message
  const intervalId = setInterval(() => {
    sendSseEvent("message", { text: "Periodic message" });
  }, 10000);

  // Store any resources associated with this client ID
  // For example, you could store the interval ID so you can clear it later

  console.log(`New SSE connection for client ${clientId}`);
});
