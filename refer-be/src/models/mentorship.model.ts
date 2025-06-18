import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMentorship extends Document {
  mentor: Types.ObjectId;
  mentee: Types.ObjectId;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  startDate?: Date;
  endDate?: Date;
  goals?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipSchema = new Schema<IMentorship>(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'rejected'],
      default: 'pending',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(this: IMentorship, value: Date) {
          return !this.startDate || !value || value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    goals: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Ensure one active mentorship per mentor-mentee pair
MentorshipSchema.index(
  { mentor: 1, mentee: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'active'] } } }
);

const Mentorship = mongoose.model<IMentorship>('Mentorship', MentorshipSchema);
export default Mentorship;
