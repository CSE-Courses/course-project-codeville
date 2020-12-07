const express = require('express');
const connection = require('../db');
const loggedin = require('../middleware/loggedin')
var router = express.Router();


router.get('/profile-:ubit', loggedin, async function(req, res, next){

		var ubit = req.params.ubit;
		ubitmail = ubit + '@buffalo.edu';
		isFriend = false;
		let resu = await connection.query('select friend_email from friendstest where email = $1 and status = 0', [req.session.email]);
			for(i=0;i<resu.rows.length;i++){
				if(resu.rows[i].friend_email == ubitmail){
					isFriend = true;
					break;
				}
			}

		if(ubitmail == req.session.email || isFriend){
		var fullname ='';
		var major = '';
		var standing = '';
		let result = await connection.query('select first_name, last_name from personal_details where email = $1', [ubitmail]);
			fullname = result.rows[0].first_name + " " + result.rows[0].last_name;
			console.log(fullname);
		let result2 = await connection.query('select major, standing from useredu where email = $1', [ubitmail]);

			major  = result2.rows[0].major;
			standing = result2.rows[0].standing;

			console.log(major,standing);

		let result3 = await connection.query('select classid, title, section from studentcourses where email = $1', [ubitmail]);

			req.flash('name', fullname);
			req.flash('email',ubitmail);
			req.flash('major', major);
			req.flash('standing', standing);
			rows = result3.rows;
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].classid == "&lt;&lt;&lt; &gt;&gt;&gt;"){
					rows[i].classid = "<<< >>>"
				}
			}
			return res.render('Profile', {data: rows});
		}
		else{
			return res.render('404');
		}


});

module.exports = router
