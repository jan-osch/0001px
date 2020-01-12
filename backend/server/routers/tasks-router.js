const express = require('express');
const Joi = require('joi');

const { validateBody, validateParams } = require('../middlewares/validation-middleware');
const requireAuthenticated = require('../middlewares/require-authenticated');
const promiseMiddleware = require('../middlewares/promise-middleware');
const TasksQueries = require('../../queries/tasks-queries');

const tasksRouter = express.Router();

const createBodyTaskSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().default(''),
  complete_until: Joi.string().isoDate().default(null),
  remind_at: Joi.string().isoDate().default(null),
});

const updateBodyTaskSchema = Joi.object({
  title: Joi.string().min(2),
  description: Joi.string(),
  complete_until: Joi.string().isoDate(),
  remind_at: Joi.string().isoDate(),
  complete: Joi.boolean(),
}).min(1);

const taskIdParamsSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

const validateDates = (form) => {
  if (form.complete_until) {
    if (Date.now() > new Date(form.complete_until).getTime()) {
      return { success: false, message: 'complete_until must be a future date' };
    }
  }

  if (form.remind_at) {
    if (Date.now() > new Date(form.remind_at).getTime()) {
      return { success: false, message: 'remind_at must be a future date' };
    }
  }

  return { success: true };
};

tasksRouter.use(requireAuthenticated);

tasksRouter.get('/',
  promiseMiddleware(async () => {
    const data = await TasksQueries.findAll({});
    return { data };
  }));

tasksRouter.post('/',
  validateBody(createBodyTaskSchema),
  promiseMiddleware(async ({ body }) => {
    const { success, message } = validateDates(body);
    if (!success) {
      return {
        status: 400,
        error: {
          code: 'INVALID_REQUEST_BODY',
          message,
        },
      };
    }

    const data = await TasksQueries.create({ task: body });
    return { data };
  }));

tasksRouter.get('/:id',
  validateParams(taskIdParamsSchema),
  promiseMiddleware(async ({ params }) => {
    const data = await TasksQueries.findById(params);
    if (!data) {
      return {
        status: 404,
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      };
    }

    return { data };
  }));

tasksRouter.patch('/:id',
  validateParams(taskIdParamsSchema),
  validateBody(updateBodyTaskSchema),
  promiseMiddleware(async ({ params, body }) => {
    const { success, message } = validateDates(body);
    if (!success) {
      return {
        status: 400,
        error: {
          code: 'INVALID_REQUEST_BODY',
          message,
        },
      };
    }

    const data = await TasksQueries.updateOne({ id: params.id, update: body });

    if (!data) {
      return {
        status: 404,
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      };
    }

    return { data };
  }));

tasksRouter.delete('/:id',
  validateParams(taskIdParamsSchema),
  promiseMiddleware(async ({ params }) => {
    const data = await TasksQueries.deleteOne(params);

    if (!data) {
      return {
        status: 404,
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      };
    }

    return { data };
  }));

module.exports = tasksRouter;
