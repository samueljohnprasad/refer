import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Post, ReferrerPost, JobSeekerPost } from '../../types/posts';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';

interface DesktopJobCardProps {
  post: Post;
  onApply: (post: Post) => void;
  onRefer: () => void;
  theme: EnhancedThemeInterface;
}

const Card = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing['2xl']}px;
  overflow: hidden;
`;

const CardHeader = styled.View`
  flex-direction: row;
  padding: ${props => props.theme.spacing.xl}px;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.lg}px;
`;

const CompanyLogo = styled.View`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg}px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const JobInfo = styled.View`
  flex: 1;
`;

const JobTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  font-weight: 600;
  font-family: ${props => props.theme.typography.fontFamily.regular};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const CompanyName = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const Description = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  line-height: 20px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const MetaContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacing.xs}px;
`;

const MetaText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textSecondary};
`;

const SalaryText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.base}px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md}px ${props => props.theme.spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.backgroundSecondary};
`;

const TimeText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  gap: ${props => props.theme.spacing.sm}px;
`;

const ActionButton = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' }>`
  background-color: ${props => props.variant === 'primary' ? props.theme.colors.primary : 'transparent'};
  border-width: 1px;
  border-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacing.xs}px;
  min-width: 80px;
  justify-content: center;
`;

const ButtonText = styled.Text<{ variant: 'primary' | 'secondary' }>`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  font-weight: 500;
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.primary};
`;

const DesktopJobCard: React.FC<DesktopJobCardProps> = ({
  post,
  onApply,
  onRefer,
  theme
}) => {
  const getTimeAgo = (dateString: string | undefined): string => {
    if (!dateString) return 'Recently';
    
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const isReferrerPost = (post: Post): post is ReferrerPost => {
    return 'role' in post && 'company' in post;
  };

  const getInitial = (text: string = ''): string => {
    return text.charAt(0).toUpperCase();
  };

  const getTitle = (post: Post): string => {
    if (isReferrerPost(post)) {
      return post.role;
    }
    return (post as JobSeekerPost).title || 'Job Seeker';
  };

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
        <CompanyLogo>
          <Text style={{ color: 'white', fontSize: theme.typography.fontSize.lg, fontWeight: '700' }}>
            {getInitial(companyName)}
          </Text>
        </CompanyLogo>
        
        <JobInfo>
          <JobTitle>{getTitle(post)}</JobTitle>
          <CompanyName>{companyName}</CompanyName>
          <Description>{getDescription(post)}</Description>
          
          <MetaContainer>
            <MetaItem>
              <FontAwesome name="map-marker" size={14} color={theme.colors.textSecondary} />
              <MetaText>Redwood City, CA</MetaText>
            </MetaItem>
            <MetaItem>
              <FontAwesome name="briefcase" size={14} color={theme.colors.textSecondary} />
              <MetaText>On Site</MetaText>
            </MetaItem>
            <MetaItem>
              <FontAwesome name="clock-o" size={14} color={theme.colors.textSecondary} />
              <MetaText>Full-time</MetaText>
            </MetaItem>
            <SalaryText>$2500 - $3000</SalaryText>
          </MetaContainer>
        </JobInfo>
      </CardHeader>

      <CardFooter>
        <TimeText>{getTimeAgo(post.createdAt)}</TimeText>
        
        <ButtonsContainer>
          <ActionButton variant="primary" onPress={() => onApply(post)}>
            <FontAwesome name="send" size={14} color="white" />
            <ButtonText variant="primary">Apply</ButtonText>
          </ActionButton>
          
          <ActionButton variant="secondary" onPress={onRefer}>
            <FontAwesome name="share" size={14} color={theme.colors.primary} />
            <ButtonText variant="secondary">Refer</ButtonText>
          </ActionButton>
        </ButtonsContainer>
      </CardFooter>
    </Card>
  );
};

export default DesktopJobCard;
