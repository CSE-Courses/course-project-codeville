const express = require('express');
const connection  = require('../db');

var router = express.Router();


router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


router.get('/login', (req, res) => {
    res.render("login");
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
router.post('/register', function(req, res, next){
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
//No errors were found.  Passed Validation!
req.session.email=user.email;
connection.query('INSERT INTO users (email, password, isVerified) VALUES ($1, $2, $3);', [user.email,user.password, 0], function(err, result) {
//if(err) throw err
if (err) {
req.flash('error', err)
return res.render('Signup')
} else {
req.flash('success', 'Successfully signed up');
return res.render('login');
}
})
}
});
});



module.exports = router;
