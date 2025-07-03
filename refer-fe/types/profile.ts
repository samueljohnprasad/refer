// Define interfaces for experience items
export interface IExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
}

// Define interfaces for education items
export interface IEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

// Define interface for profile stats
export interface IProfileStats {
  connections: number;
  referrals: number;
  endorsements: number;
}

// Define the base profile interface that can be extended by both public and private profiles
export interface IProfile {
  id: string;
  username: string;
  name: string;
  bio: string;
  location?: string;
  website?: string;
  profileImage?: string;
  coverImage?: string;
  stats: IProfileStats;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
}

// Extended interfaces can add additional fields specific to public or authenticated profiles
export interface IPublicProfile extends IProfile {
  // Public-specific fields can be added here
}

export interface IPrivateProfile extends IProfile {
  email: string;
  // Private-specific fields can be added here
}
