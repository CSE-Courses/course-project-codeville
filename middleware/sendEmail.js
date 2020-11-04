const connection=require('../db.js')
const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codeville42069@gmail.com',
    pass: '42069@codeville'
  }
});

function generateP() {
  var pass = '';
  var str = '123456789ABCDEFGHJKMNPQRSTUVWXYZ' + //no o, O, 0, L, l, I  to remove confusion for users (i face this problem all the time xD)
          'abcdefghijkmnpqrstuvwxyz123456789@#$';

  for (i = 1; i <= 5; i++) {
      var char = Math.floor(Math.random()
                  * str.length + 1);

      pass += str.charAt(char)
  }

  return pass;
}

module.exports = function sendEmail(req, res, next){
  connection.query('SELECT email from users where email = $1',[email],function(err,result){
    if(err) throw err
    if(result.rows.length >0){
      req.flash('error','User already exists, please login')
      return res.redirect('login');
    }
    else{
  token = generateP();
  var mailOptions = {
    from: 'codeville42069@gmail.com',
    to: req.body.email,
    subject: 'Registering on WhoozeInIt?',
    text: 'Here is your verification code: ' + token
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  connection.query('INSERT INTO verify (email,token) VALUES ($1, $2);', [req.body.email, token], function(err, result) {
  //if(err) throw err
  if (err) {
throw err;
  }
  })
}
});
next();
}
