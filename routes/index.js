const express = require('express');
const path = require('path');
const connection  = require('../db');
const session = require('express-session');

//For testing only!
//const connection  = require('../testDB');

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

router.get('/education', (req, res, next) => {
        connection.query("SELECT * FROM majors",function(err, result){
            if(err) return next(err);
            //console.log(count);
            res.render('education',{data: result.rows});
        });
});

router.get('/PersonalDetails', (req, res) => {
    res.sendFile("PersonalDetails.html");
});

router.post('/education',(req, res)=>{
    const major = req.body.major;
    const standing = req.body.class_standing;
    //LOGIC FOR VERIFYING INFO
    //console.log(major,standing);//To test that it retrieves correct info




    //UPDATING USER DATABASE WITH CHOICES
    //Need to create logs for majors and class standings in database
    //connection.query(........)
});



module.exports = router;
