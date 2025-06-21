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

// Define the main profile data interface
export interface IProfileData {
  id?: string;
  name: string;
  username: string;
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

// Props interface for the ProfileView component
export interface ProfileViewProps {
  username?: string;
  isPublic?: boolean;
  profileData?: IProfileData;
  isLoading?: boolean;
  error?: string | null;
}
