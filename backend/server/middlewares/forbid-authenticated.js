const forbidAuthenticated = async (request, response, next) => {
  if (!request.user) {
    return next();
  }

  return response
    .status(403)
    .json({
      code: 'FORBIDDEN',
      message: 'Action not available to already authenticated users',
    });
};

module.exports = forbidAuthenticated;
