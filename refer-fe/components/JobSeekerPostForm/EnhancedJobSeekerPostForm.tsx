import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';
import ResumeUploader from './ResumeUploader';
import PrivacySelector from './PrivacySelector';
import PostPreview from './PostPreview';

// Define types for the form data
type PrivacyOption = 'Public' | 'Private' | 'Anonymous';

type FormData = {
  title: string;
  interestStatement: string;
  skills: string[];
  experience: string;
  education: string;
  resumeFile: string;
  privacyOption: PrivacyOption;
  expiryDays: number;
};

interface ValidationState {
  title: { valid: boolean; message: string | null };
  interestStatement: { valid: boolean; message: string | null };
  skills: { valid: boolean; message: string | null };
}

interface JobSeekerPostFormProps {
  onSubmit?: (data: FormData) => void;
}

// Styled components
const FormContainer = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const FormTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const FormSection = styled.View`
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const FormLabel = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
  opacity: 0.8;
`;

const FormInput = styled.TextInput`
  background-color: ${props => props.theme.colors.background};
  padding: 12px 16px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const FormError = styled.Text`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  margin-top: ${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const FormButton = styled.TouchableOpacity<{ primary?: boolean }>`
  background-color: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.card};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.sm}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
  flex-direction: row;
  border-width: ${props => props.primary ? 0 : 1}px;
  border-color: ${props => props.theme.colors.border};
`;

const ButtonText = styled.Text<{ primary?: boolean }>`
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  font-weight: bold;
  font-size: ${props => props.theme.typography.fontSize.md}px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const SwitchContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
  padding-top: ${props => props.theme.spacing.xs}px;
  padding-bottom: ${props => props.theme.spacing.xs}px;
`;

const IconContainer = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacing.xs}px;
  background-color: ${props => props.theme.colors.primary + '20'};
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin-top: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const FieldDescription = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  opacity: 0.6;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const SkillTag = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.background};
  padding: 8px 12px;
  border-radius: 20px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
`;

const SkillText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? 'white' : props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
`;

const ExpiryOptions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.sm}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const ExpiryOption = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.background};
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-left: 4px;
  margin-right: 4px;
  border-width: 1px;
  border-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
