import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IJobPost extends Document {
  user: Types.ObjectId;
  company: Types.ObjectId;
  title: string;
  description: string;
  isPublic: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobPostSchema = new Schema<IJobPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    isPublic: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const JobPost = mongoose.model<IJobPost>('JobPost', JobPostSchema);
export default JobPost;
