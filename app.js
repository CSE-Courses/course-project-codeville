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
const crypto = require('crypto');
var conn = require('./db.js');
const env = require("dotenv").config();
const index = require('./routes/index.js');
const auth = require('./routes/auth.js');
//const pd = require('./routes/PersonalDetails.js');
const home = require('./routes/home.js')
const forgot = require('./routes/forgot.js')


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: process.env.secretSession,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(expressValidator());

app.use('/', index);
app.use('/', auth);
//app.use('/', pd);
app.use('/',home)
app.use('/',forgot)


app.use('*', (req, res) => {
    res.render("404");
});

//***ERROR HANDLER*** for middleware
//Automatically catches any error middleware will send
app.use(function (err,req, res, next) {
    //all this does is print the error and send error msg to client
    console.error(err.stack);
    res.status(500).send('ERROR, printing to console.error')
});


port = process.env.PORT || 80;
var server = app.listen(port)

//FOR TESTING ONLY
// const server = app.listen(3000)
