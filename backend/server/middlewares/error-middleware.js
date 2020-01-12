const _ = require('lodash');

const LOGGER_PREFIX = 'ERROR_MIDDLEWARE';

const errorMiddleware = (error, request, response, next) => { // eslint-disable-line no-unused-vars
  const requestRoute = request.route
    ? request.route.path
    : request.originalUrl;

  request.logger.error({
    prefix: LOGGER_PREFIX,
    message: JSON.stringify({
      request_url: request.url,
      request_method: request.method,
      request_headers: _.omit(request.headers, ['Authorization', 'authorization', 'cookie']),
      request_body: request.body,
      request_params: request.params,
      request_query: request.query,
    }),
  });
  request.logger.error(error);

  request.logger.info({
    prefix: LOGGER_PREFIX,
    message: `method=${request.method} path=${requestRoute} status=500 duration=${Date.now() - request.startedAt}`,
  });

  return response
    .status(500)
    .json({
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      request_id: request.requestId,
    });
};

module.exports = errorMiddleware;
