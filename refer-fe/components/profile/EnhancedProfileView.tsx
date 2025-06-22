import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

import {
  ProfileHeader,
  ProfileStats,
  ProfileSkills,
  ProfileExperience,
  ProfileEducation,
  ProfileResume,
  ProfilePrivacySettings,
  ProfileSocial,
  ProfileEndorsements,
  ProfileConnections
} from './index';

// Mock endorsements data
const mockEndorsements = [
  {
    skillId: '1',
    skillName: 'React Native',
    count: 32,
    endorsers: [
      {
        id: '101',
        name: 'Emily Johnson',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        title: 'Senior Developer',
        company: 'TechCorp',
        relationship: 'Colleague',
        date: 'May 2023'
      },
      {
        id: '102',
        name: 'David Chen',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        title: 'Tech Lead',
        company: 'InnovateSoft',
        relationship: 'Manager',
        date: 'Mar 2023'
      }
    ]
  },
  {
    skillId: '2',
    skillName: 'TypeScript',
    count: 28,
    endorsers: [
      {
        id: '103',
        name: 'Sarah Miller',
        image: 'https://randomuser.me/api/portraits/women/25.jpg',
        title: 'Frontend Developer',
        company: 'WebSolutions',
        relationship: 'Colleague',
        date: 'Jun 2023'
      }
    ]
  },
  {
    skillId: '3',
    skillName: 'JavaScript',
    count: 26,
    endorsers: []
  },
  {
    skillId: '4',
    skillName: 'Redux',
    count: 21,
    endorsers: []
  }
];

// Mock connections data
const mockConnections = [
  {
    id: '201',
    name: 'Jennifer Lee',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    title: 'UX Designer',
    company: 'DesignHub',
    mutualConnections: 5,
    isConnected: true
  },
  {
    id: '202',
    name: 'Robert Taylor',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'Product Manager',
    company: 'TechCorp',
    mutualConnections: 3,
    isConnected: true
  },
  {
    id: '203',
    name: 'Michelle Wong',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    title: 'Frontend Developer',
    company: 'WebSolutions',
    mutualConnections: 7,
    isConnected: true
  },
  {
    id: '204',
    name: 'James Peterson',
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
    title: 'Backend Developer',
    company: 'DataCo',
    mutualConnections: 2,
    isConnected: false
  },
  {
    id: '205',
    name: 'Lisa Garcia',
    image: 'https://randomuser.me/api/portraits/women/55.jpg',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    mutualConnections: 0,
    isConnected: false
  },
  {
    id: '206',
    name: 'Daniel Kim',
    image: 'https://randomuser.me/api/portraits/men/66.jpg',
    title: 'Mobile Developer',
    company: 'AppWorks',
    mutualConnections: 4,
    isConnected: true
  },
  {
    id: '207',
    name: 'Emma Thompson',
    image: 'https://randomuser.me/api/portraits/women/77.jpg',
    title: 'UI Designer',
    company: 'CreativeStudio',
    mutualConnections: 1,
    isConnected: true
  }
];

// Types for user profile data
interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  bio: string;
  company?: string;
  position?: string;
  location?: string;
  website?: string;
  profileImage: string;
  coverImage: string;
  isVerified: boolean;
  stats: {
    connections: number;
    referrals: number;
    endorsements: number;
  };
  profileCompletionPercentage: number;
  skills: Array<{
    id: string;
    name: string;
    endorsements: number;
  }>;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    duration: string;
    description?: string;
    logo?: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    description?: string;
    logo?: string;
  }>;
  resume?: {
    id: string;
    name: string;
    url: string;
    fileSize: string;
    uploadDate: string;
    fileType: string;
  };
  privacySettings: {
    isProfilePublic: boolean;
    showEmail: boolean;
    showPhone: boolean;
    showResume: boolean;
    allowMessages: boolean;
    showActivity: boolean;
  };
}

interface EnhancedProfileViewProps {
  userData?: UserProfile;
  isEditable?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onEditProfile?: () => void;
  onShowAlert?: (message: string) => void;
}

