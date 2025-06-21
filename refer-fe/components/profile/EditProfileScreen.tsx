import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { IProfileData } from './types';

interface EditProfileScreenProps {
  profileData: IProfileData;
  onClose: () => void;
  onSave: (data: IProfileData) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ 
  profileData, 
  onClose, 
  onSave 
}) => {
  // Create a deep copy of the profileData to use as our form state
  const [formData, setFormData] = useState<IProfileData>(JSON.parse(JSON.stringify(profileData)));
  const [activeSection, setActiveSection] = useState<string>('basic');
  
  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentKey = parent as keyof IProfileData;
      
      // Create a properly typed update
      const updatedFormData = { ...formData };
      if (parentKey === 'stats') {
        updatedFormData.stats = {
          ...updatedFormData.stats,
          [child]: parseInt(value) || 0
        };
      } else {
        // For other nested objects, handle them specifically if needed
      }
      
      setFormData(updatedFormData);
    } else {
      // For top-level string properties
      const fieldKey = field as keyof IProfileData;
      
      // Only update if it's a string property
      if (typeof formData[fieldKey] === 'string' || fieldKey === 'name' || 
          fieldKey === 'username' || fieldKey === 'bio' || 
          fieldKey === 'location' || fieldKey === 'website' || 
          fieldKey === 'profileImage' || fieldKey === 'coverImage') {
        setFormData({
          ...formData,
          [fieldKey]: value
        });
      }
    }
  };
  
  const handleAddSkill = () => {
    const newSkills = [...formData.skills, ''];
    setFormData({
      ...formData,
      skills: newSkills
    });
  };
  
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({
      ...formData,
      skills: newSkills
    });
  };
  
  const handleRemoveSkill = (index: number) => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);
    setFormData({
      ...formData,
      skills: newSkills
    });
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Header>
        <HeaderTitle>Edit Profile</HeaderTitle>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={28} color="#333" />
        </TouchableOpacity>
        <SaveButton onPress={() => onSave(formData)}>
          <SaveButtonText>Save</SaveButtonText>
        </SaveButton>
      </Header>
      
      <SectionTabs>
        <SectionTab 
          active={activeSection === 'basic'} 
          onPress={() => setActiveSection('basic')}
        >
          <SectionTabText active={activeSection === 'basic'}>Basic Info</SectionTabText>
        </SectionTab>
        <SectionTab 
          active={activeSection === 'skills'} 
          onPress={() => setActiveSection('skills')}
        >
          <SectionTabText active={activeSection === 'skills'}>Skills</SectionTabText>
        </SectionTab>
        <SectionTab 
          active={activeSection === 'experience'} 
          onPress={() => setActiveSection('experience')}
        >
          <SectionTabText active={activeSection === 'experience'}>Experience</SectionTabText>
        </SectionTab>
        <SectionTab 
          active={activeSection === 'education'} 
          onPress={() => setActiveSection('education')}
        >
          <SectionTabText active={activeSection === 'education'}>Education</SectionTabText>
        </SectionTab>
      </SectionTabs>
      
      <ScrollView style={styles.scrollContent}>
        {activeSection === 'basic' && (
          <Section>
            <SectionContent>
              <ImageSection>
                <ProfileImageContainer>
                  <ProfileImage source={{ uri: formData.profileImage }} />
                  <ChangeImageButton>
                    <Ionicons name="camera" size={18} color="#fff" />
                    <ChangeImageText>Change</ChangeImageText>
                  </ChangeImageButton>
                </ProfileImageContainer>
                <CoverImagePreview source={{ uri: formData.coverImage }} />
                <CoverImageButton>
                  <Ionicons name="image" size={18} color="#fff" />
                  <ChangeImageText>Change Cover</ChangeImageText>
                </CoverImageButton>
              </ImageSection>
              
              <InputGroup>
                <InputLabel>Full Name</InputLabel>
                <StyledInput
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                  placeholder="Your full name"
                />
              </InputGroup>
              
              <InputGroup>
                <InputLabel>Username</InputLabel>
                <StyledInput
                  value={formData.username}
                  onChangeText={(text) => handleChange('username', text)}
                  placeholder="Your username"
                />
              </InputGroup>
              
              <InputGroup>
                <InputLabel>Bio</InputLabel>
                <StyledTextarea
                  value={formData.bio}
                  onChangeText={(text) => handleChange('bio', text)}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                />
              </InputGroup>
              
              <InputGroup>
                <InputLabel>Location</InputLabel>
                <StyledInput
                  value={formData.location}
                  onChangeText={(text) => handleChange('location', text)}
                  placeholder="Your location"
                />
              </InputGroup>
              
              <InputGroup>
                <InputLabel>Website</InputLabel>
                <StyledInput
                  value={formData.website}
                  onChangeText={(text) => handleChange('website', text)}
                  placeholder="Your website"
                  autoCapitalize="none"
                />
              </InputGroup>
            </SectionContent>
          </Section>
        )}
        
        {activeSection === 'skills' && (
          <Section>
            <SectionContent>
              <InputGroup>
                <InputLabel>Skills</InputLabel>
                {formData.skills.map((skill, index) => (
                  <SkillInputContainer key={index}>
                    <SkillInput
                      value={skill}
                      onChangeText={(text) => handleSkillChange(index, text)}
                      placeholder="E.g. JavaScript, React, UI Design"
                    />
                    <RemoveButton onPress={() => handleRemoveSkill(index)}>
                      <Ionicons name="close-circle" size={22} color="#ff3b30" />
                    </RemoveButton>
                  </SkillInputContainer>
                ))}
                <AddButton onPress={handleAddSkill}>
                  <Ionicons name="add-circle" size={20} color="#0077B5" />
                  <AddButtonText>Add Skill</AddButtonText>
                </AddButton>
              </InputGroup>
            </SectionContent>
          </Section>
        )}
        
        {activeSection === 'experience' && (
          <Section>
            <SectionContent>
              {formData.experience.map((exp, index) => (
                <ExperienceItem key={exp.id}>
                  <InputGroup>
                    <InputLabel>Role</InputLabel>
                    <StyledInput
                      value={exp.role}
                      onChangeText={(text) => {
                        const newExperience = [...formData.experience];
                        newExperience[index] = {...newExperience[index], role: text};
                        setFormData({...formData, experience: newExperience});
                      }}
                      placeholder="Job title"
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <InputLabel>Company</InputLabel>
                    <StyledInput
                      value={exp.company}
                      onChangeText={(text) => {
                        const newExperience = [...formData.experience];
                        newExperience[index] = {...newExperience[index], company: text};
                        setFormData({...formData, experience: newExperience});
                      }}
                      placeholder="Company name"
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <InputLabel>Duration</InputLabel>
                    <StyledInput
                      value={exp.duration}
                      onChangeText={(text) => {
                        const newExperience = [...formData.experience];
                        newExperience[index] = {...newExperience[index], duration: text};
                        setFormData({...formData, experience: newExperience});
                      }}
                      placeholder="E.g. 2020 - Present"
                    />
                  </InputGroup>
                  
                  <Divider />
                </ExperienceItem>
              ))}
              
              <AddButton>
                <Ionicons name="add-circle" size={20} color="#0077B5" />
                <AddButtonText>Add Experience</AddButtonText>
              </AddButton>
            </SectionContent>
          </Section>
        )}
        
        {activeSection === 'education' && (
          <Section>
            <SectionContent>
              {formData.education.map((edu, index) => (
                <EducationItem key={edu.id}>
                  <InputGroup>
                    <InputLabel>Degree</InputLabel>
                    <StyledInput
                      value={edu.degree}
                      onChangeText={(text) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = {...newEducation[index], degree: text};
                        setFormData({...formData, education: newEducation});
                      }}
                      placeholder="Your degree"
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <InputLabel>Institution</InputLabel>
                    <StyledInput
                      value={edu.institution}
                      onChangeText={(text) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = {...newEducation[index], institution: text};
                        setFormData({...formData, education: newEducation});
                      }}
                      placeholder="School or University"
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <InputLabel>Year</InputLabel>
                    <StyledInput
                      value={edu.year}
                      onChangeText={(text) => {
                        const newEducation = [...formData.education];
                        newEducation[index] = {...newEducation[index], year: text};
                        setFormData({...formData, education: newEducation});
                      }}
                      placeholder="Year of graduation"
                    />
                  </InputGroup>
                  
                  <Divider />
                </EducationItem>
              ))}
              
              <AddButton>
                <Ionicons name="add-circle" size={20} color="#0077B5" />
                <AddButtonText>Add Education</AddButtonText>
              </AddButton>
            </SectionContent>
          </Section>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  scrollContent: {
    flex: 1,
  }
});

