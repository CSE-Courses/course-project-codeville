//Required modules
//npm install express
//npm install body-parser --save
//npm install cookie-parser --save
//npm install multer --save
//Express, Express cookie parser, Express multer

const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');

//Loads the express module onto variable app
const app = express();
const port = 3000;


//I dont know exactly why this is the way to do it but it is
//Link to reference: https://github.com/expressjs/express/blob/master/examples/static-files/index.js
//
//
//IMPORTANT DON'T INCLUDE STATIC IN DIR PATH IN HTML FILES
//
//Link the parent directory to use
app.use(express.static(path.join(__dirname)));

//
//Handling client requests below
//   |   |   |   |   |   |
//   V   V   V   V   V   V
//
//this is the default page that will be loaded on our site
app.get('/', (req, res) => {
    //res.send('Hello World!')
    res.sendFile( __dirname + "/" + "contact.html");
});

//loads the contact page
app.get('/contact', (req, res) => {
    res.sendFile( __dirname + "/" + "contact.html");
});

//loads the header page
app.get('/header', (req, res) => {
    res.sendFile( __dirname + "/" + "header.html");
});



//
//Server listen handler
//
//For Heroku
//var port = process.env.PORT || 80;

app.listen(port, () => {
    console.log('Listening on port '+ port);
});