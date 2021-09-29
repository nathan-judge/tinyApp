const express = require("express");
const app = express();
const PORT = 8080; // default port is 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


const generateRandomString = function () {
    let randomString = "";
    return randomString += Math.floor((1 + Math.random()) * 0x10000).toString(6).substring(1);
};



const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
};
const users = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
}
const findUserByEmail = (email) => {
    for (const userId in users) {
        const user = users[userId];
        if (user.email === email) {
            return user
        }
    }
    return null
}
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
        user: users[req.cookies["user_id"]]
    };
    res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
    let templateVars = {
        user: users[req.cookies["user_id"]]
    };
    res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
    let templateVars = {
        user: users[req.cookies["user_id"]]
    };
    res.render("register", templateVars);
});
app.get("/login", (req, res) => {
    let templateVars = {
        user: users[req.cookies["user_id"]]
    };
    res.render("login", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
    let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL],
        user: users[req.cookies["user_id"]],
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

app.post('/login', (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send("email or password cannot be blank");
    }

    const user = findUserByEmail(email);

    if (!user) {
        return res.redirect('/register')
    }
    if (user.password !== password) {
        return res.status(400).send('password does not match')
    }

    res.cookie('user_id', user.id);
    res.redirect('/urls');
})
app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send("email or password cannot be blank");
    }

    const user = findUserByEmail(email);

    if (user) {
        return res.status(400).send('user with that email currently exists')
    }

    const id = Math.floor(Math.random() * 2000) + 1;

    users[id] = {
        id: id,
        email: email,
        password: password
    }

    console.log("users", users)
    res.cookie('user_id', id);
    res.redirect('/urls')
})
app.post("/logout", (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/urls');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});