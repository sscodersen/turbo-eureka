const express = require('express');
const sseExpress = require('sse-express');
const app = express();
const port = process.env.PORT || 3000;
const ChatGPT = require('./chatgpt');

app.use(express.json());

app.get('/sse', sseExpress, async (req, res) => {
  const message = req.query.message;
  const chatGPT = new ChatGPT(process.env.CHATGPT_API_KEY);
  const response = await chatGPT.send(message);
  res.sse(response);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
