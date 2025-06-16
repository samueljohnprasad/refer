export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  REFERRER = 'REFERRER',
  BOTH = 'BOTH',
  ADMIN = 'ADMIN'
}

export enum BadgeType {
  VERIFIED_EMPLOYEE = 'VERIFIED_EMPLOYEE',
  VERIFIED_SEEKER = 'VERIFIED_SEEKER',
  SUPER_REFERRER = 'SUPER_REFERRER'
}

export interface IPrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections';
  resumeVisibility: 'public' | 'private' | 'connections';
  contactInfoVisibility: 'public' | 'private' | 'connections';
}

export interface INotificationSettings {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  referralUpdates: boolean;
  chatMessages: boolean;
  jobMatches: boolean;
  platformUpdates: boolean;
}

export interface IUser {
  email: string;
  password?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  company?: string;
  companyEmail?: string;
  isCompanyEmailVerified: boolean;
  role: UserRole;
  badges: BadgeType[];
  privacySettings: IPrivacySettings;
  notificationSettings: INotificationSettings;
  profilePicture?: string;
  bio?: string;
  isActive: boolean;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
