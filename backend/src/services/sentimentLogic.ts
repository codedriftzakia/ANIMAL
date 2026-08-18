export function analyzeSentiment(
  comment: string,
  ratings: { overall: number; welfare: number; enclosure: number; interaction: number },
  isUrgentFlag: boolean
): 'POSITIVE' | 'NEUTRAL' | 'URGENT ALERT' {
  if (isUrgentFlag) return 'URGENT ALERT';

  const lowerComment = comment.toLowerCase();
  
  const urgentKeywords = [
    'sick', 'injured', 'lethargic', 'limping', 'blood', 'wound', 'bleeding',
    'dirty water', 'empty bowl', 'cage damage', 'broken fence', 'emergency',
    'crying', 'distress', 'vomiting', 'pain', 'neglect', 'hazard'
  ];

  const positiveKeywords = [
    'happy', 'playful', 'active', 'healthy', 'energetic', 'loving',
    'clean', 'enrichment', 'wonderful', 'amazing', 'great', 'loving care',
    'well fed', 'thriving', 'joyful', 'content'
  ];

  const hasUrgentKeyword = urgentKeywords.some((word) => lowerComment.includes(word));
  const avgRating = (ratings.overall + ratings.welfare + ratings.enclosure + ratings.interaction) / 4;

  if (hasUrgentKeyword || avgRating <= 2.0 || ratings.welfare <= 2) {
    return 'URGENT ALERT';
  }

  const hasPositiveKeyword = positiveKeywords.some((word) => lowerComment.includes(word));
  if (avgRating >= 3.8 || hasPositiveKeyword) {
    return 'POSITIVE';
  }

  return 'NEUTRAL';
}
