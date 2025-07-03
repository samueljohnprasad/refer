import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserRole, BadgeType } from '../types/user.types';
import { AppError } from '../middlewares/error.middleware';

// Extend IUser with Document for Mongoose
export interface IUserDocument extends IUser, Document {
  username: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  pushTokens: string[];
}

// Create User Schema
const UserSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9.]+$/, 'Username can only contain letters, numbers, and dots']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function() {
        return this.isNew; // Only required for new users
      },
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
      sparse: true, // Allow null/undefined values to be unique
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    companyEmail: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allow null/undefined values to be unique
    },
    isCompanyEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.JOB_SEEKER,
    },
    badges: [{
      type: String,
      enum: Object.values(BadgeType),
    }],
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'connections'],
        default: 'public',
      },
      resumeVisibility: {
        type: String,
        enum: ['public', 'private', 'connections'],
        default: 'connections',
      },
      contactInfoVisibility: {
        type: String,
        enum: ['public', 'private', 'connections'],
        default: 'private',
      },
    },
    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      whatsapp: {
        type: Boolean,
        default: false,
      },
      referralUpdates: {
        type: Boolean,
        default: true,
      },
      chatMessages: {
        type: Boolean,
        default: true,
      },
      jobMatches: {
        type: Boolean,
        default: true,
      },
      platformUpdates: {
        type: Boolean,
        default: true,
      },
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpiry: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    pushTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Post-save hook to create a profile after a new user is created
import Profile from './profile.model';

UserSchema.post('save', async function (doc: IUserDocument, next: (err?: Error) => void) {
  try {
    // Always attempt to create a profile if one does not exist (for both new and existing users)
    const existingProfile = await Profile.findOne({ user: doc._id });
    if (!existingProfile) {
      console.log('Creating profile for user', doc._id);
      await Profile.create({
        user: doc._id,
      });
    }
  } catch (err) {
    console.error('Error ensuring profile for user:', err);
  }
  next();
});

// Pre-save hook to hash the password
// Pre-save hook to generate a unique username from firstName and lastName
UserSchema.pre<IUserDocument>('save', async function (next) {
  const user = this;
  console.log('User created: prev', user);

  if (user.isNew || user.isModified('firstName') || user.isModified('lastName')) {
    // Construct base username
    const base = `${user.firstName}.${user.lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '')
      .replace(/\.+/g, '.');
    let username = base;
    let suffix = 0;
    // Ensure uniqueness
    while (await mongoose.models.User.exists({ username })) {
      suffix += 1;
      username = `${base}${suffix}`;
    }
    user.username = username;
  }
  next();
});

// Pre-save hook to hash the password
UserSchema.pre<IUserDocument>('save', async function (next) {
  const user = this;
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the new salt
    const hash = await bcrypt.hash(user.password as string, salt);
    // Replace the plaintext password with the hash
    user.password = hash;
    next();
  } catch (error) {
    return next(error as Error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Create and export User model
const User = mongoose.model<IUserDocument>('User', UserSchema);
export default User;

// Removed schema-level index for username to avoid duplicate index warning.
