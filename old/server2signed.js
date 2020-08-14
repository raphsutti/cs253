// cookie is signed
const express = require('express')
const { createReadStream } = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const USERS = {
  alice: 'password',
  bob: 'hunter2'
}
const BALANCES = {
  alice: 500,
  bob: 100
}

const COOKIE_SECRET = "askldksladklasdSKLDsalkdklsafsklagalkLKSLKCA"

const app = express()
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cookieParser(COOKIE_SECRET))

app.get('/', (req, res) => {
  const username = req.signedCookies.username
  if (username) {
    const balance = BALANCES[username]
    res.send(`Hi ${username}. Your balance is $${balance}`)
  } else {
    createReadStream('index.html').pipe(res)
  }
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = USERS[username]

  if (req.body.password === password) {
    res.cookie('username', username, { signed: true })
    res.send('logged in!')
  } else {
    res.send('failed login')
  }
})

app.get('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/')
})

app.listen(4000)