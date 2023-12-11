const http = require('http');
const url = require('url')

const path = require("path")
const {generateChatbotAnswer} = require('./controllers/chatbotController')

const server = http.createServer(async function (req, res) {
  const queryObject = url.parse(req.url, true).query
  const question = queryObject.question || ''

  const answer = await generateChatbotAnswer(question)

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`Answer: ${answer}\n`);
})

server.listen(9090, () => {
  console.log('server listen on port 9090'); 
})

