const uuid = require('uuid/v4');
const logger = require('../../utils/logger');

const assignLogger = (request, response, next) => {
  request.requestId = request.get('X-Request-ID') || uuid();
  request.logger = logger.child({ requestId: request.requestId });
  request.startedAt = Date.now();
  response.set('request-id', request.requestId);

  return next();
};

module.exports = assignLogger;
