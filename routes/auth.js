const express = require('express');
const connection  = require('../db');
const crypto = require('crypto');
var sendEmail = require('../middleware/sendEmail.js')

var router = express.Router();


router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


router.get('/login', (req, res) => {
    res.render("login");
});
router.post('/auth', function (req, res, next) {
  var email = req.body.email;
  var patt = /@buffalo.edu$/;
  var result = email.match(patt);
  if (result == null) {
    req.flash('error', 'Use only buffalo.edu email please');
    return res.render('login');
  }
  var password = req.body.password
  const cipher = crypto.createCipher('aes128', 'a password');
  var encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  connection.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, encrypted], (err, rows) => {
    if (err) console.log(err);
    // if user not found
    if (rows.rows.length <= 0) {
      connection.query('SELECT email from users WHERE email=$1', [email], (err, rows) => {
        if (rows.rows.length <= 0) {
          req.flash('error', 'Please signup first');
          return res.redirect('signup');
        }
        else {
          req.flash('error', 'Wrong ID/Pass');
          return res.redirect('login');
        }
      });
    }
    if (rows.rows[0].isverified==0) {
      console.log(rows,"===========");
      req.session.email=email;
      req.flash('error', 'Please verify your email first')
      return res.redirect('verify')
    }
    else if (rows.rows.length == 1 && rows.rows[0].isverified==1) { // if user found
      // render to views/user/edit.ejs template file
      req.session.loggedin = true;
      req.session.email = email;
      return res.redirect("home")
    }
    else {
      //console.log("---------",rows);
      req.flash('error', 'Some error occured');
      return res.render('login');
    }
  });
});


router.get('/Signup', (req, res) => {
    res.render("Signup");
});

router.post('/register',function(req,res,next){
  req.assert('password', 'Password is required').notEmpty()
  req.assert('password', 'Password should be atleast 8 characters').isLength({min:8}); //Validate password
  req.assert('passwordConf', 'Password is required').notEmpty()
  req.assert('passwordConf', 'Password should be atleast 8 characters').isLength({min:8});
  req.assert('email', 'A valid email is required').isEmail();  //Validate email
  email = req.sanitize('email').escape().trim();
  var patt = /@buffalo.edu$/;
  var result = email.match(patt);
  if(result==null){
    req.flash('error','Use only buffalo.edu email please');
    return res.render('Signup');
  }
  var errors = req.validationErrors()
  if(errors) {
  req.flash('error',errors[0].msg);
  return res.render('Signup');
  }
  next();
});

// user registration
router.post('/register', sendEmail, function(req, res, next){
passwordConf=req.body.passwordConf;
var user = {
email: req.sanitize('email').escape().trim(),
password: req.sanitize('password').escape().trim()
}
if(user.password!=passwordConf){
  req.flash('error', 'Passwords must match');
  return res.render('Signup');
}
connection.query('SELECT email from users where email = $1',[user.email],function(err,result){
  if(err) throw err
  if(result.rows.length >0){
    req.flash('error','User already exists, please login')
    return res.render('login');
  }
else{
    const cipher = crypto.createCipher('aes128', 'a password');
    var encrypted = cipher.update(user.password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
//No errors were found.  Passed Validation!
req.session.email=user.email;
connection.query('INSERT INTO users (email, password, isVerified) VALUES ($1, $2, $3);', [user.email,encrypted, 0], function(err, result) {
//if(err) throw err
if (err) {
req.flash('error', err)
return res.render('Signup')
} else {
  req.flash('error', 'Please verify your email');
  return res.render('verify');
}
})
}
});
});


router.get('/verify', function (req, res, next) {
  res.render('verify')
});

router.post('/verify', function (req, res, next) {
  connection.query('SELECT token from verify where email = $1', [req.session.email], function (err, result) {
    if (err) {
      throw err;
    }
    tok = result.rows[0].token.trim();
    bodyTok = req.sanitize('token').escape().trim();
    //console.log(tok,"=========",bodyTok);
    if (tok!= bodyTok) {
      req.flash('error', 'Invalid Token');
      return res.render('verify');
    }
    else{
      connection.query('UPDATE users SET isVerified = 1 where email = $1', [req.session.email], function (err, result) {
        if (err) {
          throw err;
        }
      });
      connection.query('delete from verify where email = $1', [req.session.email], function (err, result) {
        if (err) {
          throw err;
        }
      });
      req.flash('success', 'you have successfully signed up')
      return res.redirect('login')
    }
  });
});

// Logout user
router.get('/logout', function (req, res) {
  console.log("here");
  req.session.loggedin = 0;
  req.session.destroy();
  return res.redirect('login');
});



module.exports = router;
