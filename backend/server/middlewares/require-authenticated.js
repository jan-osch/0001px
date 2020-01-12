const requireAuthenticated = async (request, response, next) => {
  if (request.user) {
    return next();
  }

  return response
    .status(401)
    .json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
};

module.exports = requireAuthenticated;
