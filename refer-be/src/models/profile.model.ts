import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProfile extends Document {
  user: Types.ObjectId;
  summary?: string;
  experience?: string;
  skills?: string[];
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    skills: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;
