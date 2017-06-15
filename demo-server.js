const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/', (req, res) => {
  res.send({ status: 'ok' })
})

app.post('/', (req, res) => {
  console.log('req.body', req.body)
  res.send(req.body)
})

app.listen(3030)
