import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description?: string;
  logo?: string;
}

interface ProfileExperienceProps {
  experiences: ExperienceItem[];
  editable?: boolean;
  onAddExperience?: () => void;
  onEditExperience?: (experience: ExperienceItem) => void;
}

const ProfileExperience: React.FC<ProfileExperienceProps> = ({
  experiences,
  editable = false,
  onAddExperience,
  onEditExperience
}) => {
  const { theme } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Experience</SectionTitle>
        {editable && (
          <AddButton onPress={onAddExperience}>
            <Ionicons name="add" size={18} color={theme.colors.primary} />
            <AddButtonText>Add</AddButtonText>
          </AddButton>
        )}
      </SectionHeader>

      {experiences.map(experience => (
        <ExperienceItem key={experience.id}>
          <ExperienceHeader>
            {experience.logo ? (
              <CompanyLogo source={{ uri: experience.logo }} />
            ) : (
              <CompanyLogoFallback>
                <CompanyInitial>{experience.company.charAt(0)}</CompanyInitial>
              </CompanyLogoFallback>
            )}
            
            <ExperienceInfo>
              <RoleText>{experience.role}</RoleText>
              <CompanyText>{experience.company}</CompanyText>
              <DurationText>{experience.duration}</DurationText>
            </ExperienceInfo>

            <ActionButtons>
              {editable && (
                <ActionButton onPress={() => onEditExperience?.(experience)}>
                  <Ionicons name="pencil-outline" size={16} color={theme.colors.secondary} />
                </ActionButton>
              )}
              
              {experience.description && (
                <ActionButton onPress={() => toggleExpanded(experience.id)}>
                  <Ionicons
                    name={expandedId === experience.id ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={theme.colors.secondary}
                  />
                </ActionButton>
              )}
            </ActionButtons>
          </ExperienceHeader>
          
          {expandedId === experience.id && experience.description && (
            <DescriptionText>{experience.description}</DescriptionText>
          )}
        </ExperienceItem>
      ))}

      {experiences.length === 0 && (
        <EmptyState>
          <EmptyIcon>
            <Ionicons name="briefcase-outline" size={32} color={theme.colors.secondary} />
          </EmptyIcon>
          <EmptyText>No experience added yet</EmptyText>
          {editable && (
            <AddFirstButton onPress={onAddExperience}>
              <AddFirstButtonText>Add Experience</AddFirstButtonText>
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

const ExperienceItem = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  padding-bottom: 12px;
  margin-bottom: 12px;
`;

const ExperienceHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CompanyLogo = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 12px;
`;

const CompanyLogoFallback = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary}30;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const CompanyInitial = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const ExperienceInfo = styled.View`
  flex: 1;
`;

const RoleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const CompanyText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const DurationText = styled.Text`
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

const ActionButtons = styled.View`
  flex-direction: row;
  margin-left: auto;
`;

const ActionButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
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

export default ProfileExperience;
