const express = require('express')
const { exec } = require('child_process')

const COMMAND = 'open /Applications/Dictionary.app'

const app = express()

app.options('/', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://attacker.com:9999')
  res.set('Access-Control-Allow-Methods', 'PUT')
  res.send('ok')
})

app.get('/', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  exec(COMMAND, err => {
    if (err) res.status(500).send(err.stack)
    else res.status(200).send('Success')
  })
})

app.listen(8080, '127.0.0.1')