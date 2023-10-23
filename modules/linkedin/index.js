const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Linkedin extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "login") {
                let username = `[name="session_key"]`
                let password = `[name="session_password"]`

                await page.waitForSelector(username)
                await page.waitForSelector(password)
                await page.evaluate(() => {
                    document.querySelector(`[name="session_key"]`).value = ""
                    document.querySelector(`[name="session_key"]`).setAttribute("value", "")
                    document.querySelector(`[name="session_password"]`).setAttribute("value", "")
                    document.querySelector(`[name="session_password"]`).value = ""
                })

                await page.type(username, body.session_key)
                await page.type(password, body.session_password)

                try {
                    await Promise.all([
                        page.click(`[type="submit"]`),
                        new Promise(re => setTimeout(re, 4000))
                    ])
                } catch (error) { }
            } else if (spikeType == "otp_code") {
                let otpInput = "#input__phone_verification_pin"
                let otpBtn = "#two-step-submit-button"

                await page.waitForSelector(otpInput)
                await page.waitForSelector(otpBtn)
                await page.type(otpInput, body.pin)

                try {
                    await Promise.all([
                        page.click(otpBtn),
                        new Promise(re => setTimeout(re, 4000))
                    ])
                } catch (error) { }
            } else if (spikeType == "resend_otp") {
                let btn = "#btn-resend-pin-sms"
                await page.waitForSelector(btn)

                try {
                    await Promise.all([
                        page.click(btn),
                        new Promise(re => setTimeout(re, 4000))
                    ])
                } catch (error) { }
            } else {
                return await this.openTAB(true, 2000)
            }

            const html = await page.content()
            let response = this.alterHTML(html, true)
            return response
        } catch (error) {
            console.log(error, "\n::- resetting the page to index")
            return await this.openTAB(true, 2000)
        }
    }
}

async function init(reqType, config) {
    const appBrowser = new Linkedin(config)
    await appBrowser.openBrowser()

    if (reqType == "getReq") {
        return await appBrowser.openTAB(true, 2000)
    } else if (reqType == "postReq") {
        return await appBrowser.postRequest(config)
    }
}

module.exports = {
    init
}