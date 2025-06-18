import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChat extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  isRead: boolean;
  sentAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'sentAt',
      updatedAt: false,
    },
  }
);

// Index for faster querying of messages between two users
ChatSchema.index({ sender: 1, receiver: 1, sentAt: -1 });

const Chat = mongoose.model<IChat>('Chat', ChatSchema);
export default Chat;
