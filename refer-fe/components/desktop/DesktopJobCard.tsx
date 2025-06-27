import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import { Post, JobSeekerPost, ReferrerPost } from '../../types/posts';

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

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};

const CardHeader = styled.View`
  flex-direction: row;
  padding: ${props => props.theme.spacing['3xl']}px;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.xl}px;
`;

const CompanyLogo = styled.View`
  width: 64px;
  height: 64px;
  border-radius: ${props => props.theme.borderRadius.xl}px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const logoShadow = {
  shadowColor: '#0066CC',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 2,
};

const CompanyLogoText = styled.Text`
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xxl}px;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`;

const JobInfo = styled.View`
  flex: 1;
`;

const JobTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xxl}px;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
  line-height: ${props => props.theme.typography.fontSize.xxl * props.theme.typography.lineHeight.tight}px;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  letter-spacing: -0.2px;
`;

const CompanyName = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.base}px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg}px;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`;

const JobDescription = styled.Text`
  font-size: 15px;
  color: #475569;
  line-height: 22px;
  margin-bottom: 16px;
  font-family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
`;

const JobMeta = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: #F8FAFC;
  border-radius: 6px;
  border: 1px solid #E2E8F0;
`;

const MetaText = styled.Text`
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
  font-family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
`;

const Salary = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #10B981;
  background-color: #F0FDF4;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #BBF7D0;
  font-family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
`;

const ExpandButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-top: ${props => props.theme.spacing.sm}px;
`;

const ExpandText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
`;

const CardBody = styled.View<{ isExpanded: boolean }>`
  padding: 0 ${props => props.theme.spacing.lg}px;
  padding-bottom: ${props => props.theme.spacing.lg}px;
  display: ${props => props.isExpanded ? 'flex' : 'none'};
`;

const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.base}px;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const SkillBadge = styled.View`
  background-color: ${props => props.theme.colors.primaryLight};
  border-radius: ${props => props.theme.borderRadius.sm}px;
  padding: ${props => props.theme.spacing.xs}px ${props => props.theme.spacing.sm}px;
`;

const SkillText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const InfoGrid = styled.View`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const InfoColumn = styled.View`
  flex: 1;
  margin-right: ${props => props.theme.spacing.md}px;
`;

const InfoItem = styled.View`
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const InfoLabel = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const InfoValue = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
`;

const ReferralRewards = styled.View`
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const RewardsTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const RewardItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const RewardIcon = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const RewardText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
`;

const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top-width: 1px;
  border-top-color: #F1F5F9;
  gap: 16px;
  background-color: #FAFBFC;
`;

const TimeAgo = styled.Text`
  font-size: 13px;
  color: #94A3B8;
  font-weight: 500;
  font-family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ActionButton = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' }>`
  background-color: ${props => 
    props.variant === 'primary' ? '#0066CC' : 'transparent'};
  border-width: 1px;
  border-color: #0066CC;
  border-radius: 8px;
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  justify-content: center;
`;

const primaryButtonShadow = {
  shadowColor: '#0066CC',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 2,
};

const ActionButtonText = styled.Text<{ variant: 'primary' | 'secondary' }>`
  font-size: 15px;
  font-weight: 600;
  color: ${props => 
    props.variant === 'primary' ? 'white' : '#0066CC'};
  font-family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
