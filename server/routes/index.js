const router = require('express').Router();
const User = require('./users.js');
const Login = require('./login.js');
const Logout = require('./logout.js');
const Forgot = require('./forgot.js');
const Reset = require('./reset.js');
const path = require('path');
const passport = require('../passport.js');

// Home
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'public', 'index.html'));
});

// Users
router.get('/api/users', User.get);

// Login/Logout
router.post('/api/signup', Login.signup);
router.post('/api/login', passport.authenticate('local'), Login.login);
router.get('/api/loggedin', Login.auth);
router.get('/api/logout', Logout.get);
router.post('/api/forgot', Forgot.post);
router.post('/api/reset/:token', Reset.post);

module.exports = router;
