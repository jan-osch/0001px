const winston = require('winston');
const morgan = require('morgan');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

const LOG_FORMAT = ':method :url :status :requestId :res[content-length] - :response-time ms';
morgan.token('requestId', (req) => req.requestId);
logger.serverLogger = morgan(LOG_FORMAT, {
  stream: {
    write(data) {
      logger.info(data);
    },
  },
});

module.exports = logger;
