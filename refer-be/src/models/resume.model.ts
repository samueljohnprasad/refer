import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IResume extends Document {
  user: Types.ObjectId;
  fileUrl: string;
  uploadDate: Date;
  isValidated: boolean;
}

const ResumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    isValidated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
export default Resume;
