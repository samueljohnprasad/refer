import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProfile extends Document {
  user: Types.ObjectId;
  headline?: string;
  summary?: string;
  experience?: string;
  skills?: string[];
  location?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  privacySettings?: {
    showLocation: boolean;
    showSocialLinks: boolean;
  };
  updatedAt: Date;
  createdAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 120,
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
    location: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },
    privacySettings: {
      showLocation: {
        type: Boolean,
        default: true,
      },
      showSocialLinks: {
        type: Boolean,
        default: true,
      }
    },
  },
  {
    timestamps: true,
  }
);



const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;
