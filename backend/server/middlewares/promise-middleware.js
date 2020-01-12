const promiseMiddleware = (action) => (
  async (request, response, next) => {
    try {
      const { data, status = 200, error } = await action({
        body: request.body,
        query: request.query,
        params: request.params,
        logger: request.logger,
        user: request.user,
        request,
        response,
      });

      response.status(status).json(error || { data });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = promiseMiddleware;
