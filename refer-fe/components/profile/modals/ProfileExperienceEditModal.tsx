import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, Switch } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from './ProfileEditModal';
import { useTheme } from '../../../context/ThemeContext';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description?: string;
  logo?: string;
  current?: boolean;
  startDate?: string;
  endDate?: string;
}

interface ProfileExperienceEditModalProps {
  visible: boolean;
  onClose: () => void;
  experience?: ExperienceItem;
  onSave: (experience: ExperienceItem) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
}

const ProfileExperienceEditModal: React.FC<ProfileExperienceEditModalProps> = ({
  visible,
  onClose,
  experience,
  onSave,
  onDelete,
  isNew = false
}) => {
  const { theme } = useTheme();
  
  const defaultExperience: ExperienceItem = {
    id: '',
    role: '',
    company: '',
    duration: '',
    description: '',
    current: true,
    startDate: '',
    endDate: ''
  };
  
  const [formData, setFormData] = useState<ExperienceItem>(experience || defaultExperience);

  // Reset form when modal opens with new data
  React.useEffect(() => {
    if (visible) {
      setFormData(experience || defaultExperience);
    }
  }, [visible, experience]);

  const handleChange = (field: keyof ExperienceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If current is toggled to true, clear end date
    if (field === 'current' && value === true) {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        endDate: ''
      }));
    }
    
    // Update duration string when dates change
    if (field === 'startDate' || field === 'endDate' || field === 'current') {
      updateDurationString({
        ...formData,
        [field]: value
      });
    }
  };
  
  const updateDurationString = (data: ExperienceItem) => {
    let durationStr = '';
    if (data.startDate) {
      durationStr = data.startDate;
      if (data.current) {
        durationStr += ' - Present';
      } else if (data.endDate) {
        durationStr += ` - ${data.endDate}`;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      duration: durationStr
    }));
  };

  const handleSave = () => {
    // Generate ID if new
    const updatedExperience = isNew 
      ? { ...formData, id: `exp-${Date.now()}` } 
      : formData;
    
    onSave(updatedExperience);
    onClose();
  };
  
  const handleDelete = () => {
    if (!isNew && formData.id && onDelete) {
      Alert.alert(
        'Delete Experience',
        'Are you sure you want to remove this experience from your profile?',
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
    formData.role.trim() !== '' && 
    formData.company.trim() !== '' && 
    formData.startDate?.trim() !== '';

  return (
    <ProfileEditModal
      visible={visible}
      title={isNew ? "Add Experience" : "Edit Experience"}
      onClose={onClose}
      onSave={handleSave}
      saveDisabled={!isFormValid}
    >
      <FormGroup>
        <FormLabel>Job Title/Role *</FormLabel>
        <FormInput
          value={formData.role}
          onChangeText={(value) => handleChange('role', value)}
          placeholder="E.g. Senior Software Engineer"
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Company *</FormLabel>
        <FormInput
          value={formData.company}
          onChangeText={(value) => handleChange('company', value)}
          placeholder="E.g. Google, Inc."
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Start Date *</FormLabel>
        <FormInput
          value={formData.startDate}
          onChangeText={(value) => handleChange('startDate', value)}
          placeholder="E.g. Jan 2020"
          placeholderTextColor={theme.colors.secondary}
        />
      </FormGroup>
      
      <FormGroup>
        <SwitchContainer>
          <SwitchLabel>I currently work here</SwitchLabel>
          <Switch
            value={formData.current}
            onValueChange={(value) => handleChange('current', value)}
            trackColor={{ 
              false: theme.colors.border, 
              true: `${theme.colors.primary}80` 
            }}
            thumbColor={formData.current ? theme.colors.primary : '#f4f3f4'}
          />
        </SwitchContainer>
      </FormGroup>
      
      {!formData.current && (
        <FormGroup>
          <FormLabel>End Date</FormLabel>
          <FormInput
            value={formData.endDate}
            onChangeText={(value) => handleChange('endDate', value)}
            placeholder="E.g. Dec 2022"
            placeholderTextColor={theme.colors.secondary}
          />
        </FormGroup>
      )}
      
      <FormGroup>
        <FormLabel>Description</FormLabel>
        <FormTextArea
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Describe your responsibilities and achievements..."
          placeholderTextColor={theme.colors.secondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Company Logo URL (optional)</FormLabel>
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
            <DeleteButtonText>Delete This Experience</DeleteButtonText>
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

const SwitchContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
`;

const SwitchLabel = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
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

export default ProfileExperienceEditModal;
