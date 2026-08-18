import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimal extends Document {
  name: string;
  species: string;
  habitat: string;
  careTier: 'Critical' | 'High Attention' | 'Standard' | 'Optimal';
  imageUrl: string;
  healthIndex: number; // 0 to 100
  mood: 'Vibrant' | 'Calm' | 'Playful' | 'Reserved' | 'Needs Attention';
  feedbackCount: number;
  avgRating: number;
  tagline: string;
  bio: string;
  specialNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    habitat: { type: String, required: true },
    careTier: { 
      type: String, 
      enum: ['Critical', 'High Attention', 'Standard', 'Optimal'], 
      default: 'Standard' 
    },
    imageUrl: { type: String, required: true },
    healthIndex: { type: Number, min: 0, max: 100, default: 85 },
    mood: { 
      type: String, 
      enum: ['Vibrant', 'Calm', 'Playful', 'Reserved', 'Needs Attention'], 
      default: 'Vibrant' 
    },
    feedbackCount: { type: Number, default: 0 },
    avgRating: { type: Number, default: 4.5 },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    specialNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IAnimal>('Animal', AnimalSchema);
