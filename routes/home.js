const express = require('express');
const path = require('path');
const connection = require('../db');
const loggedin = require('../middleware/loggedin')
const session = require('express-session');

const router = express.Router();


router.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

router.get('/personaldetails',loggedin, function (req, res, next) {
    res.render('personaldetails')
})
router.get('/home', loggedin, function(req,res,next){
    connection.query('select firstlogin from users where email = $1', [req.session.email], function (err, result) {
        if (err) {
            throw err;
        }
        if(result.rows[0].firstlogin){
            res.render('personaldetails')
        }
        else{
            res.send('HI')
        }
    });
})

//EDUCATION PAGE HANDLING BELOW

router.get('/education',loggedin, (req, res, next) => {
    connection.query("SELECT * FROM majors",function(err, result){
        if(err) return next(err);
        //console.log(count);
        res.render('education',{data: result.rows});
    });
});


router.post('/education',(req, res, next)=>{
    const major = req.body.major;
    const standing = req.body.class_standing;
    //LOGIC FOR VERIFYING INFO
    //console.log(major,standing);//To test that it retrieves correct info


    //UPDATING USER DATABASE WITH CHOICES
    connection.query('INSERT INTO useredu (email, major, standing) VALUES ( $1, $2, $3);',
        [req.session.email, major, standing],
        function(err,result){
            if(err) return next(err);
            res.render('404');
        }
    );
});



module.exports = router;