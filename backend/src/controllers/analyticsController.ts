import { Request, Response } from 'express';
import Animal from '../models/Animal';
import Feedback from '../models/Feedback';

export async function getAnalyticsSummary(req: Request, res: Response) {
  try {
    const totalAnimals = await Animal.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const urgentAlertsCount = await Feedback.countDocuments({ 
      $or: [{ sentiment: 'URGENT ALERT' }, { isUrgent: true }] 
    });

    const animals = await Animal.find();
    let totalHealth = 0;
    animals.forEach((a) => (totalHealth += a.healthIndex));
    const avgWelfareScore = totalAnimals > 0 ? Math.round(totalHealth / totalAnimals) : 85;

    // Sentiment breakdown
    const positiveCount = await Feedback.countDocuments({ sentiment: 'POSITIVE' });
    const neutralCount = await Feedback.countDocuments({ sentiment: 'NEUTRAL' });
    const urgentCount = await Feedback.countDocuments({ sentiment: 'URGENT ALERT' });

    // Status breakdown
    const pendingCount = await Feedback.countDocuments({ status: 'Pending' });
    const underReviewCount = await Feedback.countDocuments({ status: 'Under Review' });
    const resolvedCount = await Feedback.countDocuments({ status: 'Resolved' });
    const highlightedCount = await Feedback.countDocuments({ status: 'Highlighted' });

    // Recent urgent feedback list
    const recentUrgent = await Feedback.find({ 
      $or: [{ sentiment: 'URGENT ALERT' }, { isUrgent: true }] 
    })
      .populate('animalId', 'name species imageUrl')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        summary: {
          totalAnimals,
          totalFeedback,
          urgentAlertsCount,
          avgWelfareScore,
        },
        sentimentDistribution: {
          positive: positiveCount,
          neutral: neutralCount,
          urgent: urgentCount,
        },
        statusDistribution: {
          pending: pendingCount,
          underReview: underReviewCount,
          resolved: resolvedCount,
          highlighted: highlightedCount,
        },
        recentUrgentAlerts: recentUrgent,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
