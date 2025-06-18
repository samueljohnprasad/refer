import mongoose, { Document, Schema, Types } from 'mongoose';

export enum MetricType {
  REFERRAL_QUALITY = 'referral_quality',
  RESPONSE_RATE = 'response_rate',
  PROFILE_COMPLETENESS = 'profile_completeness',
  COMMUNITY_ENGAGEMENT = 'community_engagement',
  REFERRAL_ACCEPTANCE_RATE = 'referral_acceptance_rate',
}

export interface ITrustMetric extends Document {
  user: Types.ObjectId;
  type: MetricType;
  value: number;
  lastUpdated: Date;
}

const TrustMetricSchema = new Schema<ITrustMetric>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(MetricType),
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: {
      updatedAt: 'lastUpdated',
      createdAt: false,
    },
  }
);

// Ensure one metric per user per type
TrustMetricSchema.index(
  { user: 1, type: 1 },
  { unique: true }
);

// Index for sorting users by metric type
TrustMetricSchema.index({ type: 1, value: -1 });

const TrustMetric = mongoose.model<ITrustMetric>('TrustMetric', TrustMetricSchema);
export default TrustMetric;
