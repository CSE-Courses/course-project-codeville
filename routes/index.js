const express = require('express');
const path = require('path');

const router = express.Router();



router.use(express.static(path.join(__dirname,'../public')));

//
// Handling client requests below
//   |   |   |   |   |   |
//   V   V   V   V   V   V
//
//this is the default page that will be loaded on our site
router.get('/', (req,res) => {
    res.sendFile("index.html");
});

router.get('/contact', (req, res) => {
    res.sendFile("contact.html");
});





module.exports = router;