`;

const DesktopJobCard: React.FC<DesktopJobCardProps> = ({
  post,
  onApply,
  onRefer,
  theme
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isReferrerPost = (post: Post): post is ReferrerPost => {
    return 'role' in post && 'company' in post;
  };

  const getCompanyInitial = (companyName: string): string => {
    return companyName.charAt(0).toUpperCase();
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getSalaryRange = (): string => {
    // Mock salary data - replace with real data from API
    const salaryRanges = ['$3500 - $4500', '$2500 - $3000', '$2000 - $2500'];
    return salaryRanges[Math.floor(Math.random() * salaryRanges.length)];
  };

  const renderReferrerPost = (post: ReferrerPost): React.ReactElement => {
    return (
      <>
        <CardHeader theme={theme}>
          <CompanyLogo theme={theme}>
            <CompanyLogoText theme={theme}>
              {getCompanyInitial(post.company)}
            </CompanyLogoText>
          </CompanyLogo>
          
          <JobInfo>
            <JobTitle theme={theme}>{post.role}</JobTitle>
            <CompanyName theme={theme}>{post.company}</CompanyName>
            
            <JobDescription theme={theme}>
              {post.description.length > 120 && !isExpanded 
                ? `${post.description.substring(0, 120)}...`
                : post.description}
            </JobDescription>
            
            {post.description.length > 120 && (
              <ExpandButton onPress={() => setIsExpanded(!isExpanded)}>
                <ExpandText theme={theme}>
                  {isExpanded ? 'Show less' : 'Show more'}
                </ExpandText>
              </ExpandButton>
            )}
            
            <JobMeta theme={theme}>
              <MetaItem theme={theme}>
                <FontAwesome name="map-marker" size={14} color={theme.colors.textSecondary} />
                <MetaText theme={theme}>Redwood City, CA</MetaText>
              </MetaItem>
              <MetaItem theme={theme}>
                <FontAwesome name="briefcase" size={14} color={theme.colors.textSecondary} />
                <MetaText theme={theme}>On Site</MetaText>
              </MetaItem>
              <MetaItem theme={theme}>
                <FontAwesome name="clock-o" size={14} color={theme.colors.textSecondary} />
                <MetaText theme={theme}>Full-time</MetaText>
              </MetaItem>
              <Salary theme={theme}>{getSalaryRange()}</Salary>
            </JobMeta>
          </JobInfo>
        </CardHeader>

        <CardBody theme={theme} isExpanded={isExpanded}>
          {post.skills && post.skills.length > 0 && (
            <>
              <SectionTitle theme={theme}>Skills</SectionTitle>
              <SkillsContainer theme={theme}>
                {post.skills.map((skill, index) => (
                  <SkillBadge key={index} theme={theme}>
                    <SkillText theme={theme}>{skill}</SkillText>
                  </SkillBadge>
                ))}
              </SkillsContainer>
            </>
          )}

          <InfoGrid theme={theme}>
            <InfoColumn theme={theme}>
              <InfoItem theme={theme}>
                <InfoLabel theme={theme}>Experience Level</InfoLabel>
                <InfoValue theme={theme}>Mid-Senior level</InfoValue>
              </InfoItem>
            </InfoColumn>
            <InfoColumn theme={theme}>
              <InfoItem theme={theme}>
                <InfoLabel theme={theme}>Industries</InfoLabel>
                <InfoValue theme={theme}>Technology and Services</InfoValue>
              </InfoItem>
            </InfoColumn>
          </InfoGrid>

          <ReferralRewards theme={theme}>
            <RewardsTitle theme={theme}>Referral Rewards</RewardsTitle>
            <RewardItem theme={theme}>
              <RewardIcon theme={theme}>
                <FontAwesome name="mobile" size={12} color="white" />
              </RewardIcon>
              <RewardText theme={theme}>iPhone 16</RewardText>
            </RewardItem>
            <RewardItem theme={theme}>
              <RewardIcon theme={theme}>
                <FontAwesome name="gift" size={12} color="white" />
              </RewardIcon>
              <RewardText theme={theme}>Mystery Box</RewardText>
            </RewardItem>
            <RewardItem theme={theme}>
              <RewardIcon theme={theme}>
                <FontAwesome name="dollar" size={12} color="white" />
              </RewardIcon>
              <RewardText theme={theme}>$1000 Cash</RewardText>
            </RewardItem>
          </ReferralRewards>
        </CardBody>

        <CardFooter theme={theme}>
          <TimeAgo theme={theme}>{getTimeAgo(post.createdAt)}</TimeAgo>
          <ButtonsContainer theme={theme}>
            <ActionButton
              theme={theme}
              variant="primary"
              style={primaryButtonShadow}
              onPress={() => onApply(post)}
            >
              <FontAwesome name="send" size={14} color="white" />
              <ActionButtonText theme={theme} variant="primary">Apply</ActionButtonText>
            </ActionButton>
            <ActionButton theme={theme} variant="secondary" onPress={onRefer}>
              <FontAwesome name="share" size={14} color={theme.colors.primary} />
              <ActionButtonText theme={theme} variant="secondary">Refer</ActionButtonText>
            </ActionButton>
          </ButtonsContainer>
        </CardFooter>
      </>
    );
  };

  const renderJobSeekerPost = (post: JobSeekerPost): React.ReactElement => {
    const companyName = post.user?.firstName ? `${post.user.firstName} ${post.user.lastName || ''}` : 'Anonymous';
    
    return (
      <>
        <CardHeader theme={theme}>
          <CompanyLogo theme={theme}>
            <CompanyLogoText theme={theme}>
              {getCompanyInitial(companyName)}
            </CompanyLogoText>
          </CompanyLogo>
          
          <JobInfo>
            <JobTitle theme={theme}>{post.title || 'Job Seeker'}</JobTitle>
            <CompanyName theme={theme}>{companyName}</CompanyName>
            
            <JobDescription theme={theme}>
              {post.interestStatement && post.interestStatement.length > 120 && !isExpanded 
                ? `${post.interestStatement.substring(0, 120)}...`
                : post.interestStatement || 'Looking for opportunities'}
            </JobDescription>
            
            {post.interestStatement && post.interestStatement.length > 120 && (
              <ExpandButton onPress={() => setIsExpanded(!isExpanded)}>
                <ExpandText theme={theme}>
                  {isExpanded ? 'Show less' : 'Show more'}
                </ExpandText>
              </ExpandButton>
            )}
          </JobInfo>
        </CardHeader>

        <CardBody theme={theme} isExpanded={isExpanded}>
          {post.skills && post.skills.length > 0 && (
            <>
              <SectionTitle theme={theme}>Skills</SectionTitle>
              <SkillsContainer theme={theme}>
                {post.skills.map((skill, index) => (
                  <SkillBadge key={index} theme={theme}>
                    <SkillText theme={theme}>{skill}</SkillText>
                  </SkillBadge>
                ))}
              </SkillsContainer>
            </>
          )}

          {post.workExperience && post.workExperience.length > 0 && (
            <>
              <SectionTitle theme={theme}>Experience</SectionTitle>
              {post.workExperience.map((exp, index) => (
                <InfoItem key={index} theme={theme}>
                  <InfoValue theme={theme}>
                    {exp.role} at {exp.company}
                  </InfoValue>
                </InfoItem>
              ))}
            </>
          )}
        </CardBody>

        <CardFooter theme={theme}>
          <TimeAgo theme={theme}>{getTimeAgo(post.createdAt || new Date().toISOString())}</TimeAgo>
          <ButtonsContainer theme={theme}>
            <ActionButton theme={theme} variant="secondary" onPress={onRefer}>
              <FontAwesome name="handshake-o" size={14} color={theme.colors.primary} />
              <ActionButtonText theme={theme} variant="secondary">Refer</ActionButtonText>
            </ActionButton>
          </ButtonsContainer>
        </CardFooter>
      </>
    );
  };

  return (
    <Card theme={theme} style={cardShadow}>
      {isReferrerPost(post) ? renderReferrerPost(post) : renderJobSeekerPost(post)}
    </Card>
  );
};

export default DesktopJobCard;
