const express = require('express');
const path = require('path');
const connection = require('../db');
const loggedin = require('../middleware/loggedin')
const session = require('express-session');
const { release } = require('os');

const router = express.Router();


router.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});



router.post("/getfriends",loggedin, async function(req,res){
    classid=req.body.classid
    title=req.body.title
    section=req.body.section
    //console.log(classid, title,section);
    str = ""
    let result = await connection.query("select friend_email from friendstest where email = $1 and status = 0 and friend_email in (select email from studentcourses where classid=$2 and title=$3 and section=$4);", [req.session.email, classid, title, section])
    for(i=0;i<result.rows.length;i++){  
        let resul = await connection.query("select first_name, last_name from personal_details where email = $1", [result.rows[i].friend_email])
        str += resul.rows[0].first_name + " " + resul.rows[0].last_name + "~" + result.rows[i].friend_email + "|"
    }
    str = str.slice(0, -1)
    //console.log(friendNames);
    res.send(str)
});

router.get('/HomePage', loggedin, function (req, res, next) {

    connection.query('select classid, title, section from studentcourses where email=$1', [req.session.email], function (err, result) {
        if (err) {
            throw err;
        }
        var classids = []
        var titles = []
        var sections = []
        for(i=0; i<result.rows.length; i++){
            classids[i]=result.rows[i].classid
            titles[i]=result.rows[i].title
            sections[i]=result.rows[i].section
        }
            
    while (classids.indexOf("&lt;&lt;&lt; &gt;&gt;&gt;")!=-1){
        classids[classids.indexOf("&lt;&lt;&lt; &gt;&gt;&gt;")]="<<< >>>"
    }
        res.render('HomePage', { classids: classids, titles: titles, sections: sections})
});
});


router.get('/home', loggedin, function(req,res,next){
    connection.query('select firstlogin from users where email = $1', [req.session.email], function (err, result) {
        if (err) {
            throw err;
        }
        if(result.rows[0].firstlogin){
            res.redirect('personaldetails')
        }
        else{
            res.redirect('HomePage')
        }
    });
})

//EDUCATION PAGE HANDLING BELOW

router.get('/education',loggedin, (req, res, next) => {
    connection.query("SELECT DISTINCT dname FROM courses",function(err, result){
        if(err) return next(err);
        //console.log(count);
        res.render('education',{data: result.rows});
    });
});


router.post('/education',loggedin,(req, res, next)=>{
    const major = req.body.major;
    const standing = req.body.class_standing;
    //LOGIC FOR VERIFYING INFO
    //console.log(major,standing);//To test that it retrieves correct info


    //UPDATING USER DATABASE WITH CHOICES
    connection.query('INSERT INTO useredu (email, major, standing) VALUES ( $1, $2, $3);',
        [req.session.email, major, standing],
        function(err,result){
            if(err) return next(err);
            res.redirect('AddCourses');
        }
    );
});

router.get('/AddCourses', loggedin, (req, res, next) => {
    connection.query("SELECT DISTINCT dabbr FROM courses", function (err, result) {
        if (err) return next(err);
        //console.log(result.rows);
        res.render('AddCourses', { data: result.rows });
    });
});


module.exports = router;
