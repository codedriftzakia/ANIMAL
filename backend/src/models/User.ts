import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'Visitor' | 'Volunteer' | 'Caretaker' | 'Veterinarian';
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { 
      type: String, 
      enum: ['Visitor', 'Volunteer', 'Caretaker', 'Veterinarian'], 
      default: 'Visitor' 
    },
    organization: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
