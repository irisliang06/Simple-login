const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const cookie_session = require('cookie-session');
const util = require('util');

const app = express();

app.use(cors({
    origin: [
		'http://localhost:3000'
	],
	credentials: true
}));
app.use(express.json());

/*
Set up the database
*/

let db = new sqlite3.Database("database.db");
db.all = util.promisify(db.all);
db.run = util.promisify(db.run);
db.run("CREATE TABLE IF NOT EXISTS userTable (username TEXT, password TEXT)");

/*
Set up the cookie session
using the cookie-session package this is what happens

req.session = {
    
}

when the user logs in, we can put their username into the session to show that they're logged in

then, to check if they are logged in, we see if the username is in the session.

*/

app.use(cookie_session({
	maxAge: 6 * 60 * 60 * 1000,
	keys: [ 'ajwidjaiowdiajdjaiwdjaioefhseuh' ]
}));

/*
Set up the rest api
*/

app.get('/is-login', async (req, res) => {
    //check to see if the request session is logged in
    //return their username in JSON if they are logged in, false otherwise
    res.status(200);
    res.contentType('application/json');
    if (req.session.username === undefined) {
        res.send(JSON.stringify(false));
    }
    else {
        res.send(JSON.stringify(req.session.username));
    }
});

app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    //check to see if username and password match the database
    //if they do, then return 200 OK and set req.session.username to be the username
    //if they don't, then return 400 BAD REQUEST
    let query = await db.all("SELECT * FROM userTable WHERE username=? AND password=?", [username, password]);
    if (query.length == 1) {
        req.session.username = username;
        res.status(200);
        res.send("");
    }
    else {
        res.status(400);
        res.send("Invalid login credentials.");
    }
});

app.post('/signup', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    //check if the username is already taken.
    //if the username is already taken, then return 400 BAD REQUEST
    //if it's not, then set req.session.username, add user to DB, and return 201 CREATED
    let query = await db.all("SELECT * FROM userTable WHERE username=?", [username]);
    if (query.length == 1) {
        res.status(400);
        res.send("That username is already taken.");
    }
    else {
        req.session.username = username;
        await db.run("INSERT INTO userTable (username, password) VALUES (?, ?)", [username, password]);
        res.status(201);
        res.send("");
    }
});

app.get('/logout', async (req, res) => {
    req.session.username = undefined;
    res.status(200);
    res.send("");
});

app.listen(5000);