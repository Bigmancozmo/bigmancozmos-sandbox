// Get User Info //
const accountLogin = getCookie("ULT").split("_");
let username
let password
try {
	username = atob(atob(atob(accountLogin[0])))
	password = atob(atob(atob(accountLogin[1])))
}
catch {
	setCookie("ULT", "", 9999)
	window.location.href = "https://bigmancozmos-sandbox.mctheanimator.repl.co/login";
}
document.getElementById("username").innerText = username

// Log Out Button //
let logout_btn = document.getElementById("logout_btn")
logout_btn.onclick = function() {
	setCookie("ULT", "", 9999);
	window.location.href = "https://bigmancozmos-sandbox.mctheanimator.repl.co/login";
}

// Hamburger Menu //
const hamburgerLineContainer = document.getElementById("hamburger-lines")
const hamburgerLines = hamburgerLineContainer.getElementsByTagName("div");
let open = false
hamburgerLineContainer.onclick = function() {
	if (open) {
		hamburgerLineContainer.className = "hamburger-lines hamburger-lines-closed"
	} else {
		hamburgerLineContainer.className = "hamburger-lines hamburger-lines-open"
	}
	for (i = 0; i < hamburgerLines.length; i++) {
		let line = hamburgerLines[i]
		let isGap = (line.className == "hamburger-line-gap") || (line.className == "hamburger-line-gap hamburger-line-gap-closed") || (line.className == "hamburger-line-gap hamburger-line-gap-open")
		if (isGap) {
			if (open) {
				line.className = "hamburger-line-gap hamburger-line-gap-closed"
			} else {
				line.className = "hamburger-line-gap hamburger-line-gap-open"
			}
		} else {
			if (open) {
				line.className = "hamburger-line hamburger-line-closed"
			} else {
				line.className = "hamburger-line hamburger-line-open"
			}
		}
	}
	open = !open
}