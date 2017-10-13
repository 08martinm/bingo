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
  app.listen(process.env.PORT || port || 5000, () => console.log('Server on:', port));
});

module.exports = connection;