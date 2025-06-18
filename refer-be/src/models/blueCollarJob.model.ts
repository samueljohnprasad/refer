import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBlueCollarJob extends Document {
  company: Types.ObjectId;
  title: string;
  description: string;
  skillsRequired: string[];
  location?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlueCollarJobSchema = new Schema<IBlueCollarJob>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skillsRequired: [{
      type: String,
      trim: true,
    }],
    location: {
      type: String,
      trim: true,
    },
    salaryRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
      period: {
        type: String,
        enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching blue collar jobs
BlueCollarJobSchema.index({ title: 'text', description: 'text', 'skillsRequired': 'text' });
BlueCollarJobSchema.index({ isActive: 1, company: 1 });

const BlueCollarJob = mongoose.model<IBlueCollarJob>('BlueCollarJob', BlueCollarJobSchema);
export default BlueCollarJob;