const EnhancedProfileView: React.FC<EnhancedProfileViewProps> = ({
  userData,
  isEditable = true,
  isLoading = false,
  error = null,
  onEditProfile,
  onShowAlert
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Mock data for demonstration
  const mockUserData: UserProfile = {
    id: '1',
    name: 'Alex Johnson',
    username: 'alexjohnson',
    email: 'alex.johnson@company.com',
    phone: '+1 (555) 123-4567',
    bio: 'Senior Software Engineer with 5+ years of experience in React Native and TypeScript. Passionate about building beautiful, user-friendly mobile applications.',
    company: 'TechCorp Inc.',
    position: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.dev',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    isVerified: true,
    stats: {
      connections: 328,
      referrals: 15,
      endorsements: 47
    },
    profileCompletionPercentage: 85,
    skills: [
      { id: '1', name: 'React Native', endorsements: 32 },
      { id: '2', name: 'TypeScript', endorsements: 28 },
      { id: '3', name: 'JavaScript', endorsements: 26 },
      { id: '4', name: 'Redux', endorsements: 21 },
      { id: '5', name: 'Node.js', endorsements: 18 },
      { id: '6', name: 'GraphQL', endorsements: 15 },
      { id: '7', name: 'React', endorsements: 24 }
    ],
    experience: [
      {
        id: '1',
        role: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        duration: '2021 - Present',
        description: 'Lead developer for React Native mobile applications. Implemented state management systems and mentored junior developers.',
        logo: 'https://logo.clearbit.com/microsoft.com'
      },
      {
        id: '2',
        role: 'Frontend Developer',
        company: 'InnovateSoft',
        duration: '2018 - 2021',
        description: 'Developed and maintained features for high-traffic web applications using React and TypeScript.',
        logo: 'https://logo.clearbit.com/intel.com'
      },
      {
        id: '3',
        role: 'Junior Developer',
        company: 'StartupXYZ',
        duration: '2016 - 2018',
        description: 'Worked on full-stack development with JavaScript, Node.js, and various front-end frameworks.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'M.S. Computer Science',
        institution: 'Stanford University',
        year: '2016',
        logo: 'https://logo.clearbit.com/stanford.edu'
      },
      {
        id: '2',
        degree: 'B.S. Computer Engineering',
        institution: 'UC Berkeley',
        year: '2014',
        logo: 'https://logo.clearbit.com/berkeley.edu'
      }
    ],
    resume: {
      id: '1',
      name: 'Alex_Johnson_Resume_2023.pdf',
      url: 'https://example.com/resume.pdf',
      fileSize: '2.4 MB',
      uploadDate: 'Jun 10, 2023',
      fileType: 'pdf'
    },
    privacySettings: {
      isProfilePublic: true,
      showEmail: true,
      showPhone: false,
      showResume: true,
      allowMessages: true,
      showActivity: true
    }
  };

  // Use provided user data or fallback to mock data
  const profile = userData || mockUserData;

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingIndicator />
        <LoadingText>Loading profile...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <ErrorText>{error}</ErrorText>
        <RetryButton>
          <RetryButtonText>Retry</RetryButtonText>
        </RetryButton>
      </ErrorContainer>
    );
  }

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      // Mock alert for editing profile
      onShowAlert?.('Edit profile feature is not implemented yet');
    }
  };

  const handleUploadResume = () => {
    // Mock alert for uploading resume
    onShowAlert?.('Resume upload feature is not implemented yet');
  };

  const handleViewResume = () => {
    // Mock alert for viewing resume
    onShowAlert?.('Resume view feature is not implemented yet');
  };

  const handleAddSkill = () => {
    // Mock alert for adding skills
    onShowAlert?.('Add skill feature is not implemented yet');
  };

  const handlePrivacyChange = (setting: keyof UserProfile['privacySettings'], value: boolean) => {
    // Mock alert for privacy changes
    onShowAlert?.(`Privacy setting ${setting} changed to ${value}`);
  };

  const handleEndorseSkill = (skillId: string, message: string) => {
    // Mock alert for skill endorsement
    onShowAlert?.('Endorsement submitted successfully');
  };

  const handleConnectUser = (userId: string) => {
    // Mock alert for user connection
    onShowAlert?.('Connection request sent');
  };

  const handleViewProfile = (userId: string) => {
    // Mock alert for viewing user profile
    onShowAlert?.(`Viewing profile ID: ${userId}`);
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          name={profile.name}
          username={profile.username}
          bio={profile.bio}
          company={profile.company}
          position={profile.position}
          location={profile.location}
          website={profile.website}
          profileImage={profile.profileImage}
          coverImage={profile.coverImage}
          isVerified={profile.isVerified}
          onEditProfile={handleEditProfile}
        />

        <TabsContainer>
          <TabButton 
            active={activeTab === 'profile'} 
            onPress={() => setActiveTab('profile')}
          >
            <Ionicons 
              name="person-outline" 
              size={20} 
              color={activeTab === 'profile' ? theme.colors.primary : theme.colors.text} 
            />
            <TabText active={activeTab === 'profile'}>Profile</TabText>
          </TabButton>
          <TabButton 
            active={activeTab === 'settings'} 
            onPress={() => setActiveTab('settings')}
          >
            <Ionicons 
              name="settings-outline" 
              size={20} 
              color={activeTab === 'settings' ? theme.colors.primary : theme.colors.text} 
            />
            <TabText active={activeTab === 'settings'}>Settings</TabText>
          </TabButton>
        </TabsContainer>
        
        {activeTab === 'profile' ? (
          <>
            <ProfileStats
              connections={profile.stats.connections}
              referrals={profile.stats.referrals}
              endorsements={profile.stats.endorsements}
              completionPercentage={profile.profileCompletionPercentage}
            />

            <ProfileEndorsements
              endorsements={mockEndorsements}
              onEndorse={handleEndorseSkill}
            />

            <ProfileConnections
              connections={mockConnections}
              onConnect={handleConnectUser}
              onViewProfile={handleViewProfile}
            />

            <ProfileSkills
              skills={profile.skills}
              editable={isEditable}
              onAddSkill={handleAddSkill}
            />

            <ProfileExperience
              experiences={profile.experience}
              editable={isEditable}
            />

            <ProfileEducation
              education={profile.education}
              editable={isEditable}
            />

            <ProfileResume
              resume={profile.resume}
              editable={isEditable}
              onUploadResume={handleUploadResume}
              onViewResume={handleViewResume}
            />
            
            <ProfileSocial
              username={profile.username}
              userId={profile.id}
              profileUrl={`https://refernet.com/profile/${profile.username}`}
            />
          </>
        ) : (
          <ProfilePrivacySettings
            settings={profile.privacySettings}
            onSettingChange={handlePrivacyChange}
          />
        )}
      </ScrollView>
    </Container>
  );
};

// Fix styling issues with shadow and elevation by using inline styles
const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2
};

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const TabsContainer = styled.View`
  flex-direction: row;
  padding: 8px 16px;
  background-color: ${props => props.theme.colors.card};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

interface TabProps {
  active: boolean;
}

const TabButton = styled.TouchableOpacity<TabProps>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => props.active ? props.theme.colors.primary + '20' : 'transparent'};
`;

const TabText = styled.Text<TabProps>`
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.active ? '600' : 'normal'};
  margin-left: 4px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const LoadingIndicator = styled.ActivityIndicator.attrs(props => ({
  color: props.theme.colors.primary,
  size: 'large'
}))``;

const LoadingText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  margin-top: 16px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ErrorText = styled.Text`
  color: ${props => props.theme.colors.error};
  font-size: 16px;
  text-align: center;
  margin: 16px 0;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 12px 24px;
  border-radius: 20px;
`;

const RetryButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

export default EnhancedProfileView;
