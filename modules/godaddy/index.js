const { Application } = require("../Application")
const { getHeaders } = require("../headers")

console.log("::- GODADDY BETA TESTING --")

class Godaddy extends Application {
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
                let subBtn = "#submitBtn"

                await page.waitForSelector(username)
                await page.waitForSelector(password)
                await page.waitForSelector(subBtn)

                await page.type(username, body.username)
                await page.type(password, body.password)

                await Promise.all([
                    page.click(subBtn)
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
    const appBrowser = new Godaddy(config)
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