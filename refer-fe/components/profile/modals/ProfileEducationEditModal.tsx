import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from './ProfileEditModal';
import { useTheme } from '../../../context/ThemeContext';

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description?: string;
  logo?: string;
}

interface ProfileEducationEditModalProps {
  visible: boolean;
  onClose: () => void;
  education?: EducationItem;
  onSave: (education: EducationItem) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
}

const ProfileEducationEditModal: React.FC<ProfileEducationEditModalProps> = ({
  visible,
  onClose,
  education,
  onSave,
  onDelete,
  isNew = false
}) => {
  const { theme } = useTheme();
  
  const defaultEducation: EducationItem = {
    id: '',
    degree: '',
    institution: '',
    year: '',
    description: ''
  };
  
  const [formData, setFormData] = useState<EducationItem>(education || defaultEducation);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (visible) {
      setFormData(education || defaultEducation);
    }
  }, [visible, education]);

  const handleChange = (field: keyof EducationItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Generate ID if new
    const updatedEducation = isNew 
      ? { ...formData, id: `edu-${Date.now()}` } 
      : formData;
    
    onSave(updatedEducation);
    onClose();
  };
  
  const handleDelete = () => {
    if (!isNew && formData.id && onDelete) {
      Alert.alert(
        'Delete Education',
        'Are you sure you want to remove this education from your profile?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              onDelete(formData.id);
              onClose();
            }
          }
        ]
      );
    }
  };

  // Check if required fields are filled
  const isFormValid = 
    formData.degree.trim() !== '' && 
    formData.institution.trim() !== '' && 
    formData.year.trim() !== '';

  return (
    <ProfileEditModal
      visible={visible}
      title={isNew ? "Add Education" : "Edit Education"}
      onClose={onClose}
      onSave={handleSave}
      saveDisabled={!isFormValid}
    >
      <FormGroup>
        <FormLabel>Degree / Certification *</FormLabel>
        <FormInput
          value={formData.degree}
          onChangeText={(value) => handleChange('degree', value)}
          placeholder="E.g. Bachelor of Science in Computer Science"
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Institution *</FormLabel>
        <FormInput
          value={formData.institution}
          onChangeText={(value) => handleChange('institution', value)}
          placeholder="E.g. Stanford University"
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Graduation Year *</FormLabel>
        <FormInput
          value={formData.year}
          onChangeText={(value) => handleChange('year', value)}
          placeholder="E.g. 2020"
          placeholderTextColor={theme.colors.secondary}
          keyboardType="number-pad"
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Description</FormLabel>
        <FormTextArea
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Mention relevant coursework, achievements, etc."
          placeholderTextColor={theme.colors.secondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Institution Logo URL (optional)</FormLabel>
        <FormInput
          value={formData.logo}
          onChangeText={(value) => handleChange('logo', value)}
          placeholder="https://..."
          placeholderTextColor={theme.colors.secondary}
          autoCapitalize="none"
          keyboardType="url"
        />
      </FormGroup>
      
      {!isNew && (
        <DeleteButtonContainer>
          <DeleteButton onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="white" style={{ marginRight: 8 }} />
            <DeleteButtonText>Delete This Education</DeleteButtonText>
          </DeleteButton>
        </DeleteButtonContainer>
      )}
      
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

const DeleteButtonContainer = styled.View`
  margin-top: 24px;
  margin-bottom: 16px;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.error};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 8px;
`;

const DeleteButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const RequiredFieldsNote = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 8px;
`;

export default ProfileEducationEditModal;
