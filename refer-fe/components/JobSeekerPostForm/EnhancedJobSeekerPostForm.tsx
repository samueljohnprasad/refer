import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator, Animated } from 'react-native';
import styled, { css } from 'styled-components/native';
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
  onSubmit?: (data: FormData, isDraft?: boolean) => void;
  isSubmitting?: boolean;
  isDraftSubmitting?: boolean;
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

// Stepper component
const StepperContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const Step = styled.View<{ active: boolean; completed: boolean }>`
  align-items: center;
  flex: 1;
`;

const StepIndicator = styled.View<{ active: boolean; completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.completed ? props.theme.colors.primary : (props.active ? props.theme.colors.primary : props.theme.colors.border)};
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: ${props => props.active || props.completed ? props.theme.colors.primary : props.theme.colors.border};
`;

const StepLabel = styled.Text<{ active: boolean; completed: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.active || props.completed ? props.theme.colors.primary : props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.xs}px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const StepConnector = styled.View<{ completed: boolean }>`
  height: 2px;
  flex: 1;
  background-color: ${props => props.completed ? props.theme.colors.primary : props.theme.colors.border};
  margin-bottom: 20px; /* Aligns with the center of the step circle */
`;

const FormStepContainer = styled(Animated.View)`
  width: 100%;
