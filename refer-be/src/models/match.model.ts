import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMatch extends Document {
  user: Types.ObjectId;
  jobPost: Types.ObjectId;
  score: number;
  isViewed: boolean;
  isInterested?: boolean;
  matchedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobPost: {
      type: Schema.Types.ObjectId,
      ref: 'JobPost',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
    isInterested: {
      type: Boolean,
    },
  },
  {
    timestamps: {
      createdAt: 'matchedAt',
      updatedAt: true,
    },
  }
);

// Ensure one match per user and job post
MatchSchema.index(
  { user: 1, jobPost: 1 },
  { unique: true }
);

// Index for finding best matches for a user
MatchSchema.index({ user: 1, score: -1 });

// Index for finding users matched to a job post
MatchSchema.index({ jobPost: 1, score: -1 });

const Match = mongoose.model<IMatch>('Match', MatchSchema);
export default Match;
