const User = require('../db/users.js');
const nodemailer = require('nodemailer');
const expressValidator = require('express-validator');

module.exports = {
  post: (req, res) => {

    req.checkBody('password', 'Password must be between 6-100 characters long.').len(6, 100);
    req.checkBody('password', 'Password must include one lowercase character and one uppercase character.').matches(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/, 'i');
    req.checkBody('confpassword', 'Confirm Password does not match Password, please try again.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
      console.log(`errors: ${JSON.stringify(errors)}`);
      let msg = errors.reduce((arr, val) => arr = arr.concat(val.msg), []);
      return res.status(401).json(msg);
    }

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        return res.status(400).json('error: Password reset token is invalid or has expired.');
      }

      user.password = req.body.password;
      console.log('password is', user.password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save(function(err) {
        if (err) throw err;
        req.logIn(user, function(err) {
          if (err) throw err;
          let smtpTransport = nodemailer.createTransport(options);
          smtpTransport.sendMail(mailOptions_Confirm(user), err => {
            if (err) throw err;
            return res.json('Success! Your password has been changed.');
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

let mailOptions_Confirm = user => ({
  from: '"BINGO!!!!" <bingobymatthew@gmail.com>', // sender address
  to: user.email, // list of receivers
  subject: 'Your Password Has Been Reset', // Subject line
  html: 'Hi,<br><br>This is a confirmation that the password for your account ' + user.email + ' has just been changed.<br><br>',
});
