require('./db')
const express = require('express')
const sharks = require('./routes/sharks')

const app = express()
const router = express.Router()

const path = __dirname + '/views/'
const port = process.env.PORT || 8080

app.engine('html', require('ejs').renderFile)

app.set('view engine', 'html')

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path))

app.use('/sharks', sharks)

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
