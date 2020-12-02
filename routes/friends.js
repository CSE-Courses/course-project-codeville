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
    // connection.query("SELECT first_name FROM personal_details WHERE first_name = $1", [req.body.search_friends], function (err, result) {
    //     if(err) return next(err);
    //
    //     res.render('addFriends', {data: result.rows})
    // });
    console.log("GET Request");
    res.render('addFriends',{data: {}});
});


router.post('/addFriends', function(req,res,next) {

});

router.get('/searchFriends',function(req,res,next) {
    // connection.query("SELECT first_name FROM personal_details WHERE first_name LIKE '%' + $1 + '%'", [req.body], function(err,result) {
    //
    // } )
    console.log(`${req.method} ${req.path}`);
    const {body, query} = req;
    console.log({body, query})
    const searchFriends = query.search_friends.replace(/%/g, '') + '%'; // strip wildcards

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