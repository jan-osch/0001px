const compression = require('compression');
const express = require('express');
const config = require('config');
const { promisify } = require('util');

const connections = require('../connections/initialize');
const logger = require('../utils/logger');
const assignLogger = require('./middlewares/assign-logger');
const authMiddleware = require('./middlewares/auth-middleware');
const errorMiddleware = require('./middlewares/error-middleware');
const sessionMiddleware = require('./middlewares/session-middleware');
const usersRouter = require('./routers/users-router');
const tasksRouter = require('./routers/tasks-router');

const LOGGER_PREFIX = 'SERVER';
const PORT = config.get('server.port');

const main = async () => {
  const app = express();
  app.use(compression());
  app.use(express.json());
  app.use(assignLogger);
  app.use(logger.serverLogger);
  app.use(sessionMiddleware);
  app.use(authMiddleware);

  app.use('/users', usersRouter);
  app.use('/tasks', tasksRouter);

  app.use(errorMiddleware);

  await connections;
  await promisify((cb) => app.listen(PORT, cb))();

  logger.info({ prefix: LOGGER_PREFIX, message: `server listening on ${PORT}` });
};

module.exports = main();