// Styled Components
const Header = styled.View`
  padding: 16px 0;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #eaeaea;
  position: relative;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
`;

const SaveButton = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 6px 12px;
  background-color: #0077B5;
  border-radius: 20px;
`;

const SaveButtonText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const SectionTabs = styled.View`
  flex-direction: row;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #eaeaea;
`;

const SectionTab = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 14px 0;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.active ? '#0077B5' : 'transparent'};
`;

const SectionTabText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  color: ${props => props.active ? '#0077B5' : '#666666'};
  font-weight: ${props => props.active ? '600' : '400'};
`;

const Section = styled.View`
  margin: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  ${Platform.OS === 'ios' ? `
    shadowColor: #000000;
    shadowOffset: 0px 1px;
    shadowOpacity: 0.05;
    shadowRadius: 3px;
  ` : `
    elevation: 2;
  `}
`;

const SectionContent = styled.View`
  padding: 16px;
`;

const InputGroup = styled.View`
  margin-bottom: 16px;
`;

const InputLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  margin-bottom: 6px;
`;

const StyledInput = styled.TextInput`
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 16px;
  color: #333333;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const StyledTextarea = styled.TextInput`
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 16px;
  color: #333333;
  border-width: 1px;
  border-color: #e0e0e0;
  height: 100px;
  ${Platform.OS === 'android' ? `
    textAlignVertical: top;
  ` : ''}
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background-color: #f0f7fb;
  border-radius: 6px;
  border-width: 1px;
  border-color: #d0e6f2;
  margin-top: 8px;
