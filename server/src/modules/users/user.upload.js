import multer from 'multer';

import { AppError } from '../../shared/errors/app-error.js';

import {
  AVATAR_MIME_TYPES,
  AVATAR_LIMITS,
  AVATAR_FIELD,
} from '../../shared/constants/user.constants.js';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (!AVATAR_MIME_TYPES.includes(file.mimetype)) {
    cb(new AppError('Only JPG, PNG, and WEBP images are allowed', 400));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: AVATAR_LIMITS.FILE_SIZE,
  },
  fileFilter,
});

export const uploadSingleAvatar = (req, res, next) => {
  upload.single(AVATAR_FIELD)(req, res, (error) => {
    if (
      error instanceof multer.MulterError &&
      error.code === 'LIMIT_FILE_SIZE'
    ) {
      next(new AppError('Profile photo size cannot exceed 2MB', 400));
      return;
    }

    if (error) {
      next(error);
      return;
    }

    next();
  });
};
