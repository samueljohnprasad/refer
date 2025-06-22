import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Skill {
  id: string;
  name: string;
  endorsements: number;
}

interface ProfileSkillsProps {
  skills: Skill[];
  editable?: boolean;
  onAddSkill?: () => void;
  onEditSkill?: (skill: Skill) => void;
  onEndorse?: (skillId: string) => void;
}

const ProfileSkills: React.FC<ProfileSkillsProps> = ({
  skills,
  editable = false,
  onAddSkill,
  onEditSkill,
  onEndorse
}) => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);
  
  // Only show the first 5 skills initially
  const displaySkills = showAll ? skills : skills.slice(0, 5);
  const hasMoreSkills = skills.length > 5;

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Skills</SectionTitle>
        {editable && (
          <AddButton onPress={onAddSkill}>
            <Ionicons name="add" size={18} color={theme.colors.primary} />
            <AddButtonText>Add</AddButtonText>
          </AddButton>
        )}
      </SectionHeader>
      
      <SkillsGrid>
        {displaySkills.map(skill => (
          <SkillItem key={skill.id}>
            <SkillItemContent>
              <SkillName>{skill.name}</SkillName>
              <EndorsementRow>
                <Ionicons name="thumbs-up-outline" size={12} color={theme.colors.secondary} />
                <EndorsementCount>{skill.endorsements}</EndorsementCount>
              </EndorsementRow>
            </SkillItemContent>
            
            <ButtonsContainer>
              {editable ? (
                <ActionButton onPress={() => onEditSkill?.(skill)}>
                  <Ionicons name="pencil-outline" size={14} color={theme.colors.secondary} />
                </ActionButton>
              ) : (
                <ActionButton onPress={() => onEndorse?.(skill.id)}>
                  <Ionicons name="add-circle-outline" size={14} color={theme.colors.primary} />
                </ActionButton>
              )}
            </ButtonsContainer>
          </SkillItem>
        ))}
      </SkillsGrid>
      
      {hasMoreSkills && (
        <ShowMoreButton onPress={() => setShowAll(!showAll)}>
          <ShowMoreText>
            {showAll ? 'Show Less' : `Show All (${skills.length})`}
          </ShowMoreText>
          <Ionicons 
            name={showAll ? 'chevron-up' : 'chevron-down'} 
            size={14} 
            color={theme.colors.primary}
            style={{ marginLeft: 4 }}
          />
        </ShowMoreButton>
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

const SkillsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const SkillItem = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm}px;
  padding: 8px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: space-between;
  min-width: 100px;
`;

const SkillItemContent = styled.View`
  flex: 1;
`;

const SkillName = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const EndorsementRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const EndorsementCount = styled.Text`
  color: ${props => props.theme.colors.secondary};
  font-size: 12px;
  margin-left: 4px;
`;

const ButtonsContainer = styled.View`
  margin-left: 8px;
`;

const ActionButton = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

const ShowMoreButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-top: 4px;
`;

const ShowMoreText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
`;

export default ProfileSkills;
