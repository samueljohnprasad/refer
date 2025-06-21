import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import PostPreview from './PostPreview';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';

// Define types for the form data
type FormData = {
  company: string;
  role: string;
  description: string;
  teamSize: string;
  location: string;
  resumeApprovalRequired: boolean;
  experienceLevel: string;
  skills: string[];
  expiryDays: number;
  status: 'Active' | 'Draft';
};

interface ValidationState {
  company: { valid: boolean; message: string | null };
  role: { valid: boolean; message: string | null };
  description: { valid: boolean; message: string | null };
  skills: { valid: boolean; message: string | null };
}

interface ReferrerPostFormProps {
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

export default function EnhancedReferrerPostForm({ onSubmit }: ReferrerPostFormProps) {
  const { theme } = useTheme();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    company: '',
    role: '',
    description: '',
    teamSize: '',
    location: '',
    resumeApprovalRequired: true,
    experienceLevel: 'Mid-level',
    skills: [],
    expiryDays: 30,
    status: 'Draft'
  });
  
  // Validation state
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [validationState, setValidationState] = useState<ValidationState>({
    company: { valid: false, message: null },
    role: { valid: false, message: null },
    description: { valid: false, message: null },
    skills: { valid: false, message: null }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formCompletion, setFormCompletion] = useState(0);
  
  // Calculate form completion percentage
  useEffect(() => {
    let completedFields = 0;
    let totalRequiredFields = 4; // company, role, description, skills
    
    if (formData.company.trim()) completedFields++;
    if (formData.role.trim()) completedFields++;
    if (formData.description.trim().length >= 20) completedFields++;
    if (formData.skills.length > 0) completedFields++;
    
    setFormCompletion((completedFields / totalRequiredFields) * 100);
  }, [formData]);
  
  // Sample skills for selection
  const availableSkills = [
    'React', 'React Native', 'TypeScript', 'JavaScript', 'Node.js',
    'AWS', 'Python', 'Java', 'C#', 'DevOps', 'Product Management',
    'UX Design', 'UI Design', 'Marketing', 'Sales', 'Data Science'
  ];
  
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Management'];
  const expiryOptions = [7, 14, 30, 60, 90];
  
  // Update form data and validate in real-time
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Validate field in real-time
    validateField(field, value);
  };
  
  // Validate a specific field
  const validateField = (field: keyof FormData, value: any): boolean => {
    let isValid = true;
    let message = null;
    
    switch (field) {
      case 'company':
        isValid = value.trim().length > 0;
        message = isValid ? null : 'Company name is required';
        break;
      case 'role':
        isValid = value.trim().length > 0;
        message = isValid ? null : 'Job role is required';
        break;
      case 'description':
        if (!value.trim()) {
          isValid = false;
          message = 'Description is required';
        } else if (value.length < 20) {
          isValid = false;
          message = 'Description should be at least 20 characters';
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
    setFormData(prev => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Job role is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'Select at least one skill';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Toggle preview mode
  const handleTogglePreview = (): void => {
    // Validate form before showing preview
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
  const handleSubmit = (status: 'Active' | 'Draft'): void => {
    const isValid = status === 'Active' ? validateForm() : true;
    
    if (isValid) {
      setIsSubmitting(true);
      
      // Update status and submit
      const finalFormData = { ...formData, status };
      
      // Call onSubmit with form data
      onSubmit?.(finalFormData);
      
      // In a real app, this would be a call to the backend
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          status === 'Active' ? 'Post Published' : 'Draft Saved',
          status === 'Active' 
            ? 'Your referral post has been published successfully!' 
            : 'Your draft has been saved. You can publish it later.',
          [{ text: 'OK' }]
        );
      }, 1000);
    }
  };
  
  return (
    <FormContainer>
      <HeaderRow>
        <IconContainer>
          <FontAwesome name="bullhorn" size={16} color={theme.colors.primary} />
        </IconContainer>
        <FormTitle>Create Referrer Post</FormTitle>
      </HeaderRow>
      
      <InfoText>
        Create a post to offer referrals for your company. Job seekers can request a referral from you.
      </InfoText>
      
      <FormSection>
        <SectionTitle>Company Information</SectionTitle>
        <FieldDescription>This information helps job seekers find your company.</FieldDescription>
        
        <FormLabel>Company Name*</FormLabel>
        <FormInput
          placeholder="Enter company name"
          value={formData.company}
          onChangeText={(text) => handleInputChange('company', text)}
          placeholderTextColor={theme.colors.text + '80'}
          style={{ 
            borderColor: validationState.company.valid ? 
              theme.colors.success + '80' : 
              (validationState.company.message ? theme.colors.error : theme.colors.border) 
          }}
        />
        {validationState.company.message && <FormError>{validationState.company.message}</FormError>}
        
        <FormLabel>Job Role*</FormLabel>
        <FormInput
          placeholder="e.g. Frontend Developer, Product Manager"
          value={formData.role}
          onChangeText={(text) => handleInputChange('role', text)}
          placeholderTextColor={theme.colors.text + '80'}
          style={{ 
            borderColor: validationState.role.valid ? 
              theme.colors.success + '80' : 
              (validationState.role.message ? theme.colors.error : theme.colors.border) 
          }}
        />
        {validationState.role.message && <FormError>{validationState.role.message}</FormError>}
        
        <FormLabel>Location</FormLabel>
        <FormInput
          placeholder="e.g. Remote, New York, Hybrid"
          value={formData.location}
          onChangeText={(text) => handleInputChange('location', text)}
          placeholderTextColor={theme.colors.text + '80'}
        />
        
        <FormLabel>Team Size</FormLabel>
        <FormInput
          placeholder="e.g. 5-10 people"
          value={formData.teamSize}
          onChangeText={(text) => handleInputChange('teamSize', text)}
          keyboardType="default"
          placeholderTextColor={theme.colors.text + '80'}
        />
      </FormSection>
      
      <Divider />
      
      <FormSection>
        <SectionTitle>Job Details</SectionTitle>
        
        <FormLabel>Description*</FormLabel>
        <FormInput
          placeholder="Describe the role and what you're looking for in candidates"
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
          multiline={true}
          numberOfLines={4}
          style={{
            height: 120, 
            textAlignVertical: 'top',
            borderColor: validationState.description.valid ? 
              theme.colors.success + '80' : 
              (validationState.description.message ? theme.colors.error : theme.colors.border)
          }}
          placeholderTextColor={theme.colors.text + '80'}
        />
        {formData.description.length > 0 && (
          <Text style={{ 
            fontSize: theme.typography.fontSize.xs, 
            color: formData.description.length >= 20 ? theme.colors.success : theme.colors.text,
            marginTop: 4,
            alignSelf: 'flex-end'
          }}>
            {formData.description.length}/20 characters
          </Text>
        )}
        {validationState.description.message && <FormError>{validationState.description.message}</FormError>}
        
        <FormLabel>Experience Level</FormLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: 16 }}>
          {experienceLevels.map((level) => (
            <SkillTag 
              key={level}
              selected={formData.experienceLevel === level}
              onPress={() => handleInputChange('experienceLevel', level)}
            >
              <SkillText selected={formData.experienceLevel === level}>{level}</SkillText>
            </SkillTag>
          ))}
        </View>
        
        <FormLabel>Required Skills*</FormLabel>
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
      </FormSection>
      
      <Divider />
      
      <FormSection>
        <SectionTitle>Post Settings</SectionTitle>
        
        <SwitchContainer>
          <View>
            <FormLabel>Resume Approval Required</FormLabel>
            <Text style={{ 
              fontSize: theme.typography.fontSize.xs, 
              color: theme.colors.text, 
              opacity: 0.6 
            }}>
              Require approval of resumes before referring
            </Text>
          </View>
          <Switch
            value={formData.resumeApprovalRequired}
            onValueChange={(value) => handleInputChange('resumeApprovalRequired', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
            thumbColor={formData.resumeApprovalRequired ? theme.colors.primary : theme.colors.text + '40'}
          />
        </SwitchContainer>
        
        <FormLabel>Post Expiration</FormLabel>
        <FieldDescription>After this period, your post will no longer be visible in feeds</FieldDescription>
        <ExpiryOptions>
          {expiryOptions.map((days) => (
            <ExpiryOption
              key={days}
              selected={formData.expiryDays === days}
              onPress={() => handleInputChange('expiryDays', days)}
            >
              <ExpiryText selected={formData.expiryDays === days}>
                {days === 7 ? '1 week' : days === 14 ? '2 weeks' : `${days / 30} ${days === 30 ? 'month' : 'months'}`}
              </ExpiryText>
            </ExpiryOption>
          ))}
        </ExpiryOptions>
      </FormSection>
      
      <Divider />
      
      <ButtonContainer>
        <FormButton 
          onPress={() => handleSubmit('Draft')} 
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
          onPress={() => handleSubmit('Active')} 
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
