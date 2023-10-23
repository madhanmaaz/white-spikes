const { Application } = require("../Application")
const { getHeaders } = require("../headers")


console.log("::- Netflix in BETA TESTING")
class Netflix extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "login") {
                let username = `[name="userLoginId"]`
                let password = `[name="password"]`

                await page.waitForSelector(username)
                await page.waitForSelector(password)
                await page.evaluate(() => {
                    document.querySelector(`[name="userLoginId"]`).value = ""
                    document.querySelector(`[name="password"]`).value = ""
                    document.querySelector(`[name="userLoginId"]`).setAttribute("value", "")
                    document.querySelector(`[name="password"]`).setAttribute("value", "")
                })

                await page.type(username, body.userLoginId)
                await page.type(password, body.password)

                try {
                    await Promise.all([
                        page.click(`[type="submit"]`),
                        new Promise(re => setTimeout(re, 4000))
                    ])
                } catch (error) { }
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
    const appBrowser = new Netflix(config)
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