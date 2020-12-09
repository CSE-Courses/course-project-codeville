const express = require('express');
const path = require('path');
const connection = require('../db');
const loggedin = require('../middleware/loggedin')
const session = require('express-session');

const router = express.Router();


router.get('/viewfriends', async function (req,res,next) {
    let data = [];

    //CHANGE EMAIL VALUE FOR result, TESTING ONLY

    let result = await connection.query("SELECT friend_email, status FROM friendstest WHERE email = $1 ORDER BY status ASC", ["test4@buffalo.edu"]);
    let listFriends = result.rows;//Should return all friends, as well as requests
    for(i = 0; i < listFriends.length; i++){
        let friendsEmail = listFriends[i].friend_email;
        let status = listFriends[i].status;
        let perResult = await connection.query("SELECT first_name, last_name FROM personal_details WHERE email = $1", [friendsEmail]);
        let eduResult = await connection.query("SELECT major FROM useredu WHERE email = $1", [friendsEmail]);
        console.log(perResult.rows);
        let name = perResult.rows[0].first_name + ' ' + perResult.rows[0].last_name;
        let major = eduResult.rows[0].major;
        let varDict = {
            email: friendsEmail,
            status:status,
            name:name,
            major: major
        };
        data.push(varDict);
    }
    res.render('viewfriends', {data: data})
});

router.post('/friendrequests', function (req,res,next) {
    const {body, query} = req;
    console.log({body, query});
    let status = body.status.replace('/','');
    let friendemail = body.email.replace('/','');
    if(status == 2){ //Accept case
        connection.query("UPDATE friendstest SET status = 0 WHERE email = $1 AND friend_email = $2", ["test4@buffalo.edu", friendemail]);
        connection.query("UPDATE friendstest SET status = 0 WHERE email = $1 AND friend_email = $2", [friendemail, "test4@buffalo.edu"]);
    }
    //Either cancel, or delete friend/friend req. Does same thing to database
    else{
        connection.query("DELETE FROM friendstest WHERE email = $1 AND friend_email = $2",["test4@buffalo.edu", friendemail])
        connection.query("DELETE FROM friendstest WHERE email = $1 AND friend_email = $2",[friendemail, "test4@buffalo.edu"])
    }
    res.redirect('viewfriends');
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