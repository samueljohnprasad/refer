import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, Alert, TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from './ProfileEditModal';
import { useTheme } from '../../../context/ThemeContext';

interface UserInfo {
  name: string;
  bio: string;
  company?: string;
  position?: string;
  location?: string;
  website?: string;
  // Added social media fields
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
}

interface ValidationErrors {
  name?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  position?: string;
  company?: string;
  location?: string;
}

interface LocationSuggestion {
  id: string;
  name: string;
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
  const [initialData, setInitialData] = useState<UserInfo>(userData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  
  // Create refs for form field navigation
  const nameInputRef = useRef<TextInput>(null);
  const bioInputRef = useRef<TextInput>(null);
  const positionInputRef = useRef<TextInput>(null);
  const companyInputRef = useRef<TextInput>(null);
  const locationInputRef = useRef<TextInput>(null);
  const websiteInputRef = useRef<TextInput>(null);
  const linkedinInputRef = useRef<TextInput>(null);
  const twitterInputRef = useRef<TextInput>(null);
  const githubInputRef = useRef<TextInput>(null);
  const instagramInputRef = useRef<TextInput>(null);
  
  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      setFormData(userData);
      setInitialData(userData);
      setErrors({});
      setIsDraftSaved(false);
    }
  }, [visible, userData]);
  
  // URL validation function
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty URLs are valid (optional fields)
    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    return pattern.test(url);
  };
  
  // Form validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length > 250) {
      newErrors.bio = 'Bio must be 250 characters or less';
    }
    
    // URL validations
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }
    
    if (formData.linkedin && !isValidUrl(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    
    if (formData.twitter && !isValidUrl(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid Twitter URL';
    }
    
    if (formData.github && !isValidUrl(formData.github)) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }
    
    if (formData.instagram && !isValidUrl(formData.instagram)) {
      newErrors.instagram = 'Please enter a valid Instagram URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof UserInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear the error for this field if it exists
    if (field in errors && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Show location suggestions when typing in location field
    if (field === 'location' && value.trim().length > 1) {
      // Mock location suggestions - would be replaced with API call in real app
      const mockSuggestions = [
        { id: '1', name: 'San Francisco, CA' },
        { id: '2', name: 'San Diego, CA' },
        { id: '3', name: 'San Jose, CA' },
        { id: '4', name: 'Santa Monica, CA' }
      ].filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      
      setLocationSuggestions(mockSuggestions);
      setShowSuggestions(mockSuggestions.length > 0);
    } else if (field === 'location') {
      setShowSuggestions(false);
    }
  };
  
  // Handle location suggestion selection
  const handleSelectLocation = (suggestion: LocationSuggestion) => {
    setFormData(prev => ({
      ...prev,
      location: suggestion.name
    }));
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };
  
  const handleSaveDraft = () => {
    // In a real app, this would save to local storage or backend
    setIsDraftSaved(true);
    
    // Show confirmation to user
    Alert.alert(
      'Draft Saved', 
      'Your profile changes have been saved as a draft.'
    );
  };
  
  const handleClose = () => {
    const hasChanges = JSON.stringify(initialData) !== JSON.stringify(formData);
    
    if (hasChanges && !isDraftSaved) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes that will be lost. Are you sure you want to exit?",
        [
          { text: "Continue Editing", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => onClose() }
        ]
      );
    } else {
      onClose();
    }
  };
  
  // Calculate profile completeness
  const calculateProfileCompleteness = (): number => {
    const totalFields = 9; // Total number of fields in the profile
    let filledFields = 0;
    
    if (formData.name?.trim()) filledFields++;
    if (formData.bio?.trim()) filledFields++;
    if (formData.position?.trim()) filledFields++;
    if (formData.company?.trim()) filledFields++;
    if (formData.location?.trim()) filledFields++;
    if (formData.website?.trim()) filledFields++;
    if (formData.linkedin?.trim()) filledFields++;
    if (formData.github?.trim()) filledFields++;
    if (formData.twitter?.trim()) filledFields++;
    
    return Math.round((filledFields / totalFields) * 100);
  };
  
  const completenessPercentage = calculateProfileCompleteness();
  
  // Check if name and bio are filled (required fields)
  const isFormValid = formData.name.trim() !== '' && formData.bio.trim() !== '';

  return (
    <ProfileEditModal
      visible={visible}
      title="Edit Personal Info"
      onClose={handleClose}
      onSave={handleSave}
      saveDisabled={!isFormValid}
    >
      {/* Profile Completeness Indicator */}
      <CompletenessContainer>
        <CompletenessHeader>
          <CompletenessTitle>Profile Completeness</CompletenessTitle>
          <CompletenessPercentage>{completenessPercentage}%</CompletenessPercentage>
        </CompletenessHeader>
        <CompletenessBarContainer>
          <CompletenessBar percentage={completenessPercentage} />
        </CompletenessBarContainer>
        <CompletenessNote>Complete your profile to improve visibility</CompletenessNote>
      </CompletenessContainer>
      
      {/* Basic Information Section */}
      <SectionTitle>Basic Information</SectionTitle>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="person" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <FormLabel>Full Name *</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={nameInputRef}
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Your full name"
          placeholderTextColor={theme.colors.secondary}
          returnKeyType="next"
          onSubmitEditing={() => bioInputRef.current?.focus()}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="document-text" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <FormLabel>Bio *</FormLabel>
        </FormLabelContainer>
        <FormTextArea
          ref={bioInputRef}
          value={formData.bio}
          onChangeText={(value) => handleChange('bio', value)}
          placeholder="Write a short bio about yourself"
          placeholderTextColor={theme.colors.secondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          returnKeyType="next"
          onSubmitEditing={() => positionInputRef.current?.focus()}
        />
        <CharacterCount status={formData.bio.length > 250 ? 'error' : 'normal'}>
          {formData.bio.length}/250 characters
        </CharacterCount>
        {errors.bio && <ErrorText>{errors.bio}</ErrorText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="briefcase" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <FormLabel>Current Position</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={positionInputRef}
          value={formData.position}
          onChangeText={(value) => handleChange('position', value)}
          placeholder="E.g. Senior Software Engineer"
          placeholderTextColor={theme.colors.secondary}
          returnKeyType="next"
          onSubmitEditing={() => companyInputRef.current?.focus()}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="business" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <FormLabel>Company</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={companyInputRef}
          value={formData.company}
          onChangeText={(value) => handleChange('company', value)}
          placeholder="E.g. Google, Inc."
          placeholderTextColor={theme.colors.secondary}
          returnKeyType="next"
          onSubmitEditing={() => locationInputRef.current?.focus()}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="location" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <FormLabel>Location</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={locationInputRef}
          value={formData.location}
          onChangeText={(value) => handleChange('location', value)}
          placeholder="E.g. San Francisco, CA"
          placeholderTextColor={theme.colors.secondary}
          returnKeyType="next"
          onSubmitEditing={() => websiteInputRef.current?.focus()}
        />
        
        {/* Location Suggestions */}
        {showSuggestions && (
          <SuggestionsContainer>
            {locationSuggestions.map(suggestion => (
              <SuggestionItem 
                key={suggestion.id} 
                onPress={() => handleSelectLocation(suggestion)}
              >
                <Ionicons name="location-outline" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <SuggestionText>{suggestion.name}</SuggestionText>
              </SuggestionItem>
            ))}
          </SuggestionsContainer>
        )}
      </FormGroup>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="globe" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <FormLabel>Website</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={websiteInputRef}
          value={formData.website}
          onChangeText={(value) => handleChange('website', value)}
          placeholder="E.g. https://yourwebsite.com"
          placeholderTextColor={theme.colors.secondary}
          autoCapitalize="none"
          keyboardType="url"
          returnKeyType="next"
          onSubmitEditing={() => linkedinInputRef.current?.focus()}
        />
        {errors.website && <ErrorText>{errors.website}</ErrorText>}
      </FormGroup>
      
      {/* Social Media Section */}
      <SectionTitle>Social Media (Optional)</SectionTitle>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="logo-linkedin" size={18} color="#0077B5" style={{ marginRight: 8 }} />
          <FormLabel>LinkedIn</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={linkedinInputRef}
          value={formData.linkedin}
          onChangeText={(value) => handleChange('linkedin', value)}
          placeholder="LinkedIn profile URL"
          placeholderTextColor={theme.colors.secondary}
          autoCapitalize="none"
          keyboardType="url"
          returnKeyType="next"
          onSubmitEditing={() => twitterInputRef.current?.focus()}
        />
        {errors.linkedin && <ErrorText>{errors.linkedin}</ErrorText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="logo-twitter" size={18} color="#1DA1F2" style={{ marginRight: 8 }} />
          <FormLabel>Twitter</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={twitterInputRef}
          value={formData.twitter}
          onChangeText={(value) => handleChange('twitter', value)}
          placeholder="Twitter profile URL"
          placeholderTextColor={theme.colors.secondary}
          autoCapitalize="none"
          keyboardType="url"
          returnKeyType="next"
          onSubmitEditing={() => githubInputRef.current?.focus()}
        />
        {errors.twitter && <ErrorText>{errors.twitter}</ErrorText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="logo-github" size={18} color="#333" style={{ marginRight: 8 }} />
          <FormLabel>GitHub</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={githubInputRef}
          value={formData.github}
          onChangeText={(value) => handleChange('github', value)}
          placeholder="GitHub profile URL"
          placeholderTextColor={theme.colors.secondary}
          autoCapitalize="none"
          keyboardType="url"
          returnKeyType="next"
          onSubmitEditing={() => instagramInputRef.current?.focus()}
        />
        {errors.github && <ErrorText>{errors.github}</ErrorText>}
      </FormGroup>
      
      <FormGroup>
        <FormLabelContainer>
          <Ionicons name="logo-instagram" size={18} color="#C13584" style={{ marginRight: 8 }} />
          <FormLabel>Instagram</FormLabel>
        </FormLabelContainer>
        <FormInput
          ref={instagramInputRef}
          value={formData.instagram}
          onChangeText={(value) => handleChange('instagram', value)}
          placeholder="Instagram profile URL"
          placeholderTextColor={theme.colors.secondary}
          autoCapitalize="none"
          keyboardType="url"
        />
        {errors.instagram && <ErrorText>{errors.instagram}</ErrorText>}
      </FormGroup>
      
      {/* Action Buttons */}
      <ActionButtonsContainer>
        <SaveDraftButton onPress={handleSaveDraft}>
          <Ionicons name="save-outline" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <SaveDraftText>Save as Draft</SaveDraftText>
        </SaveDraftButton>
      </ActionButtonsContainer>
      
      <RequiredFieldsNote>* Required fields</RequiredFieldsNote>
    </ProfileEditModal>
  );
};

const FormGroup = styled.View`
  margin-bottom: 16px;
`;

const FormLabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const FormLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FormInput = styled.TextInput.attrs((props: { theme: any }) => ({
  placeholderTextColor: props.theme.colors.secondary
}))`
  background-color: ${props => props.theme.colors.background};
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const FormTextArea = styled.TextInput.attrs((props: { theme: any }) => ({
  placeholderTextColor: props.theme.colors.secondary,
  multiline: true,
  numberOfLines: 4,
  textAlignVertical: 'top'
}))`
  background-color: ${props => props.theme.colors.background};
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

interface CharacterCountProps {
  status: 'normal' | 'warning' | 'error';
}

const CharacterCount = styled.Text<CharacterCountProps>`
  font-size: 12px;
  margin-top: 4px;
  text-align: right;
  color: ${props => {
    switch(props.status) {
      case 'error': return props.theme.colors.error;
      case 'warning': return '#FFA500'; // Orange
      default: return props.theme.colors.secondary;
    }
  }};
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.error};
  margin-top: 4px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 16px 0 8px;
`;

const CompletenessContainer = styled.View`
  margin-bottom: 20px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 16px;
`;

const CompletenessHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CompletenessTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CompletenessPercentage = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const CompletenessBarContainer = styled.View`
  height: 8px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

interface CompletenessBarProps {
  percentage: number;
}

const CompletenessBar = styled.View<CompletenessBarProps>`
  height: 8px;
  width: ${props => `${props.percentage}%`};
  background-color: ${props => props.theme.colors.primary};
  border-radius: 4px;
`;

const CompletenessNote = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
`;

const SuggestionsContainer = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.card};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  margin-top: 4px;
  max-height: 200px;
  z-index: 1000;
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0 2px;
    shadow-opacity: 0.1;
    shadow-radius: 3px;
  ` : `
    elevation: 3;
  `}
`;

const SuggestionItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const SuggestionText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin: 16px 0;
`;

const SaveDraftButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background};
  border-width: 1px;
  border-color: ${props => props.theme.colors.primary};
`;

const SaveDraftText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
`;

const RequiredFieldsNote = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 8px;
`;

export default ProfilePersonalEditModal;
