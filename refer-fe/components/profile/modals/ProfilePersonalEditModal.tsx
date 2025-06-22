import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import ProfileEditModal from './ProfileEditModal';
import { useTheme } from '../../../context/ThemeContext';

interface UserInfo {
  name: string;
  bio: string;
  company?: string;
  position?: string;
  location?: string;
  website?: string;
}

interface ProfilePersonalEditModalProps {
  visible: boolean;
  onClose: () => void;
  userData: UserInfo;
  onSave: (data: UserInfo) => void;
}

const ProfilePersonalEditModal: React.FC<ProfilePersonalEditModalProps> = ({
  visible,
  onClose,
  userData,
  onSave
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<UserInfo>(userData);

  const handleChange = (field: keyof UserInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Check if name and bio are filled (required fields)
  const isFormValid = formData.name.trim() !== '' && formData.bio.trim() !== '';

  return (
    <ProfileEditModal
      visible={visible}
      title="Edit Personal Info"
      onClose={onClose}
      onSave={handleSave}
      saveDisabled={!isFormValid}
    >
      <FormGroup>
        <FormLabel>Full Name *</FormLabel>
        <FormInput
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Your full name"
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Bio *</FormLabel>
        <FormTextArea
          value={formData.bio}
          onChangeText={(value) => handleChange('bio', value)}
          placeholder="Write a short bio about yourself"
          placeholderTextColor={theme.colors.secondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Current Position</FormLabel>
        <FormInput
          value={formData.position}
          onChangeText={(value) => handleChange('position', value)}
          placeholder="E.g. Senior Software Engineer"
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Company</FormLabel>
        <FormInput
          value={formData.company}
          onChangeText={(value) => handleChange('company', value)}
          placeholder="E.g. Google, Inc."
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Location</FormLabel>
        <FormInput
          value={formData.location}
          onChangeText={(value) => handleChange('location', value)}
          placeholder="E.g. San Francisco, CA"
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Website</FormLabel>
        <FormInput
          value={formData.website}
          onChangeText={(value) => handleChange('website', value)}
          placeholder="E.g. https://yourwebsite.com"
          placeholderTextColor={theme.colors.secondary}
          autoCapitalize="none"
          keyboardType="url"
        />
      </FormGroup>
      
      <RequiredFieldsNote>* Required fields</RequiredFieldsNote>
    </ProfileEditModal>
  );
};

const FormGroup = styled.View`
  margin-bottom: 16px;
`;

const FormLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

const FormInput = styled.TextInput`
  background-color: ${props => props.theme.colors.background};
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

const FormTextArea = styled.TextInput`
  background-color: ${props => props.theme.colors.background};
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  min-height: 100px;
`;

const RequiredFieldsNote = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 8px;
`;

export default ProfilePersonalEditModal;
