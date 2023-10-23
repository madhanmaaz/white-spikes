/**
 * 
 * @Author      : Madhan (Madhanmaaz) - madhan hacker
 * github       : https://github.com/madhanmaaz
 * website      : http://madhanmaaz.netlify.app/
 * Description  : Worlds No.1 Phishing Tool.
 * 
 */

// check apps
const fs = require("fs")

let modules = []
let allModules = fs.readdirSync(`${process.cwd()}/modules`)
allModules.forEach(i => {
    if (fs.statSync(`${process.cwd()}/modules/${i}`).isDirectory()) {
        modules.push(i)
    }
})


module.exports = {
    getApps: function () {
        return modules
    },
    checkApp: function (appName) {
        return modules.includes(appName)
    }
}