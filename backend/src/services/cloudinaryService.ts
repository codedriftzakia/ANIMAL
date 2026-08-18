import cloudinary from '../config/cloudinary';

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'faunapulse_feedback',
  filename?: string
): Promise<string> {
  // If Cloudinary API credentials are valid live credentials, upload to Cloudinary.
  // Otherwise, fallback to a clean base64 data URI format so uploads never fail.
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'faunapulse_demo' &&
    process.env.CLOUDINARY_API_KEY !== '1234567890';

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.warn('Cloudinary upload warning, using buffer fallback:', error.message);
            const base64 = fileBuffer.toString('base64');
            resolve(`data:image/jpeg;base64,${base64}`);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            const base64 = fileBuffer.toString('base64');
            resolve(`data:image/jpeg;base64,${base64}`);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Graceful fallback when running locally without active Cloudinary credentials:
  const base64 = fileBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}
