import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IJobSeekerPost extends Document {
  user: Types.ObjectId;
  title: string;
  interestStatement: string;
  skills: string[];
  experience: string;
  education: string;
  resumeFile?: string;
  privacyOption: 'Public' | 'Private' | 'Anonymous';
  expiresAt: Date;
  status: 'active' | 'expired' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const JobSeekerPostSchema = new Schema<IJobSeekerPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    interestStatement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    experience: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    education: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    resumeFile: {
      type: String,
      trim: true,
    },
    privacyOption: {
      type: String,
      enum: ['Public', 'Private', 'Anonymous'],
      default: 'Public',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
JobSeekerPostSchema.index({ user: 1, status: 1 });
JobSeekerPostSchema.index({ status: 1, expiresAt: 1 });
JobSeekerPostSchema.index({ privacyOption: 1, status: 1 });

const JobSeekerPost = mongoose.model<IJobSeekerPost>('JobSeekerPost', JobSeekerPostSchema);
export default JobSeekerPost; 