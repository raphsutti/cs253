const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <body>
        <h3>Welcome to attacker.com!</h3>
        <button>Send a PUT to http://attacker.com:8080</button>
        <script>
          document.querySelector('button).addEventListener(('click') => {
            fetch('http://localhost:8080')
              .then(res => res.text())
              .then(text => document.body.innerHTML += '<br>' + text)
              .catch(err => document.body.innerHTML += '<br>' + err)
          })
            .catch(err => document.body.innerHTML += '<br>' + err)
        </script>
      </body>
    </html>
  `)
})

app.listen(9999, '127.0.0.1')