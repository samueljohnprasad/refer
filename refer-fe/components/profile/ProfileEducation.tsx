import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description?: string;
  logo?: string;
}

interface ProfileEducationProps {
  education: EducationItem[];
  editable?: boolean;
  onAddEducation?: () => void;
  onEditEducation?: (education: EducationItem) => void;
}

const ProfileEducation: React.FC<ProfileEducationProps> = ({
  education,
  editable = false,
  onAddEducation,
  onEditEducation
}) => {
  const { theme } = useTheme();

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Education</SectionTitle>
        {editable && (
          <AddButton onPress={onAddEducation}>
            <Ionicons name="add" size={18} color={theme.colors.primary} />
            <AddButtonText>Add</AddButtonText>
          </AddButton>
        )}
      </SectionHeader>

      {education.map(item => (
        <EducationItem key={item.id}>
          <EducationHeader>
            {item.logo ? (
              <InstitutionLogo source={{ uri: item.logo }} />
            ) : (
              <InstitutionLogoFallback>
                <InstitutionInitial>{item.institution.charAt(0)}</InstitutionInitial>
              </InstitutionLogoFallback>
            )}
            
            <EducationInfo>
              <DegreeText>{item.degree}</DegreeText>
              <InstitutionText>{item.institution}</InstitutionText>
              <YearText>{item.year}</YearText>
            </EducationInfo>

            {editable && (
              <ActionButton onPress={() => onEditEducation?.(item)}>
                <Ionicons name="pencil-outline" size={16} color={theme.colors.secondary} />
              </ActionButton>
            )}
          </EducationHeader>
          
          {item.description && (
            <DescriptionText>{item.description}</DescriptionText>
          )}
        </EducationItem>
      ))}

      {education.length === 0 && (
        <EmptyState>
          <EmptyIcon>
            <Ionicons name="school-outline" size={32} color={theme.colors.secondary} />
          </EmptyIcon>
          <EmptyText>No education added yet</EmptyText>
          {editable && (
            <AddFirstButton onPress={onAddEducation}>
              <AddFirstButtonText>Add Education</AddFirstButtonText>
            </AddFirstButton>
          )}
        </EmptyState>
      )}
    </Container>
  );
};

const Container = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  margin: 0 16px 16px;
  padding: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 2;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const AddButtonText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  margin-left: 4px;
`;

const EducationItem = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  padding-bottom: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    border-bottom-width: 0;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const EducationHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InstitutionLogo = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 12px;
`;

const InstitutionLogoFallback = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary}20;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const InstitutionInitial = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const EducationInfo = styled.View`
  flex: 1;
`;

const DegreeText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const InstitutionText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const YearText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 2px;
`;

const DescriptionText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  margin-top: 8px;
  padding-left: 52px;
  line-height: 20px;
`;

const ActionButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: 24px 0;
`;

const EmptyIcon = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const EmptyText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 16px;
`;

const AddFirstButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 8px 16px;
  border-radius: 20px;
`;

const AddFirstButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

export default ProfileEducation;
