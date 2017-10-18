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
  let rooms = {};
  io.on('connection', socket => {
    let currRoom = null;

    let updateRoomsAndUsers = () => {
      let response = {};
      Object.keys(rooms).forEach(key => {
        response[key] = rooms[key].numUsers;
      });
      io.emit('update rooms and users', response);
    };

    socket.on('join', (room) => {
      socket.join(room);
      if (rooms.hasOwnProperty(room)) {
        rooms[room].connectedUsers[socket.id] = socket;
      } else {
        rooms[room] = {numUsers: 0, gameMaster: socket.id, connectedUsers: {}};
        rooms[room].connectedUsers[socket.id] = socket;
        io.to(socket.id).emit('gameMaster');
      }
      rooms[room].numUsers++;
      io.to(room).emit('userCountUpdate', rooms[room].numUsers);
      currRoom = room;
      updateRoomsAndUsers();
    });

    let leaveRoom = room => {
      socket.leave(room);
      if(rooms.hasOwnProperty(room) && rooms[room].connectedUsers.hasOwnProperty(socket.id)) {
        rooms[room].numUsers--;
        socket.broadcast.to(room).emit('userCountUpdate', rooms[room].numUsers);
        delete rooms[room].connectedUsers[socket.id];
        if (rooms[room].gameMaster == socket.id) {
          let UserKeys = Object.keys(rooms[room].connectedUsers);
          rooms[room].gameMaster = UserKeys.length > 0 ? UserKeys[0] : null;
          if (rooms[room].gameMaster != null) {
            io.to(rooms[room].gameMaster).emit('gameMaster');
          } else {
            delete rooms[room];
            socket.broadcast.emit('delete room');
          }
        }
      }
      updateRoomsAndUsers();
    };

    socket.on('leave', room => leaveRoom(room));
    socket.on('disconnect', () => leaveRoom(currRoom));
    socket.on('I won, suckers', room => socket.broadcast.to(room).emit('You all lost'));
    socket.on('reset all boards', room => io.to(room).emit('resetting boards'));
    socket.on('draw lottery ball', (data, room) => io.to(room).emit('new lottery ball', data));
    socket.on('get rooms and users', () => updateRoomsAndUsers());
  });
});

module.exports = connection;