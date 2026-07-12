import mongoose from 'mongoose';

import { cleanProjectName, normalizeProjectName } from './project.utils.js';

import {
  PROJECT_PRIORITY,
  PROJECT_PRIORITY_VALUES,
  PROJECT_STATUS,
  PROJECT_STATUS_VALUES,
} from './project.constants.js';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },

    normalizedName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      select: false,
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Project description cannot exceed 1000 characters'],
    },

    status: {
      type: String,
      enum: PROJECT_STATUS_VALUES,
      default: PROJECT_STATUS.PLANNING,
    },

    priority: {
      type: String,
      enum: PROJECT_PRIORITY_VALUES,
      default: PROJECT_PRIORITY.MEDIUM,
    },

    startDate: {
      type: Date,
      default: null,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project creator is required'],
      immutable: true,
    },

    projectLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project lead is required'],
    },

    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ normalizedName: 1 }, { unique: true });

projectSchema.index({ members: 1, status: 1, dueDate: 1 });
projectSchema.index({ projectLead: 1, status: 1, dueDate: 1 });

projectSchema.pre('validate', function () {
  if (this.isModified('name') && typeof this.name === 'string') {
    this.name = cleanProjectName(this.name);
    this.normalizedName = normalizeProjectName(this.name);
  }
});

projectSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate) return false;

  const now = new Date();

  return this.dueDate < now && this.status !== PROJECT_STATUS.COMPLETED;
});

projectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.normalizedName;

    return ret;
  },
});

export const Project = mongoose.model('Project', projectSchema);
