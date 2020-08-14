const childProcess = require('child_process')
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send(`
  <h1>File viewer</h1>
  <form method='GET' action='/view'>
    <input name='filename' />
    <input type='submit' value='Submit' />
  </form>
  `)
})

app.get('/view', (req, res) => {
  const { filename } = req.query
  const stdout = childProcess.execSync(`cat ${filename}`)
  res.send(stdout.toString())
})

app.listen(4000, '127.0.0.1')