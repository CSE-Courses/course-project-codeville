//Required modules
//npm install express
//npm install body-parser --save
//npm install cookie-parser --save
//npm install multer --save
//Express, Express cookie parser, Express multer

const path = require('path');
const express = require('express');

//Loads the express module onto variable server
const app = express();


//                         LINKING MIDDLEWARE
//   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
//   V   V   V   V   V   V   V   V   V   V   V   V   V   V   V   V

//Links middleware index
const index = require('./routes/index.js')











// Linking Middleware

//***SYNTAX***All routes starting with '/' will now use index
app.use('/',index);


//Server listener handler
port = 4000;


//***ERROR HANDLER*** for middleware
//Automatically catches any error middleware will send
app.use(function (err,req, res, next) {
    //all this does is print the error and send error msg to client
    console.error(err.stack);
    res.status(500).send('ERROR, printing to console.error')
});

app.listen(port);
console.log(port);