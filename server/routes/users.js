const User = require('../db/users.js');

module.exports = {
  get: (req, res) => {
    User.find((err, users) => {
      if (err) throw err;
      console.log('users is', users);
      res.json(users);
    });
  },
};
