import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: Types.ObjectId;
  type: 'NEW_REFERRAL' | 'POST_EXPIRING' | 'MENTION';
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['NEW_REFERRAL', 'POST_EXPIRING', 'MENTION'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Notification = model<INotification>('Notification', notificationSchema);

export default Notification; 