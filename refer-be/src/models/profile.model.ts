import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProfile extends Document {
  user: Types.ObjectId;
  username: string;
  fullName?: string;
  headline?: string;
  summary?: string;
  experience?: string;
  skills?: string[];
  contactEmail?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  privacySettings?: {
    showEmail: boolean;
    showLocation: boolean;
    showSocialLinks: boolean;
    isPublicProfile: boolean;
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
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens']
    },
    fullName: {
      type: String,
      trim: true,
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
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
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
      showEmail: {
        type: Boolean,
        default: false,
      },
      showLocation: {
        type: Boolean,
        default: true,
      },
      showSocialLinks: {
        type: Boolean,
        default: true,
      },
      isPublicProfile: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for username lookups
ProfileSchema.index({ username: 1 });

const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;
