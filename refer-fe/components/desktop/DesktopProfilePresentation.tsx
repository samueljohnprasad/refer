import React from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import { Profile } from '../../types/profile.types';
import DesktopProfileEditModal from './DesktopProfileEditModal';
import DesktopExperienceTimeline from './DesktopExperienceTimeline';

interface ProfileStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  successRate: number;
  profileViews: number;
  connections: number;
  endorsements: number;
  monthlyEarnings: number;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  reward?: string;
  timestamp: string;
  icon: string;
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
  current: boolean;
}

interface DesktopProfilePresentationProps {
  profile: Profile;
  profileStats: ProfileStats;
  recentActivity: ActivityItem[];
  experienceData: ExperienceItem[];
  isLoading: boolean;
  isEditing: boolean;
  refreshing: boolean;
  isOwnProfile: boolean;
  theme: EnhancedThemeInterface;
  isDesktop: boolean;
  onEdit: () => void;
  onSave: (profile: Partial<Profile>) => void;
  onCancel: () => void;
  onRefresh: () => void;
  onConnect: () => void;
  onMessage: () => void;
  onShare: () => void;
}

const Container = styled.View`
  flex: 1;
  background-color: #FAFBFC;
  padding: 0;
`;

const Header = styled.View`
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #E1E5E9;
  padding: 24px 32px;
  margin-bottom: 0;
`;

const MainContent = styled.View`
  flex-direction: row;
  gap: 32px;
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const LeftColumn = styled.View`
  flex: 2;
  min-width: 0;
`;

const RightColumn = styled.View`
  flex: 1;
  min-width: 320px;
`;

const ProfileCard = styled.View`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 32px;
  margin-bottom: 16px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ProfileHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const ProfileAvatar = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const AvatarText = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
`;

const ProfileInfo = styled.View`
  flex: 1;
`;

const ProfileName = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #1A202C;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
`;

const ProfileUsername = styled.Text`
  font-size: 16px;
  color: #718096;
  margin-bottom: 16px;
  font-weight: 500;
`;

const ProfileHeadline = styled.Text`
  font-size: 18px;
  color: #4A5568;
  line-height: 26px;
  margin-bottom: 20px;
  font-weight: 400;
`;

const ProfileLocation = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const LocationText = styled.Text`
  font-size: 15px;
  color: #718096;
  margin-left: 6px;
  font-weight: 500;
`;

const ActionButtons = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 24px;
`;

const ActionButton = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' | 'following' }>`
  background-color: ${props => {
    if (props.variant === 'primary') return '#4299E1';
    if (props.variant === 'following') return '#38A169';
    return '#FFFFFF';
  }};
  padding: 10px 20px;
  border-radius: 24px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  border: 1px solid ${props => {
    if (props.variant === 'primary') return '#4299E1';
    if (props.variant === 'following') return '#38A169';
    return '#E2E8F0';
  }};
  min-width: 100px;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ActionButtonText = styled.Text<{ variant?: 'primary' | 'secondary' | 'following' }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => {
    if (props.variant === 'primary' || props.variant === 'following') return 'white';
    return '#4A5568';
  }};
`;

const SectionCard = styled.View`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 28px;
  margin-bottom: 16px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 20px;
  letter-spacing: -0.25px;
`;

const SectionContent = styled.Text`
  font-size: 15px;
  line-height: 24px;
  color: #4A5568;
  font-weight: 400;
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

const SkillTag = styled.View`
  background-color: #F7FAFC;
  border: 1px solid #E2E8F0;
  padding: 8px 16px;
  border-radius: 16px;
`;

const SkillText = styled.Text`
  font-size: 13px;
  color: #4A5568;
  font-weight: 600;
  letter-spacing: 0.25px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.View`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  flex: 1;
  min-width: 140px;
  border: 1px solid #E5E7EB;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const StatValue = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: #718096;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const ActivityList = styled.View`
  gap: 12px;
