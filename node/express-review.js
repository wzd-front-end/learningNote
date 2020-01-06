const express = require('express')

const app = express()
const server = require('http').createServer(app)

app.get('/', (req, res) => {
  res.send('Hello World')
})

server.listen(3000, () => console.log('Example app listening on port 3000!'))
