const crypto = require('crypto');

const randomChars = (bytes) => {
  const random = crypto.randomBytes(bytes);
  return random.toString('hex');
};

const hashPassword = (password, salt) => {
  const result = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return result.toString('hex');
};

module.exports = { randomChars, hashPassword };
