const express = require('express');
const connection = require('../db');
const loggedin = require('../middleware/loggedin')
var router = express.Router();


router.get('/gettitle:dabbr', loggedin, function(req,res){

    dabbr = req.params.dabbr
    //console.log("++++++++++++++++++"+dabbr);
    connection.query('select distinct title from courses where dabbr = $1', [dabbr], function (err, result) {
        if (err) {
            throw err;
        }
        str=""
        for(i=0; i<result.rows.length;i++){
            str=str+result.rows[i].title+"|"
        }
        res.send(str)
    });
});

router.get('/getoptions:title',loggedin, function(req,res){
    title = req.params.title
    connection.query('select classid,title,section,days,time,instructor from courses where title = $1', [title], function (err, result) {
        if (err) {
            throw err;
        }
        str=""
        for(i=0;i<result.rows.length;i++){
            str = str + result.rows[i].classid + "~" + result.rows[i].title + "~" + result.rows[i].section + "~" + result.rows[i].days + "~" + result.rows[i].time + "~" + result.rows[i].instructor+"|"
        }
        res.send(str)
    });
})



router.post("/updatecourses", loggedin, function(req,res){
    str = req.body.data
    if(str==""){
        res.send("no")
    }
    else{
    rows=str.split('|')
    rows.forEach(row=>{
        cells=row.split('~')
        connection.query('INSERT INTO studentcourses (email, classid, title, section) VALUES ($1,$2,$3,$4)',[req.session.email, cells[0], cells[1], cells[2]], function(err, result){
            if(err) throw err;
        } )
    })
    res.send("yes")
}
})


module.exports = router;
