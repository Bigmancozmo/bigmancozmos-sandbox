const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env['supabase_url'], process.env['supabase_key']);

async function getUserData(userId) {
	let { data: users, error } = await supabase
		.from('users')
		.select('*')
	if (error != null) { console.warn(error); return false; }
	let data = null
	for (let i = 0; i < users.length; i++) {
		if (users[i]["id"] == userId) {
			return users[i];
		}
	}
}

async function getUserDataFromName(username) {
	let { data: users, error } = await supabase
		.from('users')
		.select('*')
	for (let i = 0; i < users.length; i++) {
		console.log(users[i]["user_data"]["username"])
		if (users[i]["user_data"]["username"] == username) {
			return users[i]
		}
	}
}

async function getUserIDFromName(username) {
	let { data: users, error } = await supabase
		.from('users')
		.select('*')
	for (let i = 0; i < users.length; i++) {
		if (users[i]["user_data"]["username"] == username) {
			return users[i]["id"];
		}
	}
}

async function doesAccountExistWithName(name) {
	let { data: users, error } = await supabase
		.from('users')
		.select('*')
	for (let i = 0; i < users.length; i++) {
		if (users[i]["user_data"]["username"] == name) {
			return true;
		}
	}
	return false;
}

async function makeAccountData(username, email) {
	const { data, error } = await supabase
		.from('users')
		.insert([
			{ user_data: JSON.parse(`{"username": "${username}","description": ""}`), email: email },
		])
	console.log(data)
	console.log(error)
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

async function signUp(email, pass, username) {
	let exists = await doesAccountExistWithName(username)
	if (isEmail(email) && (!exists)) {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: pass,
		});
		console.log("Made User")
		makeAccountData(username, email);
		console.log("Added Data")
		console.log("Account Creation Finished!")
		return true;
	}
	return false;
}

async function signIn(email, pass) {
	let { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: pass
	})
	return data;
}

async function signInWithUsername(username, pass) {
	console.log(username)
	console.log(await doesAccountExistWithName(username))
	if(await doesAccountExistWithName(username)){
		let data = await getUserDataFromName(username);
		let email = data["email"];
		let signInStatus = await signIn(email, pass);
		return signInStatus
	}
	return false
}

function getSession() {
	supabase.auth.getSession();
}

function blobToFile(blob) {
	//return createImageBitmap(blob);
}

async function getImage(bucket, directory) {
	const { data, error } = await supabase.storage.from(bucket).download(directory);
	return data;
}

async function resetPassword(email, redirect) {
	await supabase.auth.resetPasswordForEmail('hello@example.com', {
		redirectTo: 'http://example.com/account/update-password',
	})
}

exports.getUserData = getUserData
exports.getUserDataFromName = getUserDataFromName
exports.signUp = signUp
exports.signIn = signIn
exports.signInWithUsername = signInWithUsername
exports.getSession = getSession
exports.doesAccountExistWithName = doesAccountExistWithName
exports.getImage = getImage
exports.resetPassword = resetPassword
exports.getUserIDFromName = getUserIDFromName