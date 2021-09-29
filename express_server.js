const express = require("express");
const app = express();
const PORT = 8080; // default port is 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


const generateRandomString = function () {
    let randomString = "";
    return randomString += Math.floor((1 + Math.random()) * 0x10000).toString(6).substring(1);
};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ exended: true }));

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
    let templateVars = {
        urls: urlDatabase,
        username: req.cookies["username"],
    };
    res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
    let templateVars = {
        username: req.cookies["username"],
    };
    res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL],
        username: req.cookies["username"],
    };
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    if (longURL === undefined) {
        res.send(302);
    } else {
        res.redirect(longURL);
    }
});

app.post("/urls", (req, res) => {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
    const shortURL = req.params.id;
    urlDatabase[shortURL] = req.body.newURL;
    res.redirect('/urls');
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    res.cookie('username', username);
    res.redirect('/urls');
});

app.post("/logout", (req, res) => {
    res.clearCookie('username');
    res.redirect('/urls');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});