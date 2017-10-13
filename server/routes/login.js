const User = require('../db/users.js');
const expressValidator = require('express-validator');

module.exports = {
  signup: (req, res) => {
    req.checkBody('email', 'Email field cannot be empty.').notEmpty();
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('password', 'Password must be between 6-100 characters long.').len(6, 100);
    req.checkBody('password', 'Password must include one lowercase character and one uppercase character.').matches(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/, 'i');
    req.checkBody('confpassword', 'Confirm Password does not match Password, please try again.').equals(req.body.password);
    // Additional validation to ensure username is alphanumeric with underscores and dashes
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors = req.validationErrors();

    if (errors) {
      console.log(`errors: ${JSON.stringify(errors)}`);
      let msg = errors.reduce((arr, val) => arr = arr.concat(val.msg), []);
      return res.status(401).json(msg);
    }

    User.find({username: req.body.username}, (err, data) => {
      if (err) throw err;
      if (data.length != 0) return res.status(401).json('That username has already been taken!');
      User.find({email: req.body.email}, (err, data) => {
        if (err) throw err;
        if (data.length != 0) return res.status(401).json('We already have that email on file!');
        User.create(req.body, (err, user) => {
          if (err) throw err;
          req.login(user, (err) => {
            if (err) throw err;
            return res.status(200).json({username: user.username, email: user.email});
          });
        });
      });
    });
  },

  login: (req, res, next) => {
    User.findOne({email: req.body.logemail}, (err, user) => {
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.json({username: user.username, email: user.email});
      });
    });
  },

  auth: (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({username: req.user.username, email: req.user.email});
    } else {
      res.status(401).json('Incorrect username or password!');
    }
  },
};
