const mongoose = require('mongoose');
const config = require('config');

const logger = require('../utils/logger');

const LOGGER_PREFIX = 'MONGO_DB';
const MONGODB_URI = config.get('mongo.url');

// Required to disable deprecation warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const main = async () => {
  mongoose.connection.on('error', (error) => logger.error({ prefix: LOGGER_PREFIX, error }));

  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  logger.info({ prefix: LOGGER_PREFIX, message: 'connected successfully' });
};

module.exports.initialize = main();
module.exports.connection = mongoose.connection;
