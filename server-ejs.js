// xss inject into html template
const express = require('express')
const ejs = require('ejs')

const app = express()

app.get('/', (req, res) => {
    const name = req.query.name || "You unnamed person"
    const template =`
    <h1> Hi, <%= name %>.</h1>
    `
    const html = ejs.render(template, { name: name })

    res.send(html)

})
app.listen(4000)