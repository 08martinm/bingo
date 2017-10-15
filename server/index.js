const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('connect-flash');
const history = require('connect-history-api-fallback');
const expressValidator = require('express-validator');
const passport = require('./passport.js');
const routes = require('./routes/index.js');
const port = process.env.PORT || 5000;

const MongoStore = require('connect-mongo')(session);
mongoose.Promise = global.Promise;
let connection = mongoose.connect(process.env.MONGOLAB_URI);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
  let app = express();
  app.use(flash());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(session({
    secret: 'keyboard king',
    resave: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db,
      clear_interval: 3600,
    }),
  }));
  app.use(cookieParser());
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(expressValidator());
  app.use(history());
  app.use(routes);
  app.use(express.static(__dirname + '/../public'));
  const server = app.listen(process.env.PORT || port || 5000, err => {
    if (err) throw(err);
    console.log('Server on:', port);
  });
  const io = require('socket.io')(server);
  let numUsers = 0;
  let connectedUsers = {};
  let gameMaster = null;
  io.on('connection', socket => {
    numUsers++;
    connectedUsers[socket.id] = socket;
    console.log(' a user connected; number of current users is now', numUsers);
    
    socket.on('update user count', () => {
      io.emit('userCountUpdate', numUsers);
    });

    socket.on('am i game master?', () => {
      if (numUsers == 1 || gameMaster == socket.id || gameMaster == null) {
        gameMaster = socket.id;
        connectedUsers[socket.id].emit('gameMaster', true);
      } else {
        socket.to(JSON.stringify(socket.id)).emit('gameMaster', false);
      }
    });

    socket.on('disconnect', () => {
      numUsers--;
      socket.broadcast.emit('userCountUpdate', numUsers);
      delete connectedUsers[socket.id];
      console.log('user disconnected; number of current users is now', numUsers);
      if (gameMaster == socket.id) {
        let UserKeys = Object.keys(connectedUsers);
        gameMaster = UserKeys.length > 0 ? UserKeys[0] : null;
        if (gameMaster) connectedUsers[gameMaster].emit('gameMaster', true);
      }
    });

    socket.on('I won, suckers', function() {
      socket.broadcast.emit('You all lost');
    });

    socket.on('draw lottery ball', function(data) {
      io.emit('new lottery ball', data);
    });

    socket.on('reset all boards', function() {
      io.emit('resetting boards');
    });
  });
});

module.exports = connection;