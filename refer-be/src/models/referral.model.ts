import mongoose, { Document, Schema, Types } from 'mongoose';

export enum ReferralStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export interface IReferral extends Document {
  referrer: Types.ObjectId;
  candidate: Types.ObjectId;
  jobPost: Types.ObjectId;
  status: ReferralStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobPost: {
      type: Schema.Types.ObjectId,
      ref: 'JobPost',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ReferralStatus),
      default: ReferralStatus.PENDING,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate referrals for the same candidate and job post
ReferralSchema.index(
  { candidate: 1, jobPost: 1 },
  { unique: true }
);

const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);
export default Referral;
