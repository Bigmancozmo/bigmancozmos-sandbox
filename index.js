// Libraries //
const express = require('express');
const fs = require('fs');
const path = require('path');
const database = require("./database.js")
const bodyParser = require('body-parser')

// Random Variables //
const jsonParser = bodyParser.json();

// App //
const app = express();

// Pages //
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/home', (req, res) => {
	res.sendFile(path.join(__dirname, '/pages/home/home.html'));
});
app.get('/signup', (req, res) => {
	database.getSession();
	res.sendFile(path.join(__dirname, '/pages/login/signup.html'));
});
app.get('/login', (req, res) => {
	database.getSession();
	res.sendFile(path.join(__dirname, '/pages/login/login.html'));
});
async function blobToImage(blob, fileName) {
	const buffer = Buffer.from(await blob.arrayBuffer());
	var file = buffer.toString("base64");
	return /*"data:image/png;base64," + */file;
}
app.get('/getImage', async (req, res) => {
	let id = req.query.id
	let type = req.query.type
	let img1 = await database.getImage("toolbox", `images/${type}/${id}/img.png`)
	img1 = await blobToImage(img1, "img.png")
	var img = Buffer.from(img1, 'base64');
	res.writeHead(200, {
		'Content-Type': 'image/png',
		'Content-Length': img.length
	});
	res.end(img);
})

// Database Pages //
app.get(process.env['db_url'] + 'getIDFromName', async (req, res) => {
	const id = await database.getUserIDFromName(req.query.username)
	res.json({ id });
});
app.get('/verifyAccount', (req, res) => {
	database.getSession();
	res.sendFile(path.join(__dirname, '/verifyAccount.html'));
});
app.get(process.env['db_url'] + 'makeAccount', (req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	let signedUp = database.signUp(email, password, username);
	if (!signedUp) {
		console.log("Not signed up")
		res.sendFile(path.join(__dirname, '/pages/login/accountTaken.html'));
	}
	res.sendFile(path.join(__dirname, '/index.html'));
});
app.post(process.env['db_url'] + 'getUser', jsonParser, async (req, res) => {
	const id = req.body.id;
	const json = await database.getUserData(id);
	res.json(json);
});
app.post(process.env['db_url'] + 'tryLogin', jsonParser, async (req, res) => {
	if (req.body.name == null) {
		console.log("no name")
		return;
	}
	if (req.body.pass == null) {
		console.log("no pass")
		return;
	}
	res.send({
		"doLogIn": (((await database.signInWithUsername(req.body.name, req.body.pass))["user"]) != null),
	})
});
app.get("/apidocs", (req, res) => {
	res.sendFile(path.join(__dirname, '/pages/docs/api/apiDocs.html'))
});

// JS/CSS //
async function loadScriptsInFolder(folder) {
	const files = fs.readdirSync(__dirname + folder);
	files.forEach(file => {
		if ((file.split(".")[1] == "css") || (file.split(".")[1] == "js") || (file.split(".")[1] == "ttf" || (file.split(".")[1] == "otf"))) {
			console.log("Loading " + folder + "/" + file)
			app.get(folder + "/" + file, (req, res) => {
				res.sendFile(path.join(__dirname, folder + "/" + file));
			});
		}
	});
}
async function loadAllScripts() {
	const files = fs.readdirSync(__dirname + "/pages");
	files.forEach(file => {
		if (file.split(".").length == 1) {
			loadScriptsInFolder("/pages/" + file)
		}
	});
}
loadAllScripts();

// Startup //
function startup() {
	console.log("App started on port 3000");
}
app.listen(3000, () => startup);