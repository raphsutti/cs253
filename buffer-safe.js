const express = require('express')

const app = express()

// Visit /api/convert?data={"str": "hello", "type": "hex"}

app.get('/api/convert', (req, res) => {
  const data = JSON.parse(req.query.data)
  if (!data.str) {
    throw new Error('missing data.str')
  }
  if (data.type !== 'hex' && data.type !== 'base64' && data.type !== 'utf8') {
    throw new Error('data.type is invalid')
  }

  res.send(convert(data.str, data.type))
})

function convert (str, type) {
  // if (typeof str !== 'string') {
  //   str = String(str)
  // }
  return new Buffer(str).toString(type)
}

app.listen(4000, '127.0.0.1')