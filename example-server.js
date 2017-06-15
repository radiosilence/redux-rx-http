const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.get('*', (req, res) => {
  res.send('ok')
})

app.post('*', (req, res) => {
  res.send(req.body)
})

app.listen(3030)