`;

const ActivityItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;
  background-color: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  margin-bottom: 1px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ActivityIcon = styled.View<{ bgColor: string }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => props.bgColor};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  margin-top: 2px;
`;

const ActivityContent = styled.View`
  flex: 1;
`;

const ActivityTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 4px;
  letter-spacing: -0.1px;
`;

const ActivityDescription = styled.Text`
  font-size: 13px;
  color: #718096;
  margin-bottom: 8px;
  line-height: 18px;
`;

const ActivityMeta = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ActivityTime = styled.Text`
  font-size: 11px;
  color: #A0AEC0;
  font-weight: 500;
`;

const ActivityReward = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #38A169;
  letter-spacing: 0.25px;
`;

const SocialLinks = styled.View`
  flex-direction: row;
  gap: 20px;
  margin-top: 20px;
`;

const SocialLink = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
`;

const SocialText = styled.Text`
  font-size: 13px;
  color: #4299E1;
  font-weight: 500;
`;

const NameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const VerificationBadge = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #4299E1;
  align-items: center;
  justify-content: center;
`;

const DesktopProfilePresentation: React.FC<DesktopProfilePresentationProps> = ({
  profile,
  profileStats,
  recentActivity,
  experienceData,
  isLoading,
  isEditing,
  refreshing,
  isOwnProfile,
  theme,
  isDesktop,
  onEdit,
  onSave,
  onCancel,
  onRefresh,
  onConnect,
  onMessage,
  onShare
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'referral_success':
        return { icon: 'check-circle', color: '#059669' };
      case 'profile_view':
        return { icon: 'visibility', color: '#1D4ED8' };
      case 'connection':
        return { icon: 'person-add', color: '#7C3AED' };
      default:
        return { icon: 'notifications', color: '#6B7280' };
    }
  };

  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <MainContent>
          <LeftColumn>
            {/* Profile Header Card */}
            <ProfileCard>
              <ProfileHeader>
                <ProfileAvatar>
                  <AvatarText>{getInitials(profile.fullName || profile.username)}</AvatarText>
                </ProfileAvatar>
                <ProfileInfo>
                  <NameContainer>
                    <ProfileName>{profile.fullName || profile.username}</ProfileName>
                    <VerificationBadge>
                      <MaterialIcons name="check" size={14} color="white" />
                    </VerificationBadge>
                  </NameContainer>
                  <ProfileUsername>@{profile.username}</ProfileUsername>
                  <ProfileHeadline>{profile.headline}</ProfileHeadline>
                  {profile.location && (
                    <ProfileLocation>
                      <MaterialIcons name="location-on" size={18} color="#718096" />
                      <LocationText>{profile.location}</LocationText>
                    </ProfileLocation>
                  )}
                  <ActionButtons>
                    {isOwnProfile ? (
                      <ActionButton variant="primary" onPress={onEdit}>
                        <MaterialIcons name="edit" size={16} color="white" />
                        <ActionButtonText variant="primary">Edit Profile</ActionButtonText>
                      </ActionButton>
                    ) : (
                      <>
                        <ActionButton variant="following" onPress={onConnect}>
                          <MaterialIcons name="check" size={16} color="white" />
                          <ActionButtonText variant="following">Following</ActionButtonText>
                        </ActionButton>
                        <ActionButton variant="secondary" onPress={onMessage}>
                          <MaterialIcons name="message" size={16} color="#4A5568" />
                          <ActionButtonText variant="secondary">Message</ActionButtonText>
                        </ActionButton>
                      </>
                    )}
                    <ActionButton variant="secondary" onPress={onShare}>
                      <MaterialIcons name="more-horiz" size={16} color="#4A5568" />
                      <ActionButtonText variant="secondary">More</ActionButtonText>
                    </ActionButton>
                  </ActionButtons>
                </ProfileInfo>
              </ProfileHeader>
              
              {/* Social Links */}
              {profile.socialLinks && (
                <SocialLinks>
                  {profile.socialLinks.linkedin && (
                    <SocialLink>
                      <FontAwesome name="linkedin" size={16} color="#1D4ED8" />
                      <SocialText>LinkedIn</SocialText>
                    </SocialLink>
                  )}
                  {profile.socialLinks.twitter && (
                    <SocialLink>
                      <FontAwesome name="twitter" size={16} color="#1D4ED8" />
                      <SocialText>Twitter</SocialText>
                    </SocialLink>
                  )}
                  {profile.socialLinks.github && (
                    <SocialLink>
                      <FontAwesome name="github" size={16} color="#1D4ED8" />
                      <SocialText>GitHub</SocialText>
                    </SocialLink>
                  )}
                  {profile.socialLinks.website && (
                    <SocialLink>
                      <MaterialIcons name="language" size={16} color="#1D4ED8" />
                      <SocialText>Website</SocialText>
                    </SocialLink>
                  )}
                </SocialLinks>
              )}
            </ProfileCard>

            {/* About Section */}
            {profile.summary && (
              <SectionCard>
                <SectionTitle>About</SectionTitle>
                <SectionContent>{profile.summary}</SectionContent>
              </SectionCard>
            )}

            {/* Experience Timeline Section */}
            {experienceData && experienceData.length > 0 && (
              <SectionCard>
                <SectionTitle>Experience</SectionTitle>
                <DesktopExperienceTimeline 
                  experiences={experienceData}
                  theme={theme}
                />
              </SectionCard>
            )}

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <SectionCard>
                <SectionTitle>Skills</SectionTitle>
                <SkillsContainer>
                  {profile.skills.map((skill, index) => (
                    <SkillTag key={index}>
                      <SkillText>{skill}</SkillText>
                    </SkillTag>
                  ))}
                </SkillsContainer>
              </SectionCard>
            )}
          </LeftColumn>

          <RightColumn>
            {/* Stats Section */}
            <StatsGrid>
              <StatCard>
                <StatValue>{profileStats.totalReferrals}</StatValue>
                <StatLabel>Total Referrals</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{profileStats.successfulReferrals}</StatValue>
                <StatLabel>Successful</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>${profileStats.totalEarnings.toLocaleString()}</StatValue>
                <StatLabel>Total Earnings</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{profileStats.successRate}%</StatValue>
                <StatLabel>Success Rate</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{profileStats.profileViews}</StatValue>
                <StatLabel>Profile Views</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{profileStats.connections}</StatValue>
                <StatLabel>Connections</StatLabel>
              </StatCard>
            </StatsGrid>

            {/* Recent Activity */}
            <SectionCard>
              <SectionTitle>Recent Activity</SectionTitle>
              <ActivityList>
                {recentActivity.map((activity) => {
                  const iconData = getActivityIcon(activity.type);
                  return (
                    <ActivityItem key={activity.id}>
                      <ActivityIcon bgColor={iconData.color}>
                        <MaterialIcons name={iconData.icon as any} size={20} color="white" />
                      </ActivityIcon>
                      <ActivityContent>
                        <ActivityTitle>{activity.title}</ActivityTitle>
                        <ActivityDescription>{activity.description}</ActivityDescription>
                        <ActivityMeta>
                          <ActivityTime>{activity.timestamp}</ActivityTime>
                          {activity.reward && (
                            <ActivityReward>{activity.reward}</ActivityReward>
                          )}
                        </ActivityMeta>
                      </ActivityContent>
                    </ActivityItem>
                  );
                })}
              </ActivityList>
            </SectionCard>
          </RightColumn>
        </MainContent>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <DesktopProfileEditModal
        isVisible={isEditing}
        profile={profile}
        theme={theme}
        onSave={onSave}
        onCancel={onCancel}
      />
    </Container>
  );
};

export default DesktopProfilePresentation;
