import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVerification extends Document {
  user: Types.ObjectId;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  method: string;
  createdAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    method: {
      type: String,
      required: true,
      enum: ['email', 'sms'],
    },
  },
  {
    timestamps: true,
  }
);

const Verification = mongoose.model<IVerification>('Verification', VerificationSchema);
export default Verification;
