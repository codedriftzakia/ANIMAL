import { Request, Response } from 'express';
import { uploadToCloudinary } from '../services/cloudinaryService';

export async function uploadImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const folder = (req.body.folder as string) || 'faunapulse';
    const filename = req.file.originalname;

    const imageUrl = await uploadToCloudinary(req.file.buffer, folder, filename);

    res.json({
      success: true,
      url: imageUrl,
      message: 'Image successfully uploaded to Cloudinary',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
