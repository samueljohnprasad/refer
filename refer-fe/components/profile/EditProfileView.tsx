import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { Profile, ProfileFormData } from '../../types/profile.types';
import { updateUserProfile, checkUsernameAvailability } from '../../store/profileThunks';
import { RootState, AppDispatch } from '../../store';
import { setUsernameAvailability } from '../../store/profileSlice';
import { debounce } from 'lodash';

type EditProfileViewProps = {
  profile: Profile;
};

const EditProfileView: React.FC<EditProfileViewProps> = ({ profile }: EditProfileViewProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isUsernameAvailable, isCheckingUsername } = useSelector(
    (state: RootState) => state.profile
  );
  
  const [formData, setFormData] = useState<ProfileFormData>({
    username: profile.username || '',
    fullName: profile.fullName || '',
    headline: profile.headline || '',
    summary: profile.summary || '',
    experience: profile.experience || '',
    skills: profile.skills || [],
    contactEmail: profile.contactEmail || '',
    location: profile.location || '',
    socialLinks: {
      linkedin: profile.socialLinks?.linkedin || '',
      twitter: profile.socialLinks?.twitter || '',
      github: profile.socialLinks?.github || '',
      website: profile.socialLinks?.website || '',
    },
    privacySettings: {
      showEmail: profile.privacySettings?.showEmail || false,
      showLocation: profile.privacySettings?.showLocation || true,
      showSocialLinks: profile.privacySettings?.showSocialLinks || true,
      isPublicProfile: profile.privacySettings?.isPublicProfile || true,
    },
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [skillInput, setSkillInput] = useState<string>('');
  const [isSaveSuccessful, setIsSaveSuccessful] = useState<boolean>(false);
  
  // Username validation with debounce
  const debouncedCheckUsername = debounce((username: string) => {
    if (username.length >= 3 && username.match(/^[a-zA-Z0-9_-]+$/)) {
      dispatch(checkUsernameAvailability(username));
    } else {
      dispatch(setUsernameAvailability(null));
    }
  }, 500);
  
  useEffect(() => {
    if (formData.username && formData.username !== profile.username) {
      debouncedCheckUsername(formData.username);
    }
    return () => {
      debouncedCheckUsername.cancel();
    };
  }, [formData.username, profile.username]);
  
  const handleChange = (field: keyof ProfileFormData, value: any): void => {
    setFormData({ ...formData, [field]: value });
    
    // Clear validation error when field is edited
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
    
    // Clear success message when form is changed
    if (isSaveSuccessful) {
      setIsSaveSuccessful(false);
    }
  };
  
  const handleNestedChange = (
    parentField: 'socialLinks' | 'privacySettings',
    field: string,
    value: any
  ): void => {
    setFormData({
      ...formData,
      [parentField]: {
        ...formData[parentField],
        [field]: value,
      },
    });
  };
  
  const handleAddSkill = (): void => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string): void => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!formData.username.match(/^[a-zA-Z0-9_-]+$/)) {
      errors.username = 'Username can only contain letters, numbers, underscores and hyphens';
    } else if (formData.username !== profile.username && isUsernameAvailable === false) {
      errors.username = 'Username is already taken';
    }
    
    // Email validation (if provided)
    if (formData.contactEmail && !formData.contactEmail.match(/^\S+@\S+\.\S+$/)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    
    // URL validations for social links
    const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
    
    ['linkedin', 'twitter', 'github', 'website'].forEach((site) => {
      const url = formData.socialLinks[site as keyof typeof formData.socialLinks];
      if (url && !urlRegex.test(url)) {
        errors[`socialLinks.${site}`] = `Please enter a valid ${site} URL`;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (): Promise<void> => {
    if (validateForm()) {
      try {
        await dispatch(updateUserProfile(formData));
        setIsSaveSuccessful(true);
      } catch (err) {
        // Error handling is managed by the thunk
      }
    }
  };
  
  return (
    <Container>
      <SectionTitle>Edit Your Profile</SectionTitle>
      
      {/* Username section with availability check */}
      <FormGroup>
        <Label>Username* (required)</Label>
        <InputContainer isError={!!validationErrors.username}>
          <Input
            value={formData.username}
            onChangeText={(text) => handleChange('username', text)}
            placeholder="Enter username"
            autoCapitalize="none"
          />
          {isCheckingUsername && <ActivityIndicator size="small" style={{ marginLeft: 8 }} />}
          
          {!isCheckingUsername && formData.username !== profile.username && isUsernameAvailable === true && (
            <UsernameAvailableText>✓ Username available</UsernameAvailableText>
          )}
        </InputContainer>
        {validationErrors.username && (
          <ErrorText>{validationErrors.username}</ErrorText>
        )}
      </FormGroup>
      
      {/* Basic information */}
      <FormGroup>
        <Label>Full Name</Label>
        <Input
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
          placeholder="Enter your full name"
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Headline</Label>
        <Input
          value={formData.headline}
          onChangeText={(text) => handleChange('headline', text)}
          placeholder="Your professional headline"
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Email</Label>
        <Input
          value={formData.contactEmail}
          onChangeText={(text) => handleChange('contactEmail', text)}
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {validationErrors.contactEmail && (
          <ErrorText>{validationErrors.contactEmail}</ErrorText>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>Location</Label>
        <Input
          value={formData.location}
          onChangeText={(text) => handleChange('location', text)}
          placeholder="City, Country"
        />
      </FormGroup>
      
      {/* About you */}
      <SectionTitle>About You</SectionTitle>
      
      <FormGroup>
        <Label>Summary</Label>
        <TextArea
          value={formData.summary}
          onChangeText={(text) => handleChange('summary', text)}
          placeholder="Write a brief summary about yourself"
          multiline
          numberOfLines={4}
          style={{ textAlignVertical: 'top' }}
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Experience</Label>
        <TextArea
          value={formData.experience}
          onChangeText={(text) => handleChange('experience', text)}
          placeholder="Share your work experience"
          multiline
          numberOfLines={4}
          style={{ textAlignVertical: 'top' }}
        />
      </FormGroup>
      
      {/* Skills section */}
      <FormGroup>
        <Label>Skills</Label>
        <SkillInputContainer>
          <SkillInput
            value={skillInput}
            onChangeText={setSkillInput}
            placeholder="Add a skill"
          />
          <AddSkillButton onPress={handleAddSkill}>
            <AddSkillButtonText>Add</AddSkillButtonText>
          </AddSkillButton>
        </SkillInputContainer>
        
        <SkillsContainer>
          {formData.skills.map((skill, index) => (
            <SkillChip key={index}>
              <SkillChipText>{skill}</SkillChipText>
              <RemoveSkillButton onPress={() => handleRemoveSkill(skill)}>
                <RemoveSkillText>×</RemoveSkillText>
              </RemoveSkillButton>
            </SkillChip>
          ))}
        </SkillsContainer>
      </FormGroup>
      
      {/* Social links */}
      <SectionTitle>Social Links</SectionTitle>
      
      <FormGroup>
        <Label>LinkedIn</Label>
        <Input
          value={formData.socialLinks.linkedin}
          onChangeText={(text) => handleNestedChange('socialLinks', 'linkedin', text)}
          placeholder="LinkedIn profile URL"
          autoCapitalize="none"
        />
        {validationErrors['socialLinks.linkedin'] && (
          <ErrorText>{validationErrors['socialLinks.linkedin']}</ErrorText>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>Twitter</Label>
        <Input
          value={formData.socialLinks.twitter}
          onChangeText={(text) => handleNestedChange('socialLinks', 'twitter', text)}
          placeholder="Twitter profile URL"
          autoCapitalize="none"
        />
        {validationErrors['socialLinks.twitter'] && (
          <ErrorText>{validationErrors['socialLinks.twitter']}</ErrorText>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>GitHub</Label>
        <Input
          value={formData.socialLinks.github}
          onChangeText={(text) => handleNestedChange('socialLinks', 'github', text)}
          placeholder="GitHub profile URL"
          autoCapitalize="none"
        />
        {validationErrors['socialLinks.github'] && (
          <ErrorText>{validationErrors['socialLinks.github']}</ErrorText>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>Personal Website</Label>
        <Input
          value={formData.socialLinks.website}
          onChangeText={(text) => handleNestedChange('socialLinks', 'website', text)}
          placeholder="Your website URL"
          autoCapitalize="none"
        />
        {validationErrors['socialLinks.website'] && (
          <ErrorText>{validationErrors['socialLinks.website']}</ErrorText>
        )}
      </FormGroup>
      
      {/* Privacy settings */}
      <SectionTitle>Privacy Settings</SectionTitle>
      
      <FormGroup>
        <PrivacyRow>
          <PrivacyLabel>Show email to others</PrivacyLabel>
          <Switch
            value={formData.privacySettings.showEmail}
            onValueChange={(value) => handleNestedChange('privacySettings', 'showEmail', value)}
          />
        </PrivacyRow>
      </FormGroup>
      
      <FormGroup>
        <PrivacyRow>
          <PrivacyLabel>Show location</PrivacyLabel>
          <Switch
            value={formData.privacySettings.showLocation}
            onValueChange={(value) => handleNestedChange('privacySettings', 'showLocation', value)}
          />
        </PrivacyRow>
      </FormGroup>
      
      <FormGroup>
        <PrivacyRow>
          <PrivacyLabel>Show social links</PrivacyLabel>
          <Switch
            value={formData.privacySettings.showSocialLinks}
            onValueChange={(value) => handleNestedChange('privacySettings', 'showSocialLinks', value)}
          />
        </PrivacyRow>
      </FormGroup>
      
      <FormGroup>
        <PrivacyRow>
          <PrivacyLabel>Public profile</PrivacyLabel>
          <Switch
            value={formData.privacySettings.isPublicProfile}
            onValueChange={(value) => handleNestedChange('privacySettings', 'isPublicProfile', value)}
          />
        </PrivacyRow>
        <PrivacyHelpText>
          When turned off, your profile will not be visible to others
        </PrivacyHelpText>
      </FormGroup>
      
      {/* Success message */}
      {isSaveSuccessful && (
        <SuccessMessage>Profile updated successfully!</SuccessMessage>
      )}
      
      {/* Error message */}
      {error && <ErrorText>{error}</ErrorText>}
      
      {/* Save and Cancel buttons */}
      <ButtonContainer>
        <SaveButton onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <SaveButtonText>Save Profile</SaveButtonText>
          )}
        </SaveButton>
      </ButtonContainer>
    </Container>
  );
};

// Styled components
const Container = styled.View`
  padding: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: 8px;
  color: #333333;
`;

const FormGroup = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #555555;
`;

const InputContainer = styled.View<{ isError?: boolean }>`
  flex-direction: row;
  align-items: center;
  border-radius: 4px;
  border-width: 1px;
  border-color: ${(props) => (props.isError ? '#ff3b30' : '#dddddd')};
`;

const Input = styled.TextInput`
  flex: 1;
  height: 48px;
  padding: 8px 12px;
  font-size: 16px;
  color: #333333;
  background-color: white;
  border-radius: 4px;
`;

const TextArea = styled.TextInput`
  height: 120px;
  padding: 12px;
  font-size: 16px;
  color: #333333;
  background-color: white;
  border-width: 1px;
  border-color: #dddddd;
  border-radius: 4px;
`;

// Apply textAlignVertical in a style object when using the component

const ErrorText = styled.Text`
  color: #ff3b30;
  font-size: 12px;
  margin-top: 4px;
`;

const SuccessMessage = styled.Text`
  color: #34c759;
  font-size: 14px;
  margin: 8px 0;
  text-align: center;
`;

const UsernameAvailableText = styled.Text`
  color: #34c759;
  font-size: 12px;
  margin-left: 8px;
`;

const SkillInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const SkillInput = styled.TextInput`
  flex: 1;
  height: 48px;
  padding: 8px 12px;
  font-size: 16px;
  color: #333333;
  background-color: white;
  border-width: 1px;
  border-color: #dddddd;
  border-radius: 4px;
`;

const AddSkillButton = styled.TouchableOpacity`
  padding: 12px 16px;
  background-color: #007bff;
  border-radius: 4px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
`;

const AddSkillButtonText = styled.Text`
  color: white;
  font-weight: 500;
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const SkillChip = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f1f1f1;
  border-radius: 16px;
  padding: 6px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const SkillChipText = styled.Text`
  color: #333333;
  font-size: 14px;
`;

const RemoveSkillButton = styled.TouchableOpacity`
  margin-left: 6px;
`;

const RemoveSkillText = styled.Text`
  color: #999999;
  font-size: 16px;
  font-weight: bold;
`;

const PrivacyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PrivacyLabel = styled.Text`
  font-size: 16px;
  color: #333333;
`;

const PrivacyHelpText = styled.Text`
  font-size: 12px;
  color: #999999;
  margin-top: 4px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const SaveButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? '#cccccc' : '#007bff')};
  padding: 14px 20px;
  border-radius: 8px;
  width: 100%;
  align-items: center;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default EditProfileView;
