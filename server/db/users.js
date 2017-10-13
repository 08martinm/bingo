const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let UserSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true, trim: true},
  username: {type: String, unique: true, required: true, trim: true},
  password: {type: String, required: true},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

UserSchema.pre('save', function(next) {
  let user = this;
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) throw err;
    user.password = hash;
    next();
  });
});

let User = mongoose.model('User', UserSchema);

module.exports = User;
