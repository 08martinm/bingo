const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./db/users.js');
const bcrypt = require('bcrypt');

passport.serializeUser(function(id, done) {
  done(null, id);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});

passport.use('local', new LocalStrategy({
  usernameField : 'logemail',
  passwordField : 'logpassword',
}, (email, pwd, done) => {
  User.findOne({email: email}, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, {message: 'Incorrect email'});
    bcrypt.compare(pwd, user.password, (err, res) => {
      if (!res) return done(null, false, {message: 'Incorrect password'});
      return done(null, user);
    });
  });
}));

module.exports = passport;
