const { hashPassword, randomChars } = require('../../utils/auth');
const UserQueries = require('../../queries/users-queries');

const LOGGER_PREFIX = 'REGISTER_USER';

const registerUser = async ({ email, password, logger }) => {
  const existingUser = await UserQueries.findByEmail({ email });
  if (existingUser) {
    return { success: false, message: 'That email is already taken.' };
  }

  const salt = randomChars(32);
  const user = await UserQueries.createUser({
    user: {
      email,
      salt,
      password: hashPassword(password, salt),
    },
  });

  logger.debug({ prefix: LOGGER_PREFIX, message: `Registered a new user: ${user._id}` });

  return { success: true, user };
};

module.exports = registerUser;