`;

const steps = ['Basics', 'Details', 'Privacy & Finish'];

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const { theme } = useTheme();
  return (
    <StepperContainer>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Step active={index === currentStep} completed={index < currentStep}>
            <StepIndicator active={index === currentStep} completed={index < currentStep}>
              {index < currentStep ? (
                <FontAwesome name="check" size={16} color="white" />
              ) : (
                <Text style={{ color: index === currentStep ? 'white' : theme.colors.text }}>{index + 1}</Text>
              )}
            </StepIndicator>
            <StepLabel active={index === currentStep} completed={index < currentStep}>{step}</StepLabel>
          </Step>
          {index < steps.length - 1 && <StepConnector completed={index < currentStep} />}
        </React.Fragment>
      ))}
    </StepperContainer>
  );
};

export default function EnhancedJobSeekerPostForm({ 
  onSubmit, 
  isSubmitting = false, 
  isDraftSubmitting = false 
}: JobSeekerPostFormProps) {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    interestStatement: '',
    skills: [],
    experience: '',
    education: '',
    resumeFile: '',
    privacyOption: 'Public',
    expiryDays: 30,
  });
  
  const [validation, setValidation] = useState<ValidationState>({
    title: { valid: false, message: null },
    interestStatement: { valid: false, message: null },
    skills: { valid: true, message: null },
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const availableSkills = [
    'React', 'React Native', 'TypeScript', 'JavaScript', 'Node.js',
    'AWS', 'Python', 'Java', 'C#', 'DevOps', 'Product Management',
    'UX Design', 'UI Design', 'Marketing', 'Sales', 'Data Science'
  ];
  
  useEffect(() => {
    const totalFields = 5;
    let filledFields = 0;
    if (formData.title.trim()) filledFields++;
    if (formData.interestStatement.trim()) filledFields++;
    if (formData.skills.length > 0) filledFields++;
    if (formData.experience.trim()) filledFields++;
    if (formData.education.trim()) filledFields++;
    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);
  
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };
  
  const validateStep1 = () => {
    const titleValid = validateField('title', formData.title);
    const statementValid = validateField('interestStatement', formData.interestStatement);
    return titleValid && statementValid;
  };
  
  const validateStep2 = () => {
    return validateField('skills', formData.skills);
  };
  
  const handleNext = () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = validateStep1();
    } else if (currentStep === 1) {
      isValid = validateStep2();
    }

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const validateField = (field: keyof FormData, value: any): boolean => {
    if (!(field in validation)) return true;
    
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
    
    setValidation(prev => ({
      ...prev,
      [field]: { valid: isValid, message }
    }));
    
    return isValid;
  };
  
  const toggleSkill = (skill: string) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    
    handleInputChange('skills', updatedSkills);
  };
  
  const validateForm = (): boolean => {
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();

    return isStep1Valid && isStep2Valid;
  };
  
  const handleTogglePreview = (): void => {
    setShowPreview(true);
  };
  
  const handleSubmit = (asDraft: boolean): void => {
    if (validateForm() || asDraft) {
      onSubmit?.(formData, asDraft);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
            <FormStepContainer>
                <FormSection>
                  <HeaderRow>
                    <IconContainer>
                      <FontAwesome name="briefcase" size={16} color={theme.colors.primary} />
                    </IconContainer>
                    <SectionTitle>The Basics</SectionTitle>
                  </HeaderRow>
                  <FieldDescription>Start with the headline for your post.</FieldDescription>
                  <FormLabel>Post Title</FormLabel>
                  <FormInput
                    placeholder="e.g., Senior Frontend Developer looking for new role"
                    value={formData.title}
                    onChangeText={text => handleInputChange('title', text)}
                    maxLength={100}
                  />
                  {!validation.title.valid && <FormError>{validation.title.message}</FormError>}
                  
                  <FormLabel>Interest Statement</FormLabel>
                  <FieldDescription>
                    What are you passionate about? What kind of role or company are you looking for?
                  </FieldDescription>
                  <FormInput
                    placeholder="Describe your interests and what you're looking for..."
                    value={formData.interestStatement}
                    onChangeText={text => handleInputChange('interestStatement', text)}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    style={{ height: 120, textAlignVertical: 'top' }}
                  />
                  {!validation.interestStatement.valid && <FormError>{validation.interestStatement.message}</FormError>}
                </FormSection>
            </FormStepContainer>
        );
      case 1:
        return (
          <FormStepContainer>
            <FormSection>
              <HeaderRow>
                <IconContainer>
                  <FontAwesome name="cogs" size={16} color={theme.colors.primary} />
                </IconContainer>
                <SectionTitle>Your Skills & Experience</SectionTitle>
              </HeaderRow>
              <FieldDescription>Highlight your expertise and background.</FieldDescription>
              <FormLabel>Top 5 Skills</FormLabel>
              <SkillsContainer>
                {['React', 'TypeScript', 'Node.js', 'GraphQL', 'UI/UX Design', 'Product Management', 'Agile', 'DevOps'].map(skill => (
                  <SkillTag
                    key={skill}
                    selected={formData.skills.includes(skill)}
                    onPress={() => toggleSkill(skill)}
                  >
                    <SkillText selected={formData.skills.includes(skill)}>{skill}</SkillText>
                  </SkillTag>
                ))}
              </SkillsContainer>
              {!validation.skills.valid && <FormError>{validation.skills.message}</FormError>}

              <Divider />

              <FormLabel>Experience Summary</FormLabel>
              <FormInput
                placeholder="Summarize your key work experience..."
                value={formData.experience}
                onChangeText={text => handleInputChange('experience', text)}
                multiline
                numberOfLines={4}
                maxLength={500}
                style={{ height: 120, textAlignVertical: 'top' }}
              />

              <FormLabel>Education</FormLabel>
              <FormInput
                placeholder="e.g., B.S. in Computer Science from University of Example"
                value={formData.education}
                onChangeText={text => handleInputChange('education', text)}
                maxLength={100}
              />
            </FormSection>
            <Divider />
            <FormSection>
                <FormLabel>Upload Your Resume (Optional)</FormLabel>
                <FieldDescription>
                  Your resume will only be shared with referrers you match with.
                </FieldDescription>
                <ResumeUploader onFileSelected={(file) => handleInputChange('resumeFile', file)} />
            </FormSection>
          </FormStepContainer>
        );
      case 2:
        return (
          <FormStepContainer>
            <FormSection>
              <HeaderRow>
                <IconContainer>
                  <FontAwesome name="shield" size={16} color={theme.colors.primary} />
                </IconContainer>
                <SectionTitle>Privacy & Settings</SectionTitle>
              </HeaderRow>

              <PrivacySelector
                selectedOption={formData.privacyOption}
                onOptionSelected={option => handleInputChange('privacyOption', option)}
              />
            </FormSection>
            <Divider />
            <FormSection>
              <FormLabel>Post Expiry</FormLabel>
              <FieldDescription>Set how long your post will be visible.</FieldDescription>
              <ExpiryOptions>
                {[7, 14, 30, 60].map(days => (
                  <ExpiryOption
                    key={days}
                    selected={formData.expiryDays === days}
                    onPress={() => handleInputChange('expiryDays', days)}
                  >
                    <ExpiryText selected={formData.expiryDays === days}>{days} days</ExpiryText>
                  </ExpiryOption>
                ))}
              </ExpiryOptions>
            </FormSection>
          </FormStepContainer>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView>
      <FormContainer>
        {showPreview && <PostPreview data={formData} onClose={() => setShowPreview(false)} />}

        <Stepper currentStep={currentStep} />
        
        <ProgressContainer>
          <ProgressBarContainer>
            <ProgressBarLabel>Profile Completion</ProgressBarLabel>
            <ProgressBarTrack>
              <ProgressBarFill percentage={progress} />
            </ProgressBarTrack>
          </ProgressBarContainer>
          <ProgressPercentage complete={progress === 100}>
            {progress}%
          </ProgressPercentage>
        </ProgressContainer>

        <Divider />

        {renderStepContent()}

        <ButtonContainer>
          {currentStep > 0 && (
            <FormButton onPress={handleBack} disabled={isSubmitting || isDraftSubmitting}>
              <FontAwesome name="arrow-left" size={16} color={theme.colors.text} style={{ marginRight: 8 }} />
              <ButtonText>Back</ButtonText>
            </FormButton>
          )}
          
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            {currentStep < steps.length - 1 ? (
              <FormButton onPress={handleNext} primary>
                <ButtonText primary>Next</ButtonText>
                <FontAwesome name="arrow-right" size={16} color={'white'} style={{ marginLeft: 8 }} />
              </FormButton>
            ) : (
              <FormButton
                onPress={() => handleSubmit(false)}
                primary
                disabled={isSubmitting || isDraftSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <FontAwesome name="check" size={16} color="white" style={{ marginRight: 8 }} />
                    <ButtonText primary>Submit Post</ButtonText>
                  </>
                )}
              </FormButton>
            )}
          </View>
        </ButtonContainer>

        <Divider />
        
        <ButtonContainer>
            <FormButton onPress={handleTogglePreview} disabled={isSubmitting || isDraftSubmitting}>
              <FontAwesome name="eye" size={16} color={theme.colors.text} style={{ marginRight: 8 }} />
              <ButtonText>Preview</ButtonText>
            </FormButton>
            <FormButton onPress={() => handleSubmit(true)} disabled={isSubmitting || isDraftSubmitting}>
                {isDraftSubmitting ? (
                  <ActivityIndicator size="small" color={theme.colors.text} />
                ) : (
                  <>
                    <FontAwesome name="save" size={16} color={theme.colors.text} style={{ marginRight: 8 }} />
                    <ButtonText>Save as Draft</ButtonText>
                  </>
                )}
            </FormButton>
        </ButtonContainer>
      </FormContainer>
    </ScrollView>
  );
}
