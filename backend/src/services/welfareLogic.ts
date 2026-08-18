import Animal from '../models/Animal';
import Feedback from '../models/Feedback';

export async function recalculateAnimalWelfare(animalId: string): Promise<void> {
  const animal = await Animal.findById(animalId);
  if (!animal) return;

  const feedbacks = await Feedback.find({ animalId });
  
  if (feedbacks.length === 0) {
    animal.healthIndex = 85;
    animal.mood = 'Vibrant';
    animal.careTier = 'Standard';
    animal.feedbackCount = 0;
    animal.avgRating = 4.5;
    await animal.save();
    return;
  }

  let totalWelfareRating = 0;
  let totalOverallRating = 0;
  let urgentAlertCount = 0;

  feedbacks.forEach((fb) => {
    totalWelfareRating += fb.ratings.welfare;
    totalOverallRating += fb.ratings.overall;
    if (fb.sentiment === 'URGENT ALERT' || fb.isUrgent) {
      urgentAlertCount++;
    }
  });

  const avgWelfare = totalWelfareRating / feedbacks.length;
  const avgOverall = totalOverallRating / feedbacks.length;

  // Base Health Index math: 1 to 5 scale maps to 20 to 100 base score
  let calculatedHealth = Math.round(avgWelfare * 20);

  // Penalty for urgent alerts
  calculatedHealth -= urgentAlertCount * 12;

  // Clamp health index between 10 and 100
  animal.healthIndex = Math.max(10, Math.min(100, calculatedHealth));
  animal.feedbackCount = feedbacks.length;
  animal.avgRating = Number(avgOverall.toFixed(1));

  // Determine Care Tier
  if (animal.healthIndex < 50 || urgentAlertCount > 1) {
    animal.careTier = 'Critical';
  } else if (animal.healthIndex < 70) {
    animal.careTier = 'High Attention';
  } else if (animal.healthIndex < 85) {
    animal.careTier = 'Standard';
  } else {
    animal.careTier = 'Optimal';
  }

  // Determine Mood State
  if (urgentAlertCount > 0 || animal.healthIndex < 55) {
    animal.mood = 'Needs Attention';
  } else if (avgOverall >= 4.5 && animal.healthIndex >= 85) {
    animal.mood = 'Vibrant';
  } else if (avgOverall >= 4.0) {
    animal.mood = 'Playful';
  } else if (avgOverall >= 3.0) {
    animal.mood = 'Calm';
  } else {
    animal.mood = 'Reserved';
  }

  await animal.save();
}
