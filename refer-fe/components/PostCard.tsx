import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';
import ReferrerPostDetail from './ReferrerPostDetail';
import { ThemeInterface } from '../constants/theme';

// Define the types for Job Seeker and Referrer posts
export type JobSeekerPost = {
  id: string;
  type: string;
  user: string;
  resume: string;
  interest: string;
  privacy: string;
  skills?: string[];
  expiresAt: number;
  createdAt: string;
};

export type ReferrerPost = {
  id: string;
  type: string;
  user: string;
  company: string;
  role: string;
  description: string;
  status: string;
  expiresAt: number;
  createdAt: string;
};

export type Post = JobSeekerPost | ReferrerPost;

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

const Card = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

interface TypeBadgeProps {
  isJobSeeker: boolean;
}

const TypeBadge = styled.View<TypeBadgeProps>`
  background-color: ${props => 
    props.isJobSeeker ? props.theme.colors.primary : props.theme.colors.secondary};
  padding: 4px 8px;
  border-radius: 20px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

const TypeText = styled.Text`
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  font-weight: bold;
`;

const ContentContainer = styled.View`
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UserContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const TimeText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  opacity: 0.6;
`;

const CompanyText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 4px;
`;

const RoleText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  margin-bottom: 4px;
`;

const DescriptionText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const ResumeText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const PrivacyText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 4px;
`;

interface StatusTextProps {
  isActive: boolean;
}

const StatusText = styled.Text<StatusTextProps>`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => 
    props.isActive 
      ? props.theme.colors.success 
      : props.theme.colors.warning};
  font-weight: bold;
`;

interface ExpiryTextProps {
  isExpiringSoon: boolean;
}

const ExpiryText = styled.Text<ExpiryTextProps>`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.isExpiringSoon ? props.theme.colors.error : props.theme.colors.text};
  opacity: ${props => props.isExpiringSoon ? 1 : 0.7};
  margin-top: 8px;
  font-weight: ${props => props.isExpiringSoon ? 'bold' : 'normal'};
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 4px;
  margin-bottom: 4px;
`;

interface SkillBadgeProps {
  index: number;
}

const SkillBadge = styled.View<SkillBadgeProps>`
  background-color: ${props => {
    // Alternate colors for visual interest
    const colors = [
      props.theme.colors.primary + '20',  // Primary with 20% opacity
      props.theme.colors.secondary + '20', // Secondary with 20% opacity
      props.theme.colors.info + '20',      // Info with 20% opacity
    ];
    return colors[props.index % colors.length];
  }};
  padding: 6px 10px;
  border-radius: 16px;
  margin-right: 6px;
  margin-bottom: 6px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const SkillText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin-top: 8px;
  margin-bottom: 8px;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const FooterButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const ApplyButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  margin-left: 4px;
`;

const ReferButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.secondary};
  padding: 8px 16px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const ReferButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  margin-left: 6px;
`;

const IconContainer = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

export default function PostCard({ post, onPress }: PostCardProps) {
  const { theme } = useTheme();
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  
  const daysLeft = post.expiresAt ? Math.ceil((post.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  const handleDetailPress = () => {
    setDetailVisible(true);
  };

  const handleRefer = () => {
    console.log(`Referring user for post: ${post.id}`);
  };

  const handleApply = () => {
    console.log('Application submitted for:', post.id);
  };

  if (post.type === 'Job Seeker') {
    const jobSeekerPost = post as JobSeekerPost;
    return (
      <Card onPress={onPress} activeOpacity={0.7}>
        <TypeBadge isJobSeeker>
          <TypeText>{jobSeekerPost.type}</TypeText>
        </TypeBadge>
        
        <ContentContainer>
          <UserContainer>
            <UserText>{jobSeekerPost.user}</UserText>
            <TimeText>{getTimeAgo(jobSeekerPost.createdAt)}</TimeText>
          </UserContainer>
          <ResumeText>
            <FontAwesome name="file-text-o" size={14} color={theme.colors.text} />
            {' '}{jobSeekerPost.resume}
          </ResumeText>
          <DescriptionText>{jobSeekerPost.interest}</DescriptionText>
          
          <PrivacyText>
            <FontAwesome 
              name={jobSeekerPost.privacy === 'Public' ? 'globe' : 'lock'} 
              size={14} 
              color={theme.colors.text} 
            />
            {' '}{jobSeekerPost.privacy}
          </PrivacyText>

          {jobSeekerPost.skills && jobSeekerPost.skills.length > 0 && (
            <>
              <Divider />
              <SkillsContainer>
                {jobSeekerPost.skills.map((skill, index) => (
                  <SkillBadge key={`${post.id}-skill-${index}`} index={index}>
                    <SkillText>{skill}</SkillText>
                  </SkillBadge>
                ))}
              </SkillsContainer>
            </>
          )}
        </ContentContainer>

        <Divider />
        
        <FooterContainer>
          <FooterButtonsContainer>
            <IconContainer>
              <FontAwesome name="bookmark-o" size={16} color={theme.colors.text} />
            </IconContainer>
            <IconContainer>
              <FontAwesome name="share-alt" size={16} color={theme.colors.text} />
            </IconContainer>
          </FooterButtonsContainer>

          <ReferButton onPress={handleRefer}>
            <FontAwesome name="send" size={14} color="white" />
            <ReferButtonText>Refer</ReferButtonText>
          </ReferButton>
        </FooterContainer>
      </Card>
    );
  }

  if (post.type === 'Referrer') {
    const referrerPost = post as ReferrerPost;
    return (
      <Card onPress={handleDetailPress} activeOpacity={0.7}>
        <TypeBadge isJobSeeker={false}>
          <TypeText>{referrerPost.type}</TypeText>
        </TypeBadge>

        <ContentContainer>
          <UserContainer>
            <UserText>{referrerPost.user}</UserText>
            <TimeText>{getTimeAgo(referrerPost.createdAt)}</TimeText>
          </UserContainer>
          <CompanyText>{referrerPost.company}</CompanyText>
          <RoleText>{referrerPost.role}</RoleText>
          <DescriptionText>{referrerPost.description}</DescriptionText>
        </ContentContainer>
        
        <Divider />

        <FooterContainer>
          <FooterButtonsContainer>
             <StatusText isActive={referrerPost.status === 'Active'}>
                {referrerPost.status}
              </StatusText>
          </FooterButtonsContainer>

          <ApplyButton onPress={handleApply}>
            <FontAwesome name="paper-plane" size={14} color="white" />
            <ApplyButtonText>Apply</ApplyButtonText>
          </ApplyButton>
        </FooterContainer>

        {daysLeft !== null && (
          <ExpiryText isExpiringSoon={isExpiringSoon}>
            <FontAwesome name="clock-o" size={12} color={isExpiringSoon ? theme.colors.error : theme.colors.text} />
            {' '}Expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}
          </ExpiryText>
        )}
        
        <ReferrerPostDetail 
          post={referrerPost} 
          visible={detailVisible}
          onClose={() => setDetailVisible(false)}
        />
      </Card>
    );
  }

  return null;
}
