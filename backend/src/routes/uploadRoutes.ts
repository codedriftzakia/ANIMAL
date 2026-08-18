import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/', upload.single('image'), uploadImage);

export default router;
