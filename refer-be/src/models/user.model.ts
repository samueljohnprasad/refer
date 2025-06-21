import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserRole, BadgeType } from '../types/user.types';

// Extend IUser with Document for Mongoose
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create User Schema
const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: function() {
        return !this.phone; // Only require email if phone is not provided
      },
      unique: true,
      sparse: true, // Allow multiple null values for unique index
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
      required: function() {
        return !this.email; // Only require phone if email is not provided
      },
      index: { unique: true, sparse: true }, // Add unique sparse index
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
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Pre-save hook for validation and password hashing
UserSchema.pre('save', async function (next) {
  const user = this;
  
  // Ensure at least one of email or phone is provided
  if (!user.email && !user.phone) {
    return next(new Error('Either email or phone number is required'));
  }
  
  // Only hash the password if it has been modified (or is new)
  if (user.isModified('password') && user.password) {
    try {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      
      // Hash the password using the new salt
      const hash = await bcrypt.hash(user.password, salt);
      
      // Replace the plaintext password with the hash
      user.password = hash;
    } catch (error) {
      return next(error as Error);
    }
  }
  
  next();
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
