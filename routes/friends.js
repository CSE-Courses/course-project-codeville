const express = require('express');
const path = require('path');
const connection = require('../db');
const loggedin = require('../middleware/loggedin')
const session = require('express-session');

const router = express.Router();


router.get('/viewfriends', function (req,res,next) {
    connection.query("SELECT friends_id FROM testfriends WHERE useremail = $1", ["pskasza@buffalo.edu"], function (err, result) {
        if(err) return next(err);

        res.render('viewfriends', {data: result.rows})
    });
});

router.post('/viewfriends',function (req,res,next) {

    res.render('404');
});

module.exports = router;