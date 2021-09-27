const express = require("express");
const app = express();
const PORT = 8080; // default port is 8080
const bodyParser = require("body-parser");

const generateRandomString = function () {
    let randomString = "";
    return randomString += Math.floor((1 + Math.random()) * 0x10000).toString(6).substring(1);
};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ exended: true }));

// using this Object to keep track of all the URLs and their shortened forms
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});