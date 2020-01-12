const config = require('config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const mongoDb = require('../../connections/mongo-db').connection;

const COOKIE_SECRET = config.get('server.cookie.secret');

const sessionMiddleware = session({
  secret: COOKIE_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoDb,
  }),
  resave: false,
  saveUninitialized: false,
});

module.exports = sessionMiddleware;
