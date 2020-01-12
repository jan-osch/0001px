const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model('users', userSchema);

class UsersQueries {
  static async findByEmail({ email }) {
    return UserModel.findOne({ email });
  }

  static async findById({ _id }) {
    return UserModel.findOne({ _id });
  }

  static async createUser({ user }) {
    return UserModel.create(user);
  }
}

module.exports = UsersQueries;
