import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

import { env } from '../../config/env.js';
import {
  USER_ROLE_VALUES,
  USER_ROLES,
  USER_STATUS,
  USER_STATUS_VALUES,
} from '../../shared/constants/user.constants.js';

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },

    lastName: {
      type: String,
      trim: true,
      default: '',
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address',
      },
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLES.EMPLOYEE,
    },

    status: {
      type: String,
      enum: USER_STATUS_VALUES,
      default: USER_STATUS.ACTIVE,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    temporaryPasswordExpiresAt: {
      type: Date,
      select: false,
    },

    refreshTokens: {
      type: [refreshTokenSchema],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1, status: 1 });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.password;
    delete ret.refreshTokens;

    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
