//Required modules
//Express, Express cookie parser, Express multer

const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');

//Loads the express module onto variable app
const app = express();


//I dont know exactly why this is the way to do it but it is
//Link to reference: https://github.com/expressjs/express/blob/master/examples/static-files/index.js
//
//
//IMPORTANT DON'T INCLUDE STATIC IN DIR PATH IN HTML FILES
//
//Link the parent directory to use
app.use(express.static(path.join(__dirname,'static')));

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
app.listen(port, () => {
    console.log('Listening on port '+ port);
});



/*
//Creates the server
//req variable is what the client sends
//res is the server response.
const server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html'});
    fs.readFile('contact.html', function(error, data) {
        if(error) {
            res.writeHead(404 );
            res.write('Error: File Not Found')
        } else {
            res.write(data)
        }
        res.end();
    });

});


server.listen(port, function(error){
    if(error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server is listening on port ' + port)
    }
})*/