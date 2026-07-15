import mongoose from 'mongoose';

import {
  TASK_PRIORITY,
  TASK_PRIORITY_VALUES,
  TASK_STATUS,
  TASK_STATUS_VALUES,
} from './task.constants.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Task title must be at least 2 characters'],
      maxlength: [150, 'Task title cannot exceed 150 characters'],
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Task description cannot exceed 2000 characters'],
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Task project is required'],
      immutable: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task assignee is required'],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task creator is required'],
      immutable: true,
    },

    status: {
      type: String,
      enum: TASK_STATUS_VALUES,
      default: TASK_STATUS.TODO,
    },

    priority: {
      type: String,
      enum: TASK_PRIORITY_VALUES,
      default: TASK_PRIORITY.MEDIUM,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ project: 1, status: 1, dueDate: 1 });
taskSchema.index({ assignedTo: 1, status: 1, dueDate: 1 });
taskSchema.index({ createdBy: 1, createdAt: -1 });

taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate) return false;

  const now = new Date();

  return (
    this.dueDate < now &&
    this.status !== TASK_STATUS.COMPLETED &&
    this.status !== TASK_STATUS.ARCHIVED
  );
});

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;

    return ret;
  },
});

export const Task = mongoose.model('Task', taskSchema);
