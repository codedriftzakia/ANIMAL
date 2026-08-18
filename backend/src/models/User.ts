import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  role: 'Visitor' | 'Volunteer' | 'Caretaker' | 'Veterinarian';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { 
      type: String, 
      enum: ['Visitor', 'Volunteer', 'Caretaker', 'Veterinarian'], 
      default: 'Visitor' 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
