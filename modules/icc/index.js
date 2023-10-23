const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Icc extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "login") {
                let username = "#username"
                let password = "#password"
                let submitAction = "#submitAction"

                await page.waitForSelector(username)
                await page.waitForSelector(password)
                await page.waitForSelector(submitAction)

                await page.evaluate(() => {
                    document.querySelector("#username").value = ""
                    document.querySelector("#password").value = ""
                })

                await page.type(username, body.username)
                await page.type(password, body.password)

                await Promise.all([
                    page.click(submitAction),
                    page.waitForNavigation({ waitUntil: "load" })
                ])
            } else {
                return await this.openTAB(true)
            }


            const html = await page.content()
            let response = this.alterHTML(html, true)
            return response

        } catch (error) {
            console.log(error, "\n::- resetting the page to index")
            return await this.openTAB(true)
        }
    }
}

async function init(reqType, config) {
    const appBrowser = new Icc(config)
    await appBrowser.openBrowser()

    if (reqType == "getReq") {
        return await appBrowser.openTAB(true)
    } else if (reqType == "postReq") {
        return await appBrowser.postRequest(config)
    }
}

module.exports = {
    init
}