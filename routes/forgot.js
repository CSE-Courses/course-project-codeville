const express = require('express');
const connection = require('../db');
const crypto = require('crypto');
var sendEmail = require('../middleware/sendEmail.js')
var router = express.Router();



const path = require('path');
router.use(express.static(path.join(__dirname, '../public')));
parent = path.resolve(__dirname, '..')


router.get('/verifyForgot',function(req,res,next){
    res.render('verifyForgot')
})

router.get('/Reset_Password', function (req, res, next) {
    res.render('Reset_Password')
})
router.get('/Forgot_Password', function (req, res, next) {
    res.render('Forgot_Password')
})

router.post('/forgot', function(req,res,next){
    email=req.sanitize('email').escape().trim()
    if(!email){
        req.flash('error','Invalid email')
        res.redirect('Forgot_Password')
    }
    var patt = /@buffalo.edu$/;
    var result = email.match(patt);
    if (result == null) {
        req.flash('error', 'Use only buffalo.edu email please');
        return res.render('Forgot_Password');
    }
    else {
    req.session.email=email
    // req.assert('email', 'A valid email is required').isEmail();
    // var errors = req.validationErrors()
    // if (errors) {
    //     res.sendFile(parent + '/public/Forgot_Password.html')
    // }
    connection.query('select email from users where email = $1', [email], function (err, result) {
        if (err) {
            throw err;
        }
        if(result.rows.length<1){
            req.flash('error','User does not exist')
            res.redirect('signup')
        }
        else next()
    });
}
})

router.post('/forgot',sendEmail,function(req,res,next){
    setTimeout(function(){
        res.redirect('verifyForgot')
    }, 3000)
})

router.post('/verifyForgot',function(req,res,next){
    connection.query('SELECT token from verify where email = $1', [req.session.email], function (err, result) {
        if (err) {
            throw err;
        }
        tok = result.rows[0].token.trim();
        bodyTok = req.sanitize('token').escape().trim();
        //console.log(tok,"=========",bodyTok);
        if (tok != bodyTok) {
            req.flash('error', 'Invalid Token');
            return res.render('verifyForgot');
        }
        else{
            connection.query('delete from verify where email = $1', [req.session.email], function (err, result) {
                if (err) {
                    throw err;
                }
            });
            return res.redirect('Reset_Password')
        }
    })
})

router.post('/reset',function(req,res,next){
    req.assert('password', 'Password is required').notEmpty()
    req.assert('password', 'Password should be atleast 8 characters').isLength({ min: 8 }); //Validate password
    req.assert('passwordConf', 'Password is required').notEmpty()
    req.assert('passwordConf', 'Password should be atleast 8 characters').isLength({ min: 8 });
    var errors = req.validationErrors()
    if (errors) {
        req.flash('error', errors[0].msg);
        return res.render('Reset_Password');
    }
    next()
})

router.post('/reset',function(req,res,next){
    passwordConf = req.sanitize('passwordConf').escape().trim()
    password = req.sanitize('password').escape().trim()
    if (password != passwordConf) {
        req.flash('error', 'Passwords must match');
        return res.render('Reset_Password');
    }
    const cipher = crypto.createCipher('aes128', 'a password');
    var encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    connection.query("UPDATE users set password = $1 where email = $2",[encrypted,req.session.email],function(err,result){
        if(err) throw err
        req.flash('success','Successfully reset password')
        res.redirect('login')
    })
})





module.exports = router;