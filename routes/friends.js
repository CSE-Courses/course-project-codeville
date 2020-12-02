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

router.get('/addFriends',function(req, res,next) {
    res.render('addFriends',{data: {}});
});


router.post('/addFriends',loggedin, function(req,res,next) {
    const friendEmail = req.body.add_friend;
    //NOT WORKING ATM
    console.log(req.body);

    connection.query("INSERT INTO friends (email, friend_email, status) VALUES ($1, $2, $3);",
        [req.session.email,friendEmail, 1],
        function(err,result){
        if(err) return next(err);
        });
    connection.query("INSERT INTO friends (email, friend_email, status) VALUES ($1, $2, $3);",
        [friendEmail,req.session.email, 2],
        function(err,result){
            if(err) return next(err);
        })

});

router.get('/searchFriends',function(req,res,next) {
    console.log(`${req.method} ${req.path}`);
    const {body, query} = req;
    console.log({body, query})
    const searchFriends = query.search_friends.replace(/%/g, '') + '%';

    if (searchFriends) {
        connection.query("SELECT * FROM personal_details WHERE first_name ILIKE $1", [searchFriends], function (err, result) {
            if(err) return next(err);

            console.log(result.rows);

            res.render('addFriends',{data: result.rows})
        });
    } else {
        res.render('addFriends',{data: {}});
    }

});

module.exports = router;