`;

const AddButtonText = styled.Text`
  color: #0077B5;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
`;

const SkillInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const SkillInput = styled.TextInput`
  flex: 1;
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 16px;
  color: #333333;
  border-width: 1px;
  border-color: #e0e0e0;
  margin-right: 10px;
`;

const RemoveButton = styled.TouchableOpacity`
  padding: 4px;
`;

const ExperienceItem = styled.View`
  margin-bottom: 16px;
`;

const EducationItem = styled.View`
  margin-bottom: 16px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #eaeaea;
  margin: 16px 0;
`;

const ImageSection = styled.View`
  align-items: center;
  margin-bottom: 24px;
  position: relative;
`;

const ProfileImageContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  overflow: hidden;
  margin-bottom: 16px;
  border-width: 3px;
  border-color: #ffffff;
  ${Platform.OS === 'android' ? `
    elevation: 2;
  ` : `
    shadowColor: #000000;
    shadowOffset: 0px 2px;
    shadowOpacity: 0.1;
    shadowRadius: 3px;
  `}
`;

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ChangeImageButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 119, 181, 0.8);
  border-radius: 20px;
  padding: 6px 10px;
  flex-direction: row;
  align-items: center;
`;

const ChangeImageText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  margin-left: 4px;
`;

const CoverImagePreview = styled.Image`
  width: 100%;
  height: 80px;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const CoverImageButton = styled.TouchableOpacity`
  background-color: rgba(0, 119, 181, 0.8);
  border-radius: 20px;
  padding: 6px 12px;
  flex-direction: row;
  align-items: center;
  align-self: center;
`;

export default EditProfileScreen;
