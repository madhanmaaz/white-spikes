const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Instagram extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "login") {
                let username = '[name="username"]'
                let password = '[name="password"]'
                await page.waitForSelector(username)
                await page.waitForSelector(password)

                let clearInputs = [username, password]

                for (let i = 0; i < clearInputs.length; i++) {
                    await page.focus(clearInputs[i]); // Focus on the input element

                    // Use keyboard shortcuts to clear the input field
                    await page.keyboard.down('Control')
                    await page.keyboard.press('A')
                    await page.keyboard.up('Control')
                    await page.keyboard.press('Backspace')
                }

                await page.type(username, body.username)
                await page.type(password, body.password)

                try {
                    await Promise.all([
                        page.click('[type="submit"]'),
                        new Promise(re => setTimeout(re, 6000))
                    ])
                } catch (error) { }

            } else if (spikeType == "otp_code") {
                let otp_code = `[name="verificationCode"]`
                await page.waitForSelector(otp_code)
                await page.evaluate(() => {
                    document.querySelector(`[name="verificationCode"]`).value = ""
                    document.querySelector(`[name="verificationCode"]`).setAttribute("value", "")
                })

                await page.type(otp_code, body.verificationCode)

                try {
                    await Promise.all([
                        page.click('[type="button"]'),
                        new Promise(re => setTimeout(re, 4000))
                    ])
                } catch (error) { }

            } else if (spikeType == "resend_otp") {
                await page.evaluate(() => {
                    let resend_otpBtn = document.querySelectorAll("button")[1]
                    resend_otpBtn.id = "resend_otp_btn"
                })

                await page.waitForSelector("#resend_otp_btn")
                await Promise.all([
                    page.click("#resend_otp_btn"),
                    new Promise(re => setTimeout(re, 4000))
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
    const appBrowser = new Instagram(config)
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