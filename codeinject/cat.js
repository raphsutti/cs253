const childProcess = require('child_process')

const filename = process.argv[2]
const stdout = childProcess.execSync(`cat ${filename}`)
console.log(stdout.toString())