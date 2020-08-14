// transfer funds function - use with attacker.html
const express = require('express')
const cookieParser = require('cookie-parser')

const { Database } = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')

const BALANCES = {
  alice: 500,
  bob: 100,
  charlie: 1000000
}
const SESSIONS = {} // sessionid -> { username: '', etc}

const db = new Database('db')

db.on('trace', console.log)
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT, balance INT, UNIQUE(username))')
  db.run('INSERT OR IGNORE INTO users VALUES ("alice", "password", 500), ("bob", "hunter2", 100), ("charlie", "&verysecurEpassWorD215$", 1000000)')
  db.run('CREATE TABLE IF NOT EXISTS logs (log TEXT)')
})
process.on('SIGINT', () => {
  db.close(() => process.exit())
})

const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  const username = SESSIONS[req.cookies.sessionId]

  if (username) {
    res.send(`
    <h1>
      Hi <span id='username'>${username}</span>. 
      Your balance is $${BALANCES[username]}.
      </h1>
      <form method='POST' action='/transfer'>
        <input name='amount' placeholder='Send amount' />
        <input name='to' placeholder='To user' />
        <input type='submit' value='Send' />
      </form>
      <a href='/logout'>Logout</a>
    `)
  } else {
    res.send(`
      <h1>
        Login to your bank account:
      </h1>
      <form method='POST' action='/login'>
        <input name='username' placeholder='Username' />
        <input name='password' placeholder='Password' type='password' />
        <input type='submit' value='Login' />
      </form>
    `)
  }
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  // db.exec(`INSERT INTO logs VALUES ("Login attempt from ${username}")`)

  const query = `SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`
  db.get(query, (err, row) => {
    if (err || !row) {
      res.send('fail!')
      return
    }

    const sessionId = randomBytes(16).toString('base64')
    SESSIONS[sessionId] = row.username
    res.cookie('sessionId', sessionId, {
      // secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    res.redirect('/')
  })
})

app.get('/logout', (req, res) => {
  const { sessionId } = req.cookies
  delete SESSIONS[sessionId]
  res.clearCookie('sessionId', {
    // secure: true,
    httpOnly: true,
    sameSite: 'lax'
  })
  res.redirect('/')
})

app.post('/transfer', (req, res) => {
  const sessionId = req.cookies.sessionId
  const username = SESSIONS[sessionId]

  if (!username) {
    res.send('fail!')
    return
  }

  const amount = Number(req.body.amount)
  const to = req.body.to

  BALANCES[username] -= amount
  BALANCES[to] += amount
  res.redirect('/')
})

app.listen(4000)

