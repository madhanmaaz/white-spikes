const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Wordpress extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "email") {
                let usernameOrEmail = "#usernameOrEmail"
                await page.waitForSelector(usernameOrEmail)

                let clearInputs = ["#usernameOrEmail"]

                for (let i = 0; i < clearInputs.length; i++) {
                    await page.focus(clearInputs[i]); // Focus on the input element

                    // Use keyboard shortcuts to clear the input field
                    await page.keyboard.down('Control')
                    await page.keyboard.press('A')
                    await page.keyboard.up('Control')
                    await page.keyboard.press('Backspace')
                }

                await page.type(usernameOrEmail, body.usernameOrEmail)
                try {
                    await Promise.all([
                        page.click(`[type="submit"]`),
                        new Promise(re => setTimeout(re, 4000))
                    ])
                } catch (error) { }
            } else if (spikeType == "password") {
                let password = "#password"
                await page.waitForSelector(password)

                let clearInputs = ["#password"]

                for (let i = 0; i < clearInputs.length; i++) {
                    await page.focus(clearInputs[i]); // Focus on the input element

                    // Use keyboard shortcuts to clear the input field
                    await page.keyboard.down('Control')
                    await page.keyboard.press('A')
                    await page.keyboard.up('Control')
                    await page.keyboard.press('Backspace')
                }

                await page.type(password, body.password)
                try {
                    await Promise.all([
                        page.click(`[type="submit"]`),
                        new Promise(re => setTimeout(re, 4000))
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
    const appBrowser = new Wordpress(config)
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