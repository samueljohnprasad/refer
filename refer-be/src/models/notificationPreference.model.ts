import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotificationPreference extends Document {
  user: Types.ObjectId;
  channel: string;
  isEnabled: boolean;
  updatedAt: Date;
}

const NotificationPreferenceSchema = new Schema<INotificationPreference>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channel: {
      type: String,
      required: true,
      enum: ['email', 'push', 'sms', 'whatsapp'],
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one preference per user per channel
NotificationPreferenceSchema.index(
  { user: 1, channel: 1 },
  { unique: true }
);

const NotificationPreference = mongoose.model<INotificationPreference>(
  'NotificationPreference',
  NotificationPreferenceSchema
);

export default NotificationPreference;
