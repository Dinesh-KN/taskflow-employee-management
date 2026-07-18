import { cloudinary } from '../../config/cloudinary.js';
import { env } from '../../config/env.js';

export const uploadCloudinaryImage = async ({ buffer, userId }) => {
  return new Promise((resolve, reject) => {
    const publicId = `${userId}-${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinary.profilePhotoFolder,
        public_id: publicId,
        resource_type: 'image',
        transformation: [
          {
            width: 400,
            height: 400,
            crop: 'fill',
            gravity: 'face',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  });
};
