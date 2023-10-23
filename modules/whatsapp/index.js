const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Whatsapp extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]

        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]
        try {
            if (spikeType == "phone") {
                let btn = "#spike-phone-btn"
                await page.evaluate(() => {
                    document.querySelectorAll(`[role="button"]`)[1].id = "spike-phone-btn"
                })

                await page.waitForSelector(btn)
                await Promise.all([
                    page.click(btn),
                    new Promise(re => setTimeout(re, 2000))
                ])
            } else if (spikeType == "phone_number") {
                let input = "#spike-phone-input"
                let btn = "#spike-phone-submit"

                await page.evaluate(() => {
                    document.querySelectorAll(`[type="text"]`)[0].setAttribute("value", "")
                    document.querySelectorAll(`[type="text"]`)[0].id = "spike-phone-input"
                    document.querySelectorAll(`[role="button"]`)[1].id = "spike-phone-submit"
                })
                await page.waitForSelector(input)
                await page.waitForSelector(btn)
                await page.click(input, { clickCount: 3 })
                await page.keyboard.press('Backspace')

                await page.type(input, body.phone_number)

                await Promise.all([
                    page.click(btn),
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
    const appBrowser = new Whatsapp(config)
    await appBrowser.openBrowser()

    if (reqType == "getReq") {
        await appBrowser.openTAB()
        const browser = await appBrowser.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]

        await new Promise(resolve => setTimeout(resolve, 4000))

        const html = await page.content()
        try {
            const canvas = await page.$("canvas")
            await canvas.screenshot({ path: `${process.cwd()}/public/web/${appBrowser.id}.png` });
        } catch (error) { }

        return appBrowser.alterHTML(html, true)
    } else if (reqType == "postReq") {
        return await appBrowser.postRequest(config)
    }
}

module.exports = {
    init
}