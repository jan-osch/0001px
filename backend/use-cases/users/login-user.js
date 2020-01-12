const { hashPassword } = require('../../utils/auth');
const UserQueries = require('../../queries/users-queries');

const LOGGER_PREFIX = 'LOGIN_USER';

const loginUser = async ({ email, password, logger }) => {
  const user = await UserQueries.findByEmail({ email });
  if (!user) {
    return { success: false, message: 'Incorrect username.' };
  }

  const hashedPassword = hashPassword(password, user.salt);
  if (hashedPassword !== user.password) {
    return { success: false, message: 'Incorrect password.' };
  }

  logger.debug({ prefix: LOGGER_PREFIX, message: `Successfully authenticated user: ${user._id}` });

  return { success: true, user };
};

module.exports = loginUser;
