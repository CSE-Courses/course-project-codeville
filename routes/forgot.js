const express = require('express');
const connection = require('../db');
const crypto = require('crypto');
var sendEmail = require('../middleware/sendEmail.js')
var router = express.Router();




module.exports = router;