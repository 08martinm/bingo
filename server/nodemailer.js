const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'bingobymatthew@gmail.com',
    pass: process.env.NODEMAILER_PW,
  },
});

// setup email data with unicode symbols
let mailOptions = (req, hash) => {
  let link = 'http://' + req.get('host') + '/verify/api/?id=' + hash;

  return({
    from: '"BINGO!!!" <bingobymatthew@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: 'Mailing List - Confirmation Requested', // Subject line
    html: 'Hi,<br><br>You signed up to play some bingo.<br><br>' + 
      'Please Click on the link below to verify your email.<br><br>' + 
      '<a href=' + link + '>Click here to verify.</a>', // html body
  });
};

// send mail with defined transport object
let transporterCb = (error, info) => {
  if (error) return console.log(error);
  console.log('Message %s sent: %s', info.messageId, info.response);
};

// verify connection configuration
transporter.verify(function(error) {
  if (error) return console.log(error);
  console.log('Server is ready to take our messages');
});

module.exports.transporter = transporter;
module.exports.cb = transporterCb;
module.exports.options = mailOptions;
