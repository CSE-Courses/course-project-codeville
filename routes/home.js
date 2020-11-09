const express = require('express');
const path = require('path');
const connection = require('../db');

const router = express.Router();


router.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
router.use(function(req,res,next){
    if(!req.session || !req.session.loggedin){
        //console.log(req.session, "================");
        req.flash('error', 'Please login first')
        return res.redirect('login')
        res.end()
    }
   next();
})
router.get('/personaldetails', function (req, res, next) {
    res.render('personaldetails')
})
router.get('/education', function (req, res, next) {
    res.render('education')
})

router.get('/home',function(req,res,next){
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



module.exports = router;