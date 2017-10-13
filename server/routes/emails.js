const Emails = require('../db/emails.js');
const mail = require('../nodemailer.js');
const crypto = require('crypto');

module.exports = {
  post: (req, res) => {
    let addr = req.body.email;
    let rand = Math.floor((Math.random() * 100) + 54);
    let hash = crypto.createHash('sha256').update(rand.toString(), 'utf8').digest('hex');
    
    Emails.find({email: addr}, (err, email) => {
      if (err) throw err;
      if (email.length === 0) {
        Emails.create({email: addr, hash: hash}, (err) => {
          if (err) throw err;
          mail.transporter.sendMail(mail.options(req, hash), mail.cb);
          res.status(200).json('added to database!');
        });
      } else {
        res.status(401).json('email already on file');
      }
    });
  },

  verify: (req, res) => {
    let update = {
      verified: true,
      hash: null,
    };

    Emails.findOneAndUpdate({hash: req.query.id}, update, (err, email) => {
      if (err) throw err;
      if (email) {
        res.status(200).json('Your email has been verified');
      } else {
        res.status(401).json('Invalid validation attempt');
      }
    });
  },
};
