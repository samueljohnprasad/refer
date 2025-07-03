import React, { useEffect, useState } from 'react';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import { Profile } from '../../types/profile.types';
import DesktopProfilePresentation from './DesktopProfilePresentation';

interface DesktopProfileContainerProps {
  theme: EnhancedThemeInterface;
  isDesktop: boolean;
  username?: string;
  isOwnProfile?: boolean;
}

const DesktopProfileContainer: React.FC<DesktopProfileContainerProps> = ({
  theme,
  isDesktop,
  username,
  isOwnProfile = false
}) => {
  // const dispatch = useDispatch(); // Redux dispatch for future implementation
  
  // Mock profile data - in real implementation, this would come from Redux store
  const [profile, setProfile] = useState<Profile>({
    _id: '1',
    user: '1',
    username: username || 'johndoe',
    fullName: 'John Anderson',
    headline: 'Senior Product Manager | Tech Enthusiast | Helping connect talent with opportunities',
    summary: `Experienced product manager with 8+ years in tech, specializing in building scalable platforms that connect talent with opportunities. 

I've successfully launched 5+ products from concept to market, with a track record of improving user engagement by 200%+ and driving revenue growth.

Currently focused on:
• Building referral networks that create value for everyone
• Mentoring junior product managers
• Exploring AI/ML applications in recruitment

Always excited to connect with fellow product enthusiasts and discuss innovative solutions!`,
    experience: 'Senior Product Manager at TechCorp (2020-Present), Product Manager at StartupXYZ (2018-2020), Associate PM at BigTech (2016-2018)',
    skills: ['Product Management', 'Strategy', 'User Research', 'Data Analysis', 'Leadership', 'Agile', 'Product Marketing', 'B2B SaaS'],
    contactEmail: 'john.anderson@email.com',
    location: 'San Francisco, CA',
    socialLinks: {
      linkedin: 'linkedin.com/in/johnanderson',
      twitter: '@johnanderson',
      github: 'github.com/johnanderson',
      website: 'johnanderson.dev'
    },
    privacySettings: {
      showEmail: true,
      showLocation: true,
      showSocialLinks: true,
      isPublicProfile: true
    }
  });

  // Mock experience timeline data with promotions
  const experienceData = [
    {
      id: '1',
      title: 'Senior Product Manager',
      company: 'TechCorp Inc',
      companyLogo: 'TC',
      startDate: '2022-01-01',
      endDate: undefined,
      location: 'San Francisco, CA',
      description: 'Leading product strategy and execution for a B2B SaaS platform serving 500K+ users. Responsible for roadmap planning, cross-functional team coordination, and driving product growth initiatives.',
      achievements: [
        'Increased user engagement by 200% through redesigned onboarding flow',
        'Led launch of referral system resulting in 40% increase in organic user acquisition',
        'Reduced churn rate from 15% to 8% by implementing predictive analytics',
        'Managed $2M product budget and delivered 95% of planned features on time'
      ],
      skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Stakeholder Management'],
      current: true,
      isPromotion: true,
      previousRole: 'Product Manager'
    },
    {
      id: '1b',
      title: 'Product Manager',
      company: 'TechCorp Inc',
      companyLogo: 'TC',
      startDate: '2020-03-01',
      endDate: '2021-12-31',
      location: 'San Francisco, CA',
      description: 'Managed product development for core platform features. Collaborated with engineering, design, and marketing teams to deliver user-focused solutions.',
      achievements: [
        'Successfully launched 3 major product features used by 100K+ users',
        'Improved user onboarding completion rate by 45%',
        'Led cross-functional team of 12 people across engineering and design',
        'Established product analytics framework and KPI tracking system'
      ],
      skills: ['Product Development', 'Cross-functional Leadership', 'Analytics', 'User Testing'],
      current: false
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      companyLogo: 'SX',
      startDate: '2018-06-01',
      endDate: '2020-02-28',
      location: 'Palo Alto, CA',
      description: 'First product hire at early-stage startup. Built product from MVP to Series A, focusing on user acquisition and product-market fit for a mobile-first collaboration tool.',
      achievements: [
        'Grew user base from 1K to 50K users in 18 months',
        'Achieved product-market fit leading to $5M Series A funding',
        'Built and scaled product team from 1 to 8 people',
        'Launched iOS and Android apps with 4.8+ App Store ratings'
      ],
      skills: ['MVP Development', 'Mobile Product', 'Growth Hacking', 'Team Building', 'Fundraising Support'],
      current: false
    },
    {
      id: '3',
      title: 'Associate Product Manager',
      company: 'BigTech Corp',
      companyLogo: 'BT',
      startDate: '2016-08-01',
      endDate: '2018-05-31',
      location: 'Seattle, WA',
      description: 'Started career in product management working on enterprise cloud solutions. Collaborated with engineering and design teams to deliver features for Fortune 500 clients.',
      achievements: [
        'Shipped 12+ major features used by 100M+ users',
        'Reduced feature development cycle time by 30% through improved processes',
        'Led cross-team initiative to improve API documentation and developer experience',
        'Completed BigTech APM program with top 10% performance rating'
      ],
      skills: ['Enterprise Software', 'API Design', 'Technical Writing', 'Process Improvement'],
      current: false
    },
    {
      id: '4',
      title: 'Product Management Intern',
      company: 'Innovation Labs',
      companyLogo: 'IL',
      startDate: '2016-01-01',
      endDate: '2016-07-31',
      location: 'San Jose, CA',
      description: 'Summer internship focused on emerging technologies and product innovation. Worked on prototypes for IoT and mobile applications.',
      achievements: [
        'Developed prototype for IoT home automation system',
        'Conducted user interviews with 50+ potential customers',
        'Presented final project to executive team and received funding for further development'
      ],
      skills: ['Prototyping', 'IoT', 'User Interviews', 'Innovation'],
      current: false
    }
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock profile stats
  const profileStats = {
    totalReferrals: 47,
    successfulReferrals: 23,
    totalEarnings: 12500,
    successRate: 49,
    profileViews: 1247,
    connections: 156,
    endorsements: 34,
    monthlyEarnings: 2800
  };

  // Mock activity data
  const recentActivity = [
    {
      id: '1',
      type: 'referral_success',
      title: 'Referral Success!',
      description: 'Your referral for Sarah to Google was successful',
      reward: '$2000',
      timestamp: '2 days ago',
      icon: 'check-circle'
    },
    {
      id: '2',
      type: 'profile_view',
      title: 'Profile Viewed',
      description: '5 new profile views this week',
      timestamp: '3 days ago',
      icon: 'eye'
    },
    {
      id: '3',
      type: 'connection',
      title: 'New Connection',
      description: 'Connected with Alex from Microsoft',
      timestamp: '1 week ago',
      icon: 'person-add'
    }
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedProfile: Partial<Profile>) => {
    // In real implementation, dispatch Redux action
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Mock refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleConnect = () => {
    console.log('Connecting with user:', profile.username);
  };

  const handleMessage = () => {
    console.log('Messaging user:', profile.username);
  };

  const handleShare = () => {
    console.log('Sharing profile:', profile.username);
  };

  return (
    <DesktopProfilePresentation
      profile={profile}
      profileStats={profileStats}
      recentActivity={recentActivity}
      experienceData={experienceData}
      isLoading={isLoading}
      isEditing={isEditing}
      refreshing={refreshing}
      isOwnProfile={isOwnProfile}
      theme={theme}
      isDesktop={isDesktop}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onRefresh={handleRefresh}
      onConnect={handleConnect}
      onMessage={handleMessage}
      onShare={handleShare}
    />
  );
};

export default DesktopProfileContainer;
