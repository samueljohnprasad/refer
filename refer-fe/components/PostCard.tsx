import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';
import { ThemeInterface } from '../constants/theme';

// Define the types for Job Seeker and Referrer posts
type JobSeekerPost = {
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

type ReferrerPost = {
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

type Post = JobSeekerPost | ReferrerPost;

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

const SkillBadge = styled.View`
  background-color: ${props => props.theme.colors.background};
  padding: 4px 8px;
  border-radius: 16px;
  margin-right: 4px;
  margin-bottom: 4px;
`;

const SkillText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
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

export default function PostCard({ post, onPress }: PostCardProps) {
  const { theme } = useTheme();
  
  // Calculate days left for expiration
  const daysLeft = post.expiresAt ? Math.ceil((post.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  
  // Check if post is job seeker type
  const isJobSeeker = post.type === 'Job Seeker';
  
  // Safely cast post based on type check
  const jobSeekerPost = isJobSeeker ? (post as JobSeekerPost) : null;
  const referrerPost = !isJobSeeker ? (post as ReferrerPost) : null;

  return (
    <Card onPress={onPress} activeOpacity={0.7}>
      <TypeBadge isJobSeeker={isJobSeeker}>
        <TypeText>{post.type}</TypeText>
      </TypeBadge>
      
      <UserContainer>
        <UserText>{post.user}</UserText>
        <TimeText>{post.createdAt}</TimeText>
      </UserContainer>
      
      {isJobSeeker ? (
        // Job Seeker post content
        <>
          {jobSeekerPost?.resume && (
            <ResumeText>
              <FontAwesome name="file-pdf-o" size={14} color={theme.colors.text} /> {jobSeekerPost.resume}
            </ResumeText>
          )}
          
          {jobSeekerPost?.interest && (
            <DescriptionText>{jobSeekerPost.interest}</DescriptionText>
          )}
          
          {jobSeekerPost?.skills && jobSeekerPost.skills.length > 0 && (
            <SkillsContainer>
              {jobSeekerPost.skills.map((skill, index) => (
                <SkillBadge key={`${post.id}-skill-${index}`}>
                  <SkillText>{skill}</SkillText>
                </SkillBadge>
              ))}
            </SkillsContainer>
          )}
          
          {jobSeekerPost?.privacy && (
            <PrivacyText>
              <FontAwesome 
                name={jobSeekerPost.privacy === 'Public' ? 'globe' : 'lock'} 
                size={12} 
                color={theme.colors.text} 
              /> {jobSeekerPost.privacy}
            </PrivacyText>
          )}
        </>
      ) : (
        // Referrer post content
        <>
          {referrerPost?.company && (
            <CompanyText>
              <FontAwesome name="building" size={14} color={theme.colors.primary} /> {referrerPost.company}
            </CompanyText>
          )}
          
          {referrerPost?.role && (
            <RoleText>{referrerPost.role}</RoleText>
          )}
          
          {referrerPost?.description && (
            <DescriptionText>{referrerPost.description}</DescriptionText>
          )}
          
          {referrerPost?.status && (
            <StatusText isActive={referrerPost.status.toLowerCase() === 'active'}>
              <FontAwesome 
                name={referrerPost.status.toLowerCase() === 'active' ? 'check-circle' : 'clock-o'} 
                size={14} 
              /> {referrerPost.status}
            </StatusText>
          )}
        </>
      )}
      
      <Divider />
      
      <FooterContainer>
        {daysLeft !== null && (
          <ExpiryText isExpiringSoon={daysLeft <= 7}>
            <FontAwesome name="calendar" size={12} /> Expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}
          </ExpiryText>
        )}
        
        <TouchableOpacity>
          <FontAwesome 
            name="share-square-o" 
            size={16} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </FooterContainer>
    </Card>
  );
}
