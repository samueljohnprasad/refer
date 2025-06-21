import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';

// Types
interface PostPreviewProps {
  data: {
    title: string;
    interestStatement: string;
    skills: string[];
    experience: string;
    education: string;
    privacyOption: 'Public' | 'Private' | 'Anonymous';
    expiryDays: number;
    resumeFile?: string;
  };
  onClose: () => void;
}

// Styled components
const ModalOverlay = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.text}20;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const PreviewContainer = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  width: 100%;
  max-height: 80%;
  overflow: hidden;
`;

const PreviewHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const PreviewTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

const PreviewContent = styled.ScrollView`
  padding: 16px;
`;

const ProfileHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const ProfileIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${props => props.theme.colors.primary}20;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const ProfileName = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const RoleText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const PrivacyBadge = styled.View<{ privacy: string }>`
  background-color: ${props => {
    switch(props.privacy) {
      case 'Public': return props.theme.colors.success + '20';
      case 'Private': return props.theme.colors.secondary + '20';
      case 'Anonymous': return props.theme.colors.text + '20';
      default: return props.theme.colors.border;
    }
  }};
  padding: 4px 8px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-top: 4px;
`;

const PrivacyText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  margin-left: 4px;
  font-weight: 500;
`;

const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  margin-top: 16px;
`;

const Description = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  line-height: 20px;
  margin-bottom: 8px;
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const SkillTag = styled.View`
  background-color: ${props => props.theme.colors.primary}20;
  padding: 6px 12px;
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const SkillText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const InfoText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-left: 8px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border}80;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const FilePreview = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  margin-top: 8px;
`;

const FileIcon = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.primary}20;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const FileName = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const FooterContainer = styled.View`
  padding: 16px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 12px 16px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: ${props => props.theme.typography.fontSize.md}px;
`;

export default function PostPreview({ data, onClose }: PostPreviewProps) {
  const { theme } = useTheme();
  const today = new Date();
  const expiryDate = new Date(today);
  expiryDate.setDate(today.getDate() + data.expiryDays);

  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get privacy icon
  const getPrivacyIcon = () => {
    switch(data.privacyOption) {
      case 'Public': return 'globe';
      case 'Private': return 'lock';
      case 'Anonymous': return 'user-secret';
      default: return 'globe';
    }
  };

  // Get profile display name based on privacy
  const getDisplayName = () => {
    return data.privacyOption === 'Anonymous' ? 'Anonymous User' : 'John Doe';
  };

  return (
    <ModalOverlay>
      <PreviewContainer style={{
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5
      }}>
        <PreviewHeader>
          <PreviewTitle>Post Preview</PreviewTitle>
          <CloseButton onPress={onClose}>
            <FontAwesome name="times" size={20} color={theme.colors.text} />
          </CloseButton>
        </PreviewHeader>
        
        <PreviewContent>
          <ProfileHeader>
            <ProfileIcon>
              {data.privacyOption === 'Anonymous' ? (
                <FontAwesome name="user-secret" size={24} color={theme.colors.text} />
              ) : (
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.colors.primary }}>
                  JD
                </Text>
              )}
            </ProfileIcon>
            <View style={{ flex: 1 }}>
              <ProfileName>{getDisplayName()}</ProfileName>
              <RoleText>{data.title}</RoleText>
              <PrivacyBadge privacy={data.privacyOption}>
                <FontAwesome name={getPrivacyIcon()} size={12} color={theme.colors.text} />
                <PrivacyText>{data.privacyOption}</PrivacyText>
              </PrivacyBadge>
            </View>
          </ProfileHeader>
          
          <SectionTitle>Interest Statement</SectionTitle>
          <Description>{data.interestStatement}</Description>
          
          <SectionTitle>Skills</SectionTitle>
          <SkillsContainer>
            {data.skills.map((skill, index) => (
              <SkillTag key={index}>
                <SkillText>{skill}</SkillText>
              </SkillTag>
            ))}
          </SkillsContainer>
          
          {data.experience && (
            <>
              <SectionTitle>Experience</SectionTitle>
              <Description>{data.experience}</Description>
            </>
          )}
          
          {data.education && (
            <>
              <SectionTitle>Education</SectionTitle>
              <Description>{data.education}</Description>
            </>
          )}
          
          {data.resumeFile && (
            <>
              <SectionTitle>Resume</SectionTitle>
              <FilePreview>
                <FileIcon>
                  <FontAwesome name="file-pdf-o" size={20} color={theme.colors.primary} />
                </FileIcon>
                <FileName>my_professional_resume.pdf</FileName>
              </FilePreview>
            </>
          )}
          
          <Divider />
          
          <View>
            <InfoRow>
              <FontAwesome name="calendar" size={14} color={theme.colors.text} />
              <InfoText>Posted on {formatDate(today)}</InfoText>
            </InfoRow>
            <InfoRow>
              <FontAwesome name="clock-o" size={14} color={theme.colors.text} />
              <InfoText>Expires on {formatDate(expiryDate)} ({data.expiryDays} days)</InfoText>
            </InfoRow>
          </View>
        </PreviewContent>
        
        <FooterContainer>
          <Button onPress={onClose}>
            <ButtonText>Close Preview</ButtonText>
          </Button>
        </FooterContainer>
      </PreviewContainer>
    </ModalOverlay>
  );
}
