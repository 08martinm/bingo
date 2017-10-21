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
const router = require('express').Router();

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
  router.post('/game', (req, res) => {
    console.log('inside of post to game and req.body is', req.body);
    if(allGames[req.body.room].password == req.body.password) {
      res.status(200).json(true);
    } else {
      res.status(501).json(false);
    }
  });
  app.use(router);
  const server = app.listen(process.env.PORT || port || 5000, err => {
    if (err) throw(err);
    console.log('Server on:', port);
  });

  const io = require('socket.io')(server);
  let allGames = {};


  io.on('connection', socket => {
    let currRoom = null;

    socket.on('create new room', data => {
      console.log('about to create a new room');
      if(allGames.hasOwnProperty(data.room)) {
        io.to(socket.id).emit('game already exists');
      } else {
        allGames[data.room] = {
          maxUsers: data.maxUsers,
          private: data.private,
          numUsers: 0,
          gameMaster: null,
          password: data.private ? data.roomPassword : null,
          connectedUsers: {},
        };
        io.to(socket.id).emit('game created', data.room);
      }
    });

    let updateRoomsAndUsers = () => {
      let response = {};
      Object.keys(allGames).forEach(key => {
        response[key] = {};
        response[key].numUsers = allGames[key].numUsers;
        response[key].private = allGames[key].private;
        response[key].maxUsers = allGames[key].maxUsers;
      });
      io.emit('update rooms and users', response);
    };

    socket.on('join', room => {
      if (allGames.hasOwnProperty(room) && allGames[room].numUsers >= allGames[room].maxUsers) {
        io.to(socket.id).emit('this game is full');
      } else {
        socket.join(room);
        allGames[room].connectedUsers[socket.id] = socket;
        allGames[room].numUsers++;
        if (allGames[room].gameMaster == null) {
          allGames[room].gameMaster = socket.id;
          io.to(socket.id).emit('gameMaster');
        }
        io.to(socket.id).emit('initialize game', {
          maxUsers: allGames[room].maxUsers,
          private: allGames[room].private,
          numUsers: allGames[room].numUsers,
        });
        socket.broadcast.to(room).emit('userCountUpdate', allGames[room].numUsers);
        currRoom = room;
        updateRoomsAndUsers();
      }
    });

    let leaveRoom = room => {
      socket.leave(room);
      if(allGames.hasOwnProperty(room) && allGames[room].connectedUsers.hasOwnProperty(socket.id)) {
        allGames[room].numUsers--;
        socket.broadcast.to(room).emit('userCountUpdate', allGames[room].numUsers);
        delete allGames[room].connectedUsers[socket.id];
        if (allGames[room].gameMaster == socket.id) {
          let UserKeys = Object.keys(allGames[room].connectedUsers);
          allGames[room].gameMaster = UserKeys.length > 0 ? UserKeys[0] : null;
          if (allGames[room].gameMaster != null) {
            io.to(allGames[room].gameMaster).emit('gameMaster');
          } else {
            delete allGames[room];
            socket.broadcast.emit('delete room');
            console.log('deleted room', room, 'and told everyone to update');
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
