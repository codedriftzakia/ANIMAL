import { Router } from 'express';
import {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} from '../controllers/feedbackController';

const router = Router();

router.get('/', getFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id/status', updateFeedbackStatus);
router.delete('/:id', deleteFeedback);

export default router;
