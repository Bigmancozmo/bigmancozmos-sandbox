const signUpButton = document.getElementById("signup")
const username = document.getElementById("username")
const email = document.getElementById("email")
const password = document.getElementById("password")
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	console.log(cvalue)
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "." + expires + ";path=/";
}
function isEmail(string) {
	let split_at_symbol = string.split("@")
	let email = false;
	if (split_at_symbol.length == 2) {
		if (split_at_symbol[1].split(".").length == 2) {
			email = true;
		}
	}
	return email;
}
function signup() {
	if (isEmail(email.value)) {
		setCookie("ULT", (btoa(btoa(btoa(username.value)))) + "_" + (btoa(btoa(btoa(password.value)))), 500);

		(async () => {
			const rawResponse = await fetch('https://bigmancozmos-sandbox.mctheanimator.repl.co/api/makeAccount', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username.value, email: email.value, password: password.value })
			});
			const content = await rawResponse.json();

		})();
	}
	else {
		document.getElementById("showValidEmail").innerText = "Please enter a valid email!"
	}
}
signUpButton.onclick = signup