import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new HttpException(
        'Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
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
