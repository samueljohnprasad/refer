import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFollower extends Document {
  user: Types.ObjectId;
  followedUser: Types.ObjectId;
  createdAt: Date;
}

const FollowerSchema = new Schema<IFollower>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only follow another user once
FollowerSchema.index({ user: 1, followedUser: 1 }, { unique: true });

const Follower = mongoose.model<IFollower>('Follower', FollowerSchema);
export default Follower;
