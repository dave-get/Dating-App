import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: UploadApiOptions = {
        folder: process.env.CLOUDINARY_FOLDER,
        resource_type: 'image',
        public_id: filename?.split('.')?.[0],
        ...options,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            console.log('Cloudinary upload error:', error);
            return reject(
              new InternalServerErrorException('Image upload failed'),
            );
          }
          resolve(result);
        },
      );

      uploadStream.end(buffer);
    });
  }
}
