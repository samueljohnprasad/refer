import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface ResumeInfo {
  id: string;
  name: string;
  url: string;
  fileSize: string;
  uploadDate: string;
  fileType: string;
}

interface ProfileResumeProps {
  resume?: ResumeInfo;
  editable?: boolean;
  onUploadResume?: () => void;
  onViewResume?: (resume: ResumeInfo) => void;
  onDeleteResume?: (resumeId: string) => void;
}

const ProfileResume: React.FC<ProfileResumeProps> = ({
  resume,
  editable = false,
  onUploadResume,
  onViewResume,
  onDeleteResume
}) => {
  const { theme } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'document-text-outline';
      case 'doc':
      case 'docx':
        return 'document-outline';
      default:
        return 'document-outline';
    }
  };

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Resume</SectionTitle>
        <PrivacyRow>
          <PrivacyIndicator>
            <Ionicons name="eye-outline" size={14} color={theme.colors.secondary} />
            <PrivacyText>Public</PrivacyText>
          </PrivacyIndicator>
          {editable && (
            <PrivacyButton>
              <PrivacyButtonText>Change</PrivacyButtonText>
            </PrivacyButton>
          )}
        </PrivacyRow>
      </SectionHeader>

      {resume ? (
        <ResumeContainer>
          <ResumeIconContainer fileType={resume.fileType.toLowerCase()}>
            <Ionicons 
              name={getFileIcon(resume.fileType)} 
              size={24} 
              color="white" 
            />
          </ResumeIconContainer>
          
          <ResumeDetails>
            <ResumeTitle>{resume.name}</ResumeTitle>
            <ResumeInfo>
              {resume.fileSize} • {resume.fileType.toUpperCase()} • Uploaded {resume.uploadDate}
            </ResumeInfo>
          </ResumeDetails>
          
          <ActionButtons>
            <ActionButton onPress={() => onViewResume?.(resume)}>
              <Ionicons name="eye-outline" size={18} color={theme.colors.text} />
            </ActionButton>
            {editable && (
              <ActionButton onPress={() => setShowOptions(!showOptions)}>
                <Ionicons name="ellipsis-vertical" size={18} color={theme.colors.text} />
              </ActionButton>
            )}
          </ActionButtons>
          
          {showOptions && (
            <OptionsMenu>
              <OptionItem onPress={onUploadResume}>
                <Ionicons name="refresh-outline" size={16} color={theme.colors.text} />
                <OptionText>Replace</OptionText>
              </OptionItem>
              <OptionItem onPress={() => onDeleteResume?.(resume.id)}>
                <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                <OptionText style={{ color: theme.colors.error }}>Delete</OptionText>
              </OptionItem>
            </OptionsMenu>
          )}
        </ResumeContainer>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <Ionicons name="document-outline" size={32} color={theme.colors.secondary} />
          </EmptyIcon>
          <EmptyText>No resume uploaded yet</EmptyText>
          <EmptyHelpText>
            Upload your resume to easily apply for jobs and get referrals
          </EmptyHelpText>
          {editable && (
            <UploadButton onPress={onUploadResume}>
              <Ionicons name="cloud-upload-outline" size={16} color="white" style={{ marginRight: 8 }} />
              <UploadButtonText>Upload Resume</UploadButtonText>
            </UploadButton>
          )}
        </EmptyState>
      )}
    </Container>
  );
};

const Container = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  margin: 0 16px 16px;
  padding: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 2;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const PrivacyRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PrivacyIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  padding: 4px 8px;
  border-radius: 12px;
`;

const PrivacyText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-left: 4px;
`;

const PrivacyButton = styled.TouchableOpacity`
  margin-left: 8px;
`;

const PrivacyButtonText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.primary};
`;

const ResumeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm}px;
  padding: 12px;
  position: relative;
`;

interface ResumeIconProps {
  fileType: string;
}

const ResumeIconContainer = styled.View<ResumeIconProps>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => {
    switch(props.fileType) {
      case 'pdf': return '#FF5252';
      case 'doc':
      case 'docx': return '#2196F3';
      default: return '#9E9E9E';
    }
  }};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const ResumeDetails = styled.View`
  flex: 1;
`;

const ResumeTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ResumeInfo = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 2px;
`;

const ActionButtons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ActionButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

const OptionsMenu = styled.View`
  position: absolute;
  top: 50px;
  right: 8px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.sm}px;
  padding: 4px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
  z-index: 1;
`;

const OptionItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
`;

const OptionText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  margin-left: 8px;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: 24px 0;
`;

const EmptyIcon = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const EmptyHelpText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  margin-bottom: 16px;
  padding: 0 16px;
`;

const UploadButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 10px 20px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
`;

const UploadButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

export default ProfileResume;
