import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import { JobSeekerPost, Post, ReferrerPost } from '@/types/posts';

interface DesktopJobCardProps {
  post: Post;
  onApply: (post: Post) => void;
  onRefer: () => void;
  theme: EnhancedThemeInterface;
  index?: number;
}

// Helper to check if a post is a ReferrerPost
const isReferrerPost = (post: Post): post is ReferrerPost => {
  return 'company' in post;
};

// Mock data for design matching the image exactly
const getJobCardData = (post: Post, index: number = 0) => {
  const jobData = [
    {
      id: '1',
      title: 'Principal Designer',
      company: 'Beats corporation inc.com',
      description: 'Lead the design vision, create intuitive user experiences, and collaborate with cross-functional teams to drive innovation.',
      location: 'Redwood City, CA',
      salary: '$3500 - $4500',
      tags: [{ text: 'On Site', icon: 'person' }, { text: 'Full-time', icon: 'access-time' }],
      timeAgo: '1 Day ago',
      reward: '$1500',
      logoColor: '#06B6D4',
      logoText: '😊'
    },
    {
      id: '2', 
      title: 'Frontend Developer',
      company: 'Word Flow',
      description: 'Build responsive UIs with modern frameworks, ensuring great performance and user experience as a Front-End Designer.',
      location: 'Ocean City, NJ',
      salary: '$2500 - $3000',
      tags: [{ text: 'Remote/ Hybrid', icon: 'public' }, { text: 'Full-time', icon: 'access-time' }, { text: 'Urgent', icon: 'priority-high', variant: 'urgent' }],
      timeAgo: '2 days ago',
      reward: '$1000',
      logoColor: '#F97316',
      logoText: 'WF'
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'Beats Online',
      description: 'Drive product strategy and roadmap, collaborate with engineering and design teams to deliver exceptional user experiences.',
      location: 'San Francisco, CA',
      salary: '$4000 - $5500',
      tags: [{ text: 'On Site', icon: 'person' }, { text: 'Full-time', icon: 'access-time' }],
      timeAgo: '3 days ago',
      reward: '$2000',
      logoColor: '#1F2937',
      logoText: 'b'
    }
  ];
  return jobData[index % jobData.length];
};

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 2px;
  border-color: #E0F2FE;
  margin-bottom: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const CompanyLogo = styled.View<{ bgColor: string }>`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: ${props => props.bgColor};
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const LogoText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: white;
`;

const JobInfo = styled.View`
  flex: 1;
`;

const JobTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
`;

const CompanyName = styled.Text`
  font-size: 16px;
  color: #6B7280;
`;

const ReferralReward = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #EFF6FF;
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: auto;
`;

const RewardIcon = styled.View`
  margin-right: 4px;
`;

const RewardText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1D4ED8;
`;

const GiftIcon = styled.View`
  background-color: #1D4ED8;
  padding: 6px;
  border-radius: 8px;
  margin-left: 8px;
`;

const JobDescription = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #4B5563;
  margin-bottom: 20px;
`;

const JobDetails = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const LocationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 24px;
`;

const LocationText = styled.Text`
  font-size: 16px;
  color: #6B7280;
  margin-left: 6px;
`;

const SalaryText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const JobTags = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Tag = styled.View<{ variant?: 'default' | 'urgent' }>`
  background-color: ${props => props.variant === 'urgent' ? '#FEF2F2' : '#F3F4F6'};
  border: 1px solid ${props => props.variant === 'urgent' ? '#FCA5A5' : '#E5E7EB'};
  padding: 6px 12px;
  border-radius: 16px;
  margin-right: 8px;
  flex-direction: row;
  align-items: center;
`;

const TagText = styled.Text<{ variant?: 'default' | 'urgent' }>`
  font-size: 14px;
  color: ${props => props.variant === 'urgent' ? '#DC2626' : '#6B7280'};
  margin-left: 4px;
`;

const TimeStamp = styled.Text`
  font-size: 16px;
  color: #6B7280;
`;

const DesktopJobCard: React.FC<DesktopJobCardProps> = ({
  post,
  onApply,
  onRefer,
  theme,
  index = 0
}) => {
  const jobData = getJobCardData(post, index);

  const getCompanyName = (post: Post): string => {
    if (isReferrerPost(post)) {
      return post.company;
    }
    const jobSeekerPost = post as JobSeekerPost;
    return jobSeekerPost.user?.firstName 
      ? `${jobSeekerPost.user.firstName} ${jobSeekerPost.user.lastName || ''}`
      : 'Anonymous';
  };

  const getDescription = (post: Post): string => {
    if (isReferrerPost(post)) {
      return post.description;
    }
    return (post as JobSeekerPost).interestStatement || 'Looking for opportunities';
  };

  const companyName = getCompanyName(post);

  return (
    <Card>
      <CardHeader>
        <CompanyLogo bgColor={jobData.logoColor}>
          <LogoText>{jobData.logoText}</LogoText>
        </CompanyLogo>
        <JobInfo>
          <JobTitle>{jobData.title}</JobTitle>
          <CompanyName>{jobData.company}</CompanyName>
        </JobInfo>
        <ReferralReward>
          <RewardIcon>
            <MaterialIcons name="card-giftcard" size={20} color="#1D4ED8" />
          </RewardIcon>
          <RewardText>{jobData.reward}</RewardText>
          <GiftIcon>
            <FontAwesome name="gift" size={14} color="white" />
          </GiftIcon>
        </ReferralReward>
      </CardHeader>

      <JobDescription>{jobData.description}</JobDescription>

      <JobDetails>
        <LocationContainer>
          <MaterialIcons name="location-on" size={20} color="#6B7280" />
          <LocationText>{jobData.location}</LocationText>
        </LocationContainer>
        <SalaryText>{jobData.salary}</SalaryText>
      </JobDetails>

      <TagsContainer>
        <JobTags>
          {jobData.tags.map((tag, index) => (
            <Tag key={index} variant={tag.variant as 'default' | 'urgent'}>
              <MaterialIcons 
                name={tag.icon as any} 
                size={16} 
                color={tag.variant === 'urgent' ? '#DC2626' : '#6B7280'} 
              />
              <TagText variant={tag.variant as 'default' | 'urgent'}>
                {tag.text}
              </TagText>
            </Tag>
          ))}
        </JobTags>
        <TimeStamp>{jobData.timeAgo}</TimeStamp>
      </TagsContainer>
    </Card>
  );
};

export default DesktopJobCard;
