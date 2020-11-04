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


app.get('/PersonalDetails', (req, res) => {
    res.render("PersonalDetails");
});



app.post('/personal_details', function (req,res) {

      first_name = req.body.first_name.toString();
      last_name = req.body.last_name.toString();
      dob = req.body.dob.toString();
      gender = req.body.gender.toString();
      console.log("Data received.");

//		Input Validation for Personal DETAILS


			if (first_name=="" || !(first_name.isAlpha()) || first_name.length<50){
				req.flash("error", "Invalid input for First Name.")
				res.render("/PersonalDetails");
			}
			if (last_name=="" || !(last_name.isAlpha()) || last_name.length<50){
				req.flash("error", "Invalid input for Last Name.")
				res.render("/PersonalDetails");
			}
			if (dob == ""){
				req.flash("error", "Invalid date of birth.")
				res.render("/PersonalDetails");
			}
			if (gender=="" || !(gender.isAlpha()) || gender.length<=1){
				req.flash("error", "Invalid input for gender.")
				res.render("/PersonalDetails");
			}


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

			res.redirect('education.html');

});

module.exports = app;
