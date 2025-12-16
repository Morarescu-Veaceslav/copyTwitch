import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class StorageService {
    private readonly bucket: string;

    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
        });

        this.bucket = this.configService.getOrThrow<string>('CLOUDINARY_BUCKET') || '';
    }

    async uploadImage(buffer: Buffer, publicId: string, folder?: string): Promise<UploadApiResponse> {


        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: `twitch/${folder}`,  
                    public_id: publicId,  
                    format: 'webp',   
                    overwrite: true,
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('No result from Cloudinary'));
                    resolve(result);
                }
            );
            stream.end(buffer);
        });
    }
  
    
    async deleteImage(dbValue: string): Promise<{ result: string }> {
        const parts = dbValue.split('/');
        if (parts.length < 2) {
            throw new Error('Invalid avatar format');
        }

        const publicId = parts.slice(1).join('/');
        return cloudinary.uploader.destroy(publicId);
    }
}
