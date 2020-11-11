const express = require('express');
const path = require('path');
const connection  = require('../db');
const session = require('express-session');
const loggedin = require('../middleware/loggedin')

//For testing only!
//const connection  = require('../testDB');

const router = express.Router();

router.use(express.static(path.join(__dirname,'../public')));
parent = path.resolve(__dirname, '..')

//
// Handling client requests below
//   |   |   |   |   |   |
//   V   V   V   V   V   V
//
//this is the default page that will be loaded on our site
router.get('/', (req,res) => {
    res.sendFile(parent+"/public/index.html");
});

router.get('/contact', (req, res) => {
    res.sendFile(parent+"/public/contact.html");
});

router.get('/pictureupload', loggedin,(req, res) => {
    res.sendFile(parent+'/public/PictureUpload.html');
});




module.exports = router;
