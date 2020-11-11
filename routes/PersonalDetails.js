/*

		***** BACK-END CODE FOR PERSONAL DETAILS *****

	This module contains the server side code for the
	Personal Details Page. It handles the POST Requests
	to retrieve data from the Client and then updates
	the databse with the data received.

	@author Manav Majithia


*/
const client = require('../db');
const express = require('express');
const app = express.Router();
const bodyparser = require('body-parser');
const loggedin = require('../middleware/loggedin')
app.use(bodyparser.json());
var first_name;
var last_name;
var dob;
var gender;
/*
		Handling POST Requests to retrieve personal details
		data from the client and then updating the database
		with the data received.
*/


app.get('/PersonalDetails',loggedin, (req, res) => {
    res.render("PersonalDetails");
});



app.post('/personal_details', function (req,res) {

      first_name = req.sanitize('first_name').escape().trim();
      last_name = req.sanitize('last_name').escape().trim();
      dob = req.sanitize('dob').escape().trim();
      gender = req.sanitize('gender').escape().trim();
      console.log("Data received.");

			first_name = first_name.toString();
			last_name = last_name.toString();
			dob = dob.toString();
			gender = gender.toString();
			gender = gender.substring(0,1);
			if (gender=='M' || gender=='F' || gender=='N' || gender=='P'){

			}
			else{
				gender = "Invalid";
			}
			console.log(gender);
//		Input Validation for Personal DETAILS

			req.assert('first_name', 'Inputs cannot be empty.').notEmpty();
			req.assert('last_name', 'Inputs cannot be empty.').notEmpty();
			req.assert('dob', 'Inputs cannot be empty.').notEmpty();
			req.assert('gender', 'Inputs cannot be empty.').notEmpty();
			req.assert('first_name', 'First Name should be alphabetic only.').isAlpha();
			req.assert('first_name', 'First Name should be less than 50 characters.').isLength({max:50});
			req.assert('last_name', 'Last Name should be alphabetic only.').isAlpha();
			req.assert('last_name', 'Last Name should be less than 50 characters.').isLength({max:50});
			req.assert('dob', 'Invalid Date of Birth.').isBefore((new Date()).toString())
			req.assert('gender', 'Gender is invalid.').isLength(1);


			var errors = req.validationErrors()
		  if(errors) {
		  req.flash('error',errors[0].msg);
		  return res.render('personaldetails');
		  }
			console.log("Data Validated.");


//		Update the databse with Personal Details received from Client.

			var query = "INSERT INTO personal_details VALUES('"+first_name+"', '"+last_name+"', '"+dob+"', '"+gender+"');";

      client.query(query, (err,res) => {
          if (err) throw err
          else {
            for (let row of res.rows) {
              console.log(row);
            }
						console.log("Successfully added data.");
          }
        })

			res.redirect('education');

});

module.exports = app;
