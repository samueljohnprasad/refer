import React, { useState } from 'react';
import { View, ScrollView, Modal, Alert, TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ReferrerPost } from './PostCard';

interface ReferrerPostDetailProps {
  visible: boolean;
  post: ReferrerPost | null;
  onClose: () => void;
  onApply?: () => void;
}

const ReferrerPostDetail: React.FC<ReferrerPostDetailProps> = ({
  visible,
  post,
  onClose,
  onApply
}) => {
  const { theme } = useTheme();
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // If there's no post to display
  if (!post) return null;

  // Calculate days left for expiration
  const daysLeft = post.expiresAt ? 
    Math.ceil((post.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  const handleApply = (): void => {
    setIsApplying(true);
    // Show a simple confirmation for now
    setTimeout(() => {
      setIsApplying(false);
      Alert.alert(
        "Application Submitted",
        "Your application has been sent to the referrer. You will be notified when they respond.",
        [{ text: "OK", onPress: onClose }]
      );
      if (onApply) onApply();
    }, 1000);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Container>
        <ContentCard>
          <HeaderRow>
            <HeaderTitle>Referrer Post</HeaderTitle>
            <CloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </CloseButton>
          </HeaderRow>

          <ScrollView showsVerticalScrollIndicator={false}>
            <UserInfoSection>
              <UserAvatar>
                <FontAwesome name="user" size={26} color={theme.colors.primary} />
              </UserAvatar>
              <UserInfoContent>
                <UserName>{post.user}</UserName>
                <PostTime>Posted on {post.createdAt}</PostTime>
              </UserInfoContent>
            </UserInfoSection>

            <Divider />

            <Section>
              <SectionTitle>Company</SectionTitle>
              <CompanyContainer>
                <CompanyIconContainer>
                  <FontAwesome name="building" size={20} color={theme.colors.primary} />
                </CompanyIconContainer>
                <CompanyName>{post.company}</CompanyName>
              </CompanyContainer>
            </Section>

            <Section>
              <SectionTitle>Role</SectionTitle>
              <RoleContainer>
                <RoleText>{post.role}</RoleText>
                <StatusBadge isActive={post.status.toLowerCase() === 'active'}>
                  <FontAwesome 
                    name={post.status.toLowerCase() === 'active' ? 'check-circle' : 'clock-o'} 
                    size={14}
                    color="white" 
                  />
                  <StatusText>{post.status}</StatusText>
                </StatusBadge>
              </RoleContainer>
            </Section>

            <Section>
              <SectionTitle>Description</SectionTitle>
              <DescriptionText>{post.description}</DescriptionText>
            </Section>

            <Section>
              <SectionTitle>What to Expect</SectionTitle>
              <ExpectationCard>
                <ExpectationItem>
                  <ExpectationIcon>
                    <FontAwesome name="check" size={14} color={theme.colors.success} />
                  </ExpectationIcon>
                  <ExpectationText>Direct referral to hiring team</ExpectationText>
                </ExpectationItem>
                <ExpectationItem>
                  <ExpectationIcon>
                    <FontAwesome name="check" size={14} color={theme.colors.success} />
                  </ExpectationIcon>
                  <ExpectationText>Resume will be reviewed within 48 hours</ExpectationText>
                </ExpectationItem>
                <ExpectationItem>
                  <ExpectationIcon>
                    <FontAwesome name="check" size={14} color={theme.colors.success} />
                  </ExpectationIcon>
                  <ExpectationText>Chat directly with the referrer</ExpectationText>
                </ExpectationItem>
              </ExpectationCard>
            </Section>

            <Section>
              <SectionTitle>Expiration</SectionTitle>
              <ExpiryInfoCard isExpiringSoon={daysLeft !== null && daysLeft <= 7}>
                <FontAwesome 
                  name="calendar" 
                  size={16} 
                  color={daysLeft && daysLeft <= 7 ? theme.colors.error : theme.colors.primary} 
                />
                <ExpiryText isExpiringSoon={daysLeft !== null && daysLeft <= 7}>
                  {daysLeft !== null
                    ? `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
                    : 'No expiration set'}
                </ExpiryText>
              </ExpiryInfoCard>
            </Section>

            <ActionSection>
              <ApplyButton 
                disabled={isApplying}
                isApplying={isApplying} 
                onPress={handleApply}
              >
                {isApplying ? (
                  <ApplyButtonText>Sending Application...</ApplyButtonText>
                ) : (
                  <>
                    <FontAwesome name="paper-plane" size={16} color="white" style={{ marginRight: 8 }} />
                    <ApplyButtonText>Apply For Referral</ApplyButtonText>
                  </>
                )}
              </ApplyButton>
              <ButtonRow>
                <SecondaryButton>
                  <FontAwesome name="share" size={16} color={theme.colors.primary} />
                  <SecondaryButtonText>Share</SecondaryButtonText>
                </SecondaryButton>
                <SecondaryButton>
                  <FontAwesome name="bookmark" size={16} color={theme.colors.primary} />
                  <SecondaryButtonText>Save</SecondaryButtonText>
                </SecondaryButton>
              </ButtonRow>
            </ActionSection>
          </ScrollView>
        </ContentCard>
      </Container>
    </Modal>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ContentCard = styled.View`
  width: 94%;
  max-height: 90%;
  background-color: ${props => props.theme.colors.card};
  border-radius: 16px;
  padding: 20px;
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
  ` : `
    elevation: 5;
  `}
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

const UserInfoSection = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const UserAvatar = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const UserInfoContent = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const PostTime = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin-top: 16px;
  margin-bottom: 16px;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const CompanyContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CompanyIconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const CompanyName = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
`;

const RoleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.background};
  padding: 12px 16px;
  border-radius: 8px;
`;

const RoleText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

interface StatusBadgeProps {
  isActive: boolean;
}

const StatusBadge = styled.View<StatusBadgeProps>`
  background-color: ${props => props.isActive ? props.theme.colors.success : props.theme.colors.warning};
  padding: 6px 10px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
`;

const StatusText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  line-height: 22px;
  background-color: ${props => props.theme.colors.background};
  padding: 16px;
  border-radius: 8px;
`;

const ExpectationCard = styled.View`
  background-color: ${props => props.theme.colors.background};
  padding: 16px;
  border-radius: 8px;
`;

const ExpectationItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const ExpectationIcon = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.theme.colors.success + '20'};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const ExpectationText = styled.Text`
  font-size: 15px;
  color: ${props => props.theme.colors.text};
`;

interface ExpiryProps {
  isExpiringSoon: boolean;
}

const ExpiryInfoCard = styled.View<ExpiryProps>`
  background-color: ${props => props.isExpiringSoon 
    ? props.theme.colors.error + '15'
    : props.theme.colors.background};
  padding: 12px 16px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const ExpiryText = styled.Text<ExpiryProps>`
  color: ${props => props.isExpiringSoon 
    ? props.theme.colors.error
    : props.theme.colors.text};
  font-size: 15px;
  font-weight: ${props => props.isExpiringSoon ? '600' : '400'};
  margin-left: 8px;
`;

const ActionSection = styled.View`
  margin-top: 20px;
  margin-bottom: 20px;
`;

interface ApplyButtonProps {
  isApplying: boolean;
}

const ApplyButton = styled.TouchableOpacity<ApplyButtonProps>`
  background-color: ${props => props.isApplying 
    ? props.theme.colors.primary + '80'
    : props.theme.colors.primary};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-bottom: 16px;
`;

const ApplyButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SecondaryButton = styled.TouchableOpacity`
  flex: 0.48;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background};
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const SecondaryButtonText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
`;

export default ReferrerPostDetail;