`;

const ExpiryText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? 'white' : props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

const InfoText = styled.Text`
  color: ${props => props.theme.colors.info};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  margin-top: ${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
  font-style: italic;
`;

const ProgressContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ProgressBarContainer = styled.View`
  flex: 1;
`;

const ProgressBarLabel = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ProgressBarTrack = styled.View`
  height: 6px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 3px;
  overflow: 'hidden';
`;

const ProgressBarFill = styled.View<{ percentage: number }>`
  height: 100%;
  width: ${props => `${props.percentage}%`};
  background-color: ${props => 
    props.percentage === 100 
      ? props.theme.colors.success 
      : props.theme.colors.primary};
  border-radius: 3px;
`;

const ProgressPercentage = styled.Text<{ complete: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  font-weight: bold;
  color: ${props => props.complete ? props.theme.colors.success : props.theme.colors.text};
  margin-left: 12px;
`;

export default function EnhancedJobSeekerPostForm({ onSubmit }: JobSeekerPostFormProps) {
  const { theme } = useTheme();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    interestStatement: '',
    skills: [],
    experience: '',
    education: '',
    resumeFile: '',
    privacyOption: 'Public',
    expiryDays: 180 // Default of 6 months as per requirements
  });
  
  // Validation state
  const [validationState, setValidationState] = useState<ValidationState>({
    title: { valid: false, message: null },
    interestStatement: { valid: false, message: null },
    skills: { valid: false, message: null }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formCompletion, setFormCompletion] = useState(0);
  
  // Sample skills for selection
  const availableSkills = [
    'React', 'React Native', 'TypeScript', 'JavaScript', 'Node.js',
    'AWS', 'Python', 'Java', 'C#', 'DevOps', 'Product Management',
    'UX Design', 'UI Design', 'Marketing', 'Sales', 'Data Science'
  ];
  
  // Calculate form completion percentage
  useEffect(() => {
    let completedFields = 0;
    let totalRequiredFields = 4; // title, interestStatement, skills, privacyOption
    
    if (formData.title.trim()) completedFields++;
    if (formData.interestStatement.trim().length >= 50) completedFields++;
    if (formData.skills.length > 0) completedFields++;
    if (formData.resumeFile) completedFields++;
    
    setFormCompletion((completedFields / totalRequiredFields) * 100);
  }, [formData]);
  
  // Update form data and validate in real-time
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };
  
  // Validate a specific field
  const validateField = (field: keyof FormData, value: any): boolean => {
    if (!(field in validationState)) return true;
    
    let isValid = true;
    let message = null;
    
    switch (field) {
      case 'title':
        isValid = value.trim().length > 0;
        message = isValid ? null : 'Title is required';
        break;
      case 'interestStatement':
        if (!value.trim()) {
          isValid = false;
          message = 'Interest statement is required';
        } else if (value.length < 50) {
          isValid = false;
          message = 'Statement should be at least 50 characters';
        }
        break;
      case 'skills':
        isValid = value.length > 0;
        message = isValid ? null : 'Select at least one skill';
        break;
    }
    
    setValidationState(prev => ({
      ...prev,
      [field]: { valid: isValid, message }
    }));
    
    return isValid;
  };
  
  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    
    handleInputChange('skills', updatedSkills);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const fields: (keyof ValidationState)[] = ['title', 'interestStatement', 'skills'];
    let isValid = true;
    
    fields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    if (!formData.resumeFile) {
      Alert.alert('Missing Resume', 'Please upload your resume before submitting');
      return false;
    }
    
    return isValid;
  };
  
  // Toggle preview mode
  const handleTogglePreview = (): void => {
    const isValid = validateForm();
    
    if (isValid) {
      setShowPreview(!showPreview);
    } else {
      Alert.alert(
        'Form Incomplete',
        'Please fill out all required fields before previewing.',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Submit handler
  const handleSubmit = (asDraft: boolean): void => {
    const isValid = !asDraft ? validateForm() : true;
    
    if (isValid) {
      setIsSubmitting(true);
      
      // Call onSubmit with form data
      onSubmit?.(formData);
      
      // In a real app, this would be a call to the backend
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          asDraft ? 'Draft Saved' : 'Post Published',
          asDraft 
            ? 'Your post draft has been saved. You can edit and publish it later.' 
            : 'Your job seeker post has been published successfully!',
          [{ text: 'OK' }]
        );
      }, 1000);
    }
  };
  
  return (
    <FormContainer>
      <HeaderRow>
        <IconContainer>
          <FontAwesome name="search" size={16} color={theme.colors.primary} />
        </IconContainer>
        <FormTitle>Create Job Seeker Post</FormTitle>
      </HeaderRow>
      
      <InfoText>
        Create a post to help referrers find you and recommend you for positions that match your skills.
      </InfoText>
      
      <ProgressContainer>
        <ProgressBarContainer>
          <ProgressBarLabel>Form Completion</ProgressBarLabel>
          <ProgressBarTrack>
            <ProgressBarFill percentage={formCompletion} />
          </ProgressBarTrack>
        </ProgressBarContainer>
        <ProgressPercentage complete={formCompletion === 100}>
          {formCompletion}%
        </ProgressPercentage>
      </ProgressContainer>
      
      <Divider />
      
      <FormSection>
        <SectionTitle>Basic Information</SectionTitle>
        
        <FormLabel>Title*</FormLabel>
        <FormInput
          placeholder="e.g. Senior React Developer seeking new opportunities"
          value={formData.title}
          onChangeText={(text) => handleInputChange('title', text)}
          placeholderTextColor={theme.colors.text + '80'}
          style={{ 
            borderColor: validationState.title.valid ? 
              theme.colors.success + '80' : 
              (validationState.title.message ? theme.colors.error : theme.colors.border) 
          }}
        />
        {validationState.title.message && <FormError>{validationState.title.message}</FormError>}
        
        <ResumeUploader 
          onFileSelected={(uri) => handleInputChange('resumeFile', uri)}
          currentFile={formData.resumeFile}
        />
      </FormSection>
      
      <Divider />
      
      <FormSection>
        <SectionTitle>Skills & Interest</SectionTitle>
        
        <FormLabel>Interest Statement*</FormLabel>
        <FieldDescription>
          Describe what you're looking for and why you would be a good fit (minimum 50 characters)
        </FieldDescription>
        <FormInput
          placeholder="Share what type of role you're looking for and why you're interested"
          value={formData.interestStatement}
          onChangeText={(text) => handleInputChange('interestStatement', text)}
          multiline={true}
          numberOfLines={4}
          style={{
            height: 120, 
            textAlignVertical: 'top',
            borderColor: validationState.interestStatement.valid ? 
              theme.colors.success + '80' : 
              (validationState.interestStatement.message ? theme.colors.error : theme.colors.border)
          }}
          placeholderTextColor={theme.colors.text + '80'}
        />
        {formData.interestStatement.length > 0 && (
          <Text style={{ 
            fontSize: theme.typography.fontSize.xs, 
            color: formData.interestStatement.length >= 50 ? theme.colors.success : theme.colors.text,
            marginTop: 4,
            alignSelf: 'flex-end'
          }}>
            {formData.interestStatement.length}/50 characters
          </Text>
        )}
        {validationState.interestStatement.message && <FormError>{validationState.interestStatement.message}</FormError>}
        
        <FormLabel>Skills*</FormLabel>
        <FieldDescription>
          Select skills that highlight your expertise (select at least one)
        </FieldDescription>
        <SkillsContainer>
          {availableSkills.map((skill) => (
            <SkillTag 
              key={skill}
              selected={formData.skills.includes(skill)}
              onPress={() => toggleSkill(skill)}
            >
              <SkillText selected={formData.skills.includes(skill)}>{skill}</SkillText>
            </SkillTag>
          ))}
        </SkillsContainer>
        {validationState.skills.message && <FormError>{validationState.skills.message}</FormError>}
        
        <FormLabel>Experience (Optional)</FormLabel>
        <FormInput
          placeholder="Briefly describe your relevant experience"
          value={formData.experience}
          onChangeText={(text) => handleInputChange('experience', text)}
          multiline={true}
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: 'top' }}
          placeholderTextColor={theme.colors.text + '80'}
        />
        
        <FormLabel>Education (Optional)</FormLabel>
        <FormInput
          placeholder="Briefly describe your education background"
          value={formData.education}
          onChangeText={(text) => handleInputChange('education', text)}
          multiline={true}
          numberOfLines={2}
          style={{ height: 60, textAlignVertical: 'top' }}
          placeholderTextColor={theme.colors.text + '80'}
        />
      </FormSection>
      
      <Divider />
      
      <FormSection>
        <SectionTitle>Post Settings</SectionTitle>
        
        <PrivacySelector 
          selectedOption={formData.privacyOption}
          onOptionSelected={(option) => handleInputChange('privacyOption', option)}
        />
        
        <FormLabel>Post Expiration</FormLabel>
        <FieldDescription>After this period, your post will no longer be visible in feeds</FieldDescription>
        <ExpiryOptions>
          {[30, 60, 90, 180, 365].map((days) => (
            <ExpiryOption
              key={days}
              selected={formData.expiryDays === days}
              onPress={() => handleInputChange('expiryDays', days)}
            >
              <ExpiryText selected={formData.expiryDays === days}>
                {days === 30 ? '1 month' : 
                 days === 60 ? '2 months' : 
                 days === 90 ? '3 months' : 
                 days === 180 ? '6 months' : '1 year'}
              </ExpiryText>
            </ExpiryOption>
          ))}
        </ExpiryOptions>
      </FormSection>
      
      <Divider />
      
      <ButtonContainer>
        <FormButton 
          onPress={() => handleSubmit(true)} 
          style={{ flex: 1, marginRight: 8 }}
        >
          <FontAwesome name="save" size={16} color={theme.colors.text} style={{ marginRight: 8 }} />
          <ButtonText>Save as Draft</ButtonText>
        </FormButton>
        
        <FormButton 
          onPress={handleTogglePreview}
          style={{ flex: 1, marginHorizontal: 8 }}
        >
          <FontAwesome name="eye" size={16} color={theme.colors.text} style={{ marginRight: 8 }} />
          <ButtonText>Preview</ButtonText>
        </FormButton>
        
        <FormButton 
          primary 
          onPress={() => handleSubmit(false)} 
          style={{ flex: 1, marginLeft: 8 }}
          disabled={formCompletion < 100 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <FontAwesome name="paper-plane" size={16} color="white" style={{ marginRight: 8 }} />
              <ButtonText primary>Publish Post</ButtonText>
            </>
          )}
        </FormButton>
      </ButtonContainer>
      
      {showPreview && (
        <PostPreview 
          data={formData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </FormContainer>
  );
}
