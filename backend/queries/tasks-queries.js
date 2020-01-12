const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  complete_until: {
    type: Date,
    default: null,
  },
  remind_at: {
    type: Date,
    default: null,
  },
});

const TaskModel = mongoose.model('tasks', taskSchema);

class TasksQueries {
  static async create({ task }) {
    return TaskModel.create(task);
  }

  static async findAll() {
    return TaskModel.find();
  }

  static async findById({ id }) {
    return TaskModel.findOne({ _id: id });
  }

  static async updateOne({ id, update }) {
    await TaskModel.updateOne({ _id: id }, update);
    return TaskModel.findOne({ _id: id });
  }

  static async deleteOne({ id }) {
    return TaskModel.findOneAndRemove({ _id: id });
  }
}

module.exports = TasksQueries;
