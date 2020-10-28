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
app.post('/personal_details', function (req,res) {

      first_name = req.body.first_name.toString();
      last_name = req.body.last_name.toString();
      dob = req.body.dob.toString();
      gender = req.body.gender.toString();
      console.log("Data received.");



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
