const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
var flash = require('express-flash');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const { Client } = require('pg');
var conn = require('./db.js');
const index = require('./routes/index.js');
const auth = require('./routes/auth.js');



app.set('view engine', 'ejs');
app.set('views', './views');

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: "codeVille",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(expressValidator());

app.use('/', index);
app.use('/', auth);


app.get('*', (req, res) => {
    res.render("404");
});

port = process.env.PORT || 80;
var server = app.listen(port)
