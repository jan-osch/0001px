const validateBody = (schema) => (request, response, next) => {
  const validationResult = schema.validate(request.body);

  if (validationResult.error) {
    return response
      .status(400)
      .json({
        code: 'INVALID_REQUEST_BODY',
        message: validationResult.error.details,
      });
  }

  request.body = validationResult.value;
  return next();
};

const validateParams = (schema) => (request, response, next) => {
  const validationResult = schema.validate(request.params);

  if (validationResult.error) {
    return response
      .status(400)
      .json({
        code: 'INVALID_REQUEST_PARAMS',
        message: validationResult.error.details,
      });
  }

  request.params = validationResult.value;
  return next();
};

module.exports = { validateBody, validateParams };
