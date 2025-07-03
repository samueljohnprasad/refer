import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from './ProfileEditModal';
import { useTheme } from '../../../context/ThemeContext';

interface ResumeInfo {
  id: string;
  name: string;
  url: string;
  fileSize: string;
  uploadDate: string;
  fileType: string;
}

interface ProfileResumeEditModalProps {
  visible: boolean;
  onClose: () => void;
  resume?: ResumeInfo;
  onSave: (resume: ResumeInfo | undefined) => void;
  onDelete?: () => void;
}

const ProfileResumeEditModal: React.FC<ProfileResumeEditModalProps> = ({
  visible,
  onClose,
  resume,
  onSave,
  onDelete
}) => {
  const { theme } = useTheme();
  const [uploadedResume, setUploadedResume] = useState<ResumeInfo | undefined>(resume);
  const [isUploading, setIsUploading] = useState(false);

  // Mock file upload function - in a real app this would use a document picker
  const handleUploadResume = () => {
    setIsUploading(true);
    
    // Simulate network request
    setTimeout(() => {
      // Mock new resume data
      const newResume: ResumeInfo = {
        id: `resume-${Date.now()}`,
        name: 'My_Professional_Resume.pdf',
        url: 'https://example.com/resume.pdf',
        fileSize: '1.8 MB',
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        fileType: 'pdf'
      };
      
      setUploadedResume(newResume);
      setIsUploading(false);
      Alert.alert('Success', 'Resume uploaded successfully');
    }, 2000);
  };
  
  const handleReplaceResume = () => {
    Alert.alert(
      'Replace Resume',
      'Are you sure you want to replace your current resume?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Replace', 
          onPress: handleUploadResume
        }
      ]
    );
  };
  
  const handleDeleteResume = () => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to remove your resume from your profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setUploadedResume(undefined);
            if (onDelete) {
              onDelete();
            }
          }
        }
      ]
    );
  };

  const handleSave = () => {
    onSave(uploadedResume);
    onClose();
  };

  return (
    <ProfileEditModal
      visible={visible}
      title="Manage Resume"
      onClose={onClose}
      onSave={handleSave}
    >
      {uploadedResume ? (
        <ResumeContainer>
          <ResumeIconContainer fileType={uploadedResume.fileType.toLowerCase()}>
            <Ionicons 
              name="document-text-outline" 
              size={32} 
              color="white" 
            />
          </ResumeIconContainer>
          
          <ResumeDetails>
            <ResumeTitle>{uploadedResume.name}</ResumeTitle>
            <ResumeInfo>
              {uploadedResume.fileSize} • {uploadedResume.fileType.toUpperCase()}
            </ResumeInfo>
            <ResumeInfo>
              Uploaded on {uploadedResume.uploadDate}
            </ResumeInfo>
          </ResumeDetails>
          
          <ButtonsContainer>
            <ActionButton onPress={handleReplaceResume}>
              <Ionicons name="refresh-outline" size={18} color="white" style={{ marginRight: 8 }} />
              <ActionButtonText>Replace</ActionButtonText>
            </ActionButton>
            
            <DeleteButton onPress={handleDeleteResume}>
              <Ionicons name="trash-outline" size={18} color="white" style={{ marginRight: 8 }} />
              <DeleteButtonText>Delete</DeleteButtonText>
            </DeleteButton>
          </ButtonsContainer>
        </ResumeContainer>
      ) : (
        <EmptyResumeContainer>
          <EmptyResumeIcon>
            <Ionicons name="document-outline" size={48} color={theme.colors.secondary} />
          </EmptyResumeIcon>
          
          <EmptyResumeTitle>No Resume Uploaded</EmptyResumeTitle>
          <EmptyResumeText>
            Upload your resume to easily apply for jobs and get referrals from professionals in your network.
          </EmptyResumeText>
          
          <UploadResumeButton onPress={handleUploadResume} disabled={isUploading}>
            {isUploading ? (
              <UploadButtonText>Uploading...</UploadButtonText>
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={18} color="white" style={{ marginRight: 8 }} />
                <UploadButtonText>Upload Resume</UploadButtonText>
              </>
            )}
          </UploadResumeButton>
        </EmptyResumeContainer>
      )}
      
      <PrivacySection>
        <PrivacySectionTitle>Resume Privacy</PrivacySectionTitle>
        <PrivacyOption>
          <RadioButton selected={true}>
            <RadioButtonInner />
          </RadioButton>
          <PrivacyOptionContent>
            <PrivacyOptionTitle>Public</PrivacyOptionTitle>
            <PrivacyOptionDescription>
              Your resume is visible to all users who view your profile
            </PrivacyOptionDescription>
          </PrivacyOptionContent>
        </PrivacyOption>
        
        <PrivacyOption>
          <RadioButton selected={false} />
          <PrivacyOptionContent>
            <PrivacyOptionTitle>Limited</PrivacyOptionTitle>
            <PrivacyOptionDescription>
              Your resume is only visible to users when you apply for a job or request a referral
            </PrivacyOptionDescription>
          </PrivacyOptionContent>
        </PrivacyOption>
        
        <PrivacyOption>
          <RadioButton selected={false} />
          <PrivacyOptionContent>
            <PrivacyOptionTitle>Private</PrivacyOptionTitle>
            <PrivacyOptionDescription>
              Your resume is only visible to you
            </PrivacyOptionDescription>
          </PrivacyOptionContent>
        </PrivacyOption>
      </PrivacySection>
      
      <InfoText>
        Accepted file formats: PDF, DOCX, DOC (Max size: 5MB)
      </InfoText>
    </ProfileEditModal>
  );
};

const ResumeContainer = styled.View`
  flex-direction: row;
  padding: 16px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  margin-bottom: 24px;
  align-items: center;
`;

interface ResumeIconProps {
  fileType: string;
}

const ResumeIconContainer = styled.View<ResumeIconProps>`
  width: 60px;
  height: 60px;
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
  margin-right: 16px;
`;

const ResumeDetails = styled.View`
  flex: 1;
`;

const ResumeTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ResumeInfo = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
`;

const ButtonsContainer = styled.View`
  flex-direction: column;
  justify-content: space-around;
  height: 80px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  padding: 8px 16px;
  border-radius: 6px;
`;

const ActionButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const DeleteButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.error};
  padding: 8px 16px;
  border-radius: 6px;
`;

const DeleteButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const EmptyResumeContainer = styled.View`
  align-items: center;
  padding: 24px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  margin-bottom: 24px;
`;

const EmptyResumeIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${props => props.theme.colors.card};
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const EmptyResumeTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const EmptyResumeText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  margin-bottom: 20px;
`;

const UploadResumeButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  padding: 12px 20px;
  border-radius: 8px;
`;

const UploadButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const PrivacySection = styled.View`
  margin-bottom: 24px;
`;

const PrivacySectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
`;

const PrivacyOption = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 16px;
`;

interface RadioButtonProps {
  selected: boolean;
}

const RadioButton = styled.View<RadioButtonProps>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  margin-top: 2px;
`;

const RadioButtonInner = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.primary};
`;

const PrivacyOptionContent = styled.View`
  flex: 1;
`;

const PrivacyOptionTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2px;
`;

const PrivacyOptionDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
`;

export default ProfileResumeEditModal;
