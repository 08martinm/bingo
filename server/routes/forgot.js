const crypto = require('crypto');
const User = require('../db/users.js');
const nodemailer = require('nodemailer');
const expressValidator = require('express-validator');

module.exports = {
  post: (req, res, next) => {

    req.checkBody('forgotemail', 'Email field cannot be empty.').notEmpty();
    req.checkBody('forgotemail', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('confemail', 'Confirm Email does not match Email, please try again.').equals(req.body.forgotemail);

    const errors = req.validationErrors();

    if (errors) {
      console.log(`errors: ${JSON.stringify(errors)}`);
      let msg = errors.reduce((arr, val) => arr = arr.concat(val.msg), []);
      return res.status(401).json(msg);
    }

    crypto.randomBytes(20, function(err, buf) {
      var token = buf.toString('hex');
      console.log('req.body is', req.body);
      User.findOne({ email: req.body.forgotemail }, function(err, user) {
        if (!user) {
          return res.status(401).json('We do not have that email in our files.');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          if (err) throw err;
          let smtpTransport = nodemailer.createTransport(options);
          smtpTransport.sendMail(mailOptions_Reset(req, token), err => {
            if (err) return next(err);
            res.status(200).json('Open the link in the email we just sent you to reset your password.');
          });
        });
      });
    });
  },
};

let options = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'bingobymatthew@gmail.com',
    pass: process.env.NODEMAILER_PW,
  },
};

let mailOptions_Reset = (req, token) => {
  let link = 'http://' + req.get('host') + '/reset/' + token;
  return({
    from: '"BINGO!!!" <bingobymatthew@gmail.com>', // sender address
    to: req.body.forgotemail, // list of receivers
    subject: 'Password Reset', // Subject line
    html: 'Hi,<br><br>We received a notification that you would like to reset your password.<br><br>' + 
      'Please click on the link below to reset your password.<br><br>' + 
      '<a href=' + link + '>Click here to reset your password.</a>', // html body
  });
};
