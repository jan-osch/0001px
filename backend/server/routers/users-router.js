const express = require('express');
const { promisify } = require('util');
const Joi = require('joi');

const { validateBody } = require('../middlewares/validation-middleware');
const promiseMiddleware = require('../middlewares/promise-middleware');
const registerUser = require('../../use-cases/users/register-user');
const loginUser = require('../../use-cases/users/login-user');
const requireAuthenticated = require('../middlewares/require-authenticated');
const forbidAuthenticated = require('../middlewares/forbid-authenticated');

const usersRouter = express.Router();

const presentUser = (user) => ({
  _id: user._id,
  email: user.email,
  register_at: user.created_at,
});

const loginFormSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

usersRouter.post('/login',
  forbidAuthenticated,
  validateBody(loginFormSchema),
  promiseMiddleware(async ({ body, request, logger }) => {
    const { user, success, message } = await loginUser({ ...body, logger });
    if (!success) {
      return {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message,
        },
      };
    }

    request.session.user = user;
    await promisify((cb) => request.session.save(cb));
    return { data: presentUser(user) };
  }));

usersRouter.post('/logout',
  requireAuthenticated,
  promiseMiddleware(async ({ request, user, logger }) => {
    request.session.destroy();
    logger.debug('Successful logout.');

    return { data: presentUser(user) };
  }));

usersRouter.post('/register',
  forbidAuthenticated,
  validateBody(loginFormSchema),
  promiseMiddleware(async ({ body, logger, request }) => {
    const { success, user, message } = await registerUser({ ...body, logger });

    if (!success) {
      return {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message,
        },
      };
    }

    request.session.user = user;
    await promisify((cb) => request.session.save(cb));

    return { status: 201, data: presentUser(user) };
  }));

usersRouter.get('/me',
  requireAuthenticated,
  promiseMiddleware(async ({ user }) => ({ data: presentUser(user) })));

module.exports = usersRouter;
