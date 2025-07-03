import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from './ProfileEditModal';
import { useTheme } from '../../../context/ThemeContext';

interface ProfilePhoto {
  profileImage: string;
  coverImage: string;
}

interface ProfilePhotosEditModalProps {
  visible: boolean;
  onClose: () => void;
  photos: ProfilePhoto;
  onSave: (photos: ProfilePhoto) => void;
}

const ProfilePhotosEditModal: React.FC<ProfilePhotosEditModalProps> = ({
  visible,
  onClose,
  photos,
  onSave
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ProfilePhoto>(photos);

  const handleChange = (field: keyof ProfilePhoto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };
  
  // In a real app, these functions would open image picker
  const handlePickProfileImage = () => {
    // This is a mock implementation. In a real app, you would use something like 
    // react-native-image-picker or expo-image-picker
    Alert.alert(
      "Select Profile Image Source",
      "Choose where you want to select your profile image from",
      [
        {
          text: "Camera",
          onPress: () => {
            // Mock camera capture result
            const mockNewImage = "https://randomuser.me/api/portraits/men/33.jpg";
            handleChange('profileImage', mockNewImage);
            Alert.alert("Success", "Profile photo updated");
          }
        },
        {
          text: "Gallery",
          onPress: () => {
            // Mock gallery selection result
            const mockNewImage = "https://randomuser.me/api/portraits/men/34.jpg";
            handleChange('profileImage', mockNewImage);
            Alert.alert("Success", "Profile photo updated");
          }
        },
        {
          text: "Enter URL",
          onPress: () => {
            // In a real app, this would open a text input dialog
            const mockUrl = "https://randomuser.me/api/portraits/men/35.jpg";
            handleChange('profileImage', mockUrl);
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };
  
  const handlePickCoverImage = () => {
    // Mock implementation similar to profile image
    Alert.alert(
      "Select Cover Image Source",
      "Choose where you want to select your cover image from",
      [
        {
          text: "Camera",
          onPress: () => {
            const mockNewImage = "https://images.unsplash.com/photo-1611944212129-29977ae1398c";
            handleChange('coverImage', mockNewImage);
            Alert.alert("Success", "Cover photo updated");
          }
        },
        {
          text: "Gallery",
          onPress: () => {
            const mockNewImage = "https://images.unsplash.com/photo-1557682250-2eb0265fecfb";
            handleChange('coverImage', mockNewImage);
            Alert.alert("Success", "Cover photo updated");
          }
        },
        {
          text: "Enter URL",
          onPress: () => {
            const mockUrl = "https://images.unsplash.com/photo-1579546929662-711aa81148cf";
            handleChange('coverImage', mockUrl);
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <ProfileEditModal
      visible={visible}
      title="Edit Profile Photos"
      onClose={onClose}
      onSave={handleSave}
    >
      <Section>
        <SectionTitle>Profile Photo</SectionTitle>
        <PhotoContainer>
          <ProfileImageContainer>
            {formData.profileImage ? (
              <ProfileImage source={{ uri: formData.profileImage }} />
            ) : (
              <EmptyProfileImage>
                <Ionicons name="person" size={40} color={theme.colors.secondary} />
              </EmptyProfileImage>
            )}
          </ProfileImageContainer>
          
          <ButtonsContainer>
            <ActionButton onPress={handlePickProfileImage}>
              <Ionicons name="camera" size={20} color="white" style={{ marginRight: 8 }} />
              <ActionButtonText>Change Profile Photo</ActionButtonText>
            </ActionButton>
            
            {formData.profileImage && (
              <RemoveButton 
                onPress={() => handleChange('profileImage', '')}
              >
                <Ionicons name="trash-outline" size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
                <RemoveButtonText>Remove</RemoveButtonText>
              </RemoveButton>
            )}
          </ButtonsContainer>
        </PhotoContainer>
      </Section>
      
      <Divider />
      
      <Section>
        <SectionTitle>Cover Photo</SectionTitle>
        <CoverPhotoContainer>
          {formData.coverImage ? (
            <CoverImage source={{ uri: formData.coverImage }} />
          ) : (
            <EmptyCoverImage>
              <Ionicons name="image-outline" size={40} color={theme.colors.secondary} />
            </EmptyCoverImage>
          )}
        </CoverPhotoContainer>
        
        <ButtonsContainer>
          <ActionButton onPress={handlePickCoverImage}>
            <Ionicons name="image" size={20} color="white" style={{ marginRight: 8 }} />
            <ActionButtonText>Change Cover Photo</ActionButtonText>
          </ActionButton>
          
          {formData.coverImage && (
            <RemoveButton 
              onPress={() => handleChange('coverImage', '')}
            >
              <Ionicons name="trash-outline" size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
              <RemoveButtonText>Remove</RemoveButtonText>
            </RemoveButton>
          )}
        </ButtonsContainer>
      </Section>
      
      <InfoText>
        Use high quality images for best results. Recommended sizes: 
        Profile Photo (400x400px), Cover Photo (1500x500px).
      </InfoText>
    </ProfileEditModal>
  );
};

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
`;

const PhotoContainer = styled.View`
  align-items: center;
`;

const ProfileImageContainer = styled.View`
  margin-bottom: 16px;
`;

const ProfileImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
`;

const EmptyProfileImage = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${props => props.theme.colors.background};
  align-items: center;
  justify-content: center;
  border: 1px dashed ${props => props.theme.colors.border};
`;

const CoverPhotoContainer = styled.View`
  width: 100%;
  height: 120px;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const EmptyCoverImage = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.background};
  align-items: center;
  justify-content: center;
  border: 1px dashed ${props => props.theme.colors.border};
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  padding: 12px 16px;
  border-radius: 8px;
  margin: 4px;
`;

const ActionButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const RemoveButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  padding: 12px 16px;
  border-radius: 8px;
  margin: 4px;
`;

const RemoveButtonText = styled.Text`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  font-weight: 500;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: 8px 0 24px;
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  margin-top: 16px;
`;

export default ProfilePhotosEditModal;
