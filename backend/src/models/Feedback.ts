import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedbackRatings {
  overall: number; // 1-5
  welfare: number; // 1-5
  enclosure: number; // 1-5
  interaction: number; // 1-5
}

export interface IFeedback extends Document {
  animalId: mongoose.Types.ObjectId;
  userName: string;
  userRole: 'Visitor' | 'Volunteer' | 'Caretaker' | 'Veterinarian';
  ratings: IFeedbackRatings;
  tags: string[];
  comment: string;
  imageUrl?: string;
  isUrgent: boolean;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'URGENT ALERT';
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Highlighted';
  staffNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    animalId: { type: Schema.Types.ObjectId, ref: 'Animal', required: true },
    userName: { type: String, required: true },
    userRole: { 
      type: String, 
      enum: ['Visitor', 'Volunteer', 'Caretaker', 'Veterinarian'], 
      default: 'Visitor' 
    },
    ratings: {
      overall: { type: Number, required: true, min: 1, max: 5 },
      welfare: { type: Number, required: true, min: 1, max: 5 },
      enclosure: { type: Number, required: true, min: 1, max: 5 },
      interaction: { type: Number, required: true, min: 1, max: 5 },
    },
    tags: [{ type: String }],
    comment: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    isUrgent: { type: Boolean, default: false },
    sentiment: { 
      type: String, 
      enum: ['POSITIVE', 'NEUTRAL', 'URGENT ALERT'], 
      default: 'POSITIVE' 
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Under Review', 'Resolved', 'Highlighted'], 
      default: 'Pending' 
    },
    staffNote: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
