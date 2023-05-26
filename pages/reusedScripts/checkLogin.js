function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

if (getCookie("ULT") == "") {
	if(window.location.href != "https://bigmancozmos-sandbox.mctheanimator.repl.co/signup"){
		window.location.href = "https://bigmancozmos-sandbox.mctheanimator.repl.co/login";
	}
}
else {
	const accountLogin = getCookie("ULT").split("_");
	const username = atob(atob(atob(accountLogin[0])));
	const password = atob(atob(atob(accountLogin[1])));

	(async () => {
		const rawResponse = await fetch('https://bigmancozmos-sandbox.mctheanimator.repl.co/api/tryLogin', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: username, pass: password })
		});
		const content = await rawResponse.json();
		if(!content.doLogIn){
			setCookie("ULT", "", 99999)
		} else {
			if(window.location.href == "https://bigmancozmos-sandbox.mctheanimator.repl.co/signup"){
				window.location.href = "https://bigmancozmos-sandbox.mctheanimator.repl.co/home"
			}
		}
	})();
}
