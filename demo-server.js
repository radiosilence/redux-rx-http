const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

app.use(bodyParser.json())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send({ status: 'ok' })
})

app.post('/', (req, res) => {
  res.send(req.body)
})

app.listen(3030)
