module.exports = {
  get: (req, res) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      req.session.destroy(function() {
        console.log(req.isAuthenticated());
        res.clearCookie('connect.sid', {path: '/'});
        console.log(req.isAuthenticated());
        req.logout();
        res.status(200).json('Successfully logged out.');
      });
    } else {
      console.log('already signe dout');
      res.status(401).json('Already signed out.');
    }
  },
};
