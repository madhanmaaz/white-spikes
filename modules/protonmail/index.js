const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Protonmail extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "login") {
                let username = "#username"
                let password = "#password"

                await page.waitForSelector(username)
                await page.waitForSelector(password)

                let clearInputs = ["#username", "#password"]

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
                        page.click(`[type="submit"]`),
                        new Promise(re => setTimeout(re, 4000))
                    ])
                } catch (error) { }

                let html = await page.content()
                if (html.includes("human")) {
                    await new Promise(re => setTimeout(re, 8000))
                }
            } else if (spikeType == "otp_code") {
                let otpCode = body.otp_code

                await page.evaluate(() => {
                    let allInputs = document.querySelectorAll(`[type="tel"]`)

                    allInputs.forEach((v, i) => {
                        v.setAttribute("spike-otp-box", i)
                    })
                })

                for (let i = 0; i < 6; i++) {
                    await page.waitForSelector(`[spike-otp-box="${i}"]`)
                    await page.type(`[spike-otp-box="${i}"]`, otpCode[i])
                }

                try {
                    await Promise.all([
                        page.click(`[type="submit"]`),
                        new Promise(re => setTimeout(re, 4000))
                    ])
                } catch (error) { }

                let html = await page.content()
                if (html.includes("human")) {
                    await new Promise(re => setTimeout(re, 8000))
                }
            } else {
                return await this.openTAB(true)
            }


            const html = await page.content()
            let response = this.alterHTML(html, true, 4000)
            return response

        } catch (error) {
            console.log(error, "\n::- resetting the page to index")
            return await this.openTAB(true, 4000)
        }
    }
}

async function init(reqType, config) {
    const appBrowser = new Protonmail(config)
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