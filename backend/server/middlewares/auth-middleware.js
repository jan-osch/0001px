
const authMiddleware = async (request, response, next) => {
  if (request.session.user) {
    request.user = request.session.user;
  }

  return next();
};

module.exports = authMiddleware;
