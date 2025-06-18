import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAd extends Document {
  company: Types.ObjectId;
  content: string;
  imageUrl?: string;
  link?: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
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

// Index for fetching active ads that haven't expired
AdSchema.index({ isActive: 1, expiresAt: 1 });

const Ad = mongoose.model<IAd>('Ad', AdSchema);
export default Ad;
