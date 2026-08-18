import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import Animal from '../models/Animal';
import { analyzeSentiment } from '../services/sentimentLogic';
import { recalculateAnimalWelfare } from '../services/welfareLogic';

// GET /api/feedback
export async function getFeedbacks(req: Request, res: Response) {
  try {
    const { animalId, sentiment, status, userRole, isUrgent, search } = req.query;
    const query: any = {};

    if (animalId) query.animalId = animalId;
    if (sentiment && sentiment !== 'All') query.sentiment = sentiment;
    if (status && status !== 'All') query.status = status;
    if (userRole && userRole !== 'All') query.userRole = userRole;
    if (isUrgent === 'true') query.isUrgent = true;

    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const feedbacks = await Feedback.find(query)
      .populate('animalId', 'name species imageUrl healthIndex mood')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/feedback/:id
export async function getFeedbackById(req: Request, res: Response) {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('animalId');
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/feedback
export async function createFeedback(req: Request, res: Response) {
  try {
    const { animalId, userName, userRole, ratings, tags, comment, imageUrl, isUrgent } = req.body;

    const animalExists = await Animal.findById(animalId);
    if (!animalExists) {
      return res.status(404).json({ success: false, message: 'Referenced Animal does not exist' });
    }

    // Dynamic Sentiment Analysis
    const sentiment = analyzeSentiment(comment || '', ratings, Boolean(isUrgent));

    const feedback = new Feedback({
      animalId,
      userName: userName || 'Anonymous Supporter',
      userRole: userRole || 'Visitor',
      ratings,
      tags: tags || [],
      comment,
      imageUrl: imageUrl || '',
      isUrgent: Boolean(isUrgent),
      sentiment,
      status: 'Pending',
    });

    await feedback.save();

    // Automatically recalculate target animal's welfare score & mood
    await recalculateAnimalWelfare(animalId);

    const populated = await Feedback.findById(feedback._id).populate('animalId');
    res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// PUT /api/feedback/:id/status
export async function updateFeedbackStatus(req: Request, res: Response) {
  try {
    const { status, staffNote } = req.body;
    const feedbackId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    if (status) feedback.status = status;
    if (staffNote !== undefined) feedback.staffNote = staffNote;

    await feedback.save();
    
    // Recalculate welfare in case status changed critical parameters
    await recalculateAnimalWelfare(feedback.animalId.toString());

    res.json({ success: true, data: feedback });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// DELETE /api/feedback/:id
export async function deleteFeedback(req: Request, res: Response) {
  try {
    const feedbackId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    // Recalculate welfare score after deletion
    await recalculateAnimalWelfare(feedback.animalId.toString());

    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
