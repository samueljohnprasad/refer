import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from './ProfileEditModal';
import { useTheme } from '../../../context/ThemeContext';

interface Skill {
  id: string;
  name: string;
  endorsements: number;
}

interface ProfileSkillsEditModalProps {
  visible: boolean;
  onClose: () => void;
  skills: Skill[];
  onSave: (skills: Skill[]) => void;
}

const ProfileSkillsEditModal: React.FC<ProfileSkillsEditModalProps> = ({
  visible,
  onClose,
  skills,
  onSave
}) => {
  const { theme } = useTheme();
  const [skillsList, setSkillsList] = useState<Skill[]>(skills);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleAddSkill = () => {
    if (newSkill.trim() === '') return;
    
    // Check for duplicates
    if (skillsList.some(skill => skill.name.toLowerCase() === newSkill.toLowerCase())) {
      Alert.alert('Duplicate Skill', 'This skill is already in your profile.');
      return;
    }
    
    const newSkillObj: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkill.trim(),
      endorsements: 0
    };
    
    setSkillsList([...skillsList, newSkillObj]);
    setNewSkill('');
  };

  const handleDeleteSkill = (id: string) => {
    Alert.alert(
      'Delete Skill',
      'Are you sure you want to remove this skill from your profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setSkillsList(skillsList.filter(skill => skill.id !== id));
          }
        }
      ]
    );
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setNewSkill(skill.name);
  };

  const handleUpdateSkill = () => {
    if (editingSkill && newSkill.trim() !== '') {
      // Check for duplicates excluding the current skill
      if (skillsList.some(
        skill => skill.id !== editingSkill.id && 
        skill.name.toLowerCase() === newSkill.toLowerCase()
      )) {
        Alert.alert('Duplicate Skill', 'This skill is already in your profile.');
        return;
      }
      
      setSkillsList(skillsList.map(skill => 
        skill.id === editingSkill.id 
          ? { ...skill, name: newSkill.trim() }
          : skill
      ));
      setEditingSkill(null);
      setNewSkill('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
    setNewSkill('');
  };

  const handleSave = () => {
    onSave(skillsList);
    onClose();
  };

  return (
    <ProfileEditModal
      visible={visible}
      title="Edit Skills"
      onClose={onClose}
      onSave={handleSave}
      scrollable={true}
    >
      <InputContainer>
        <SkillInput
          value={newSkill}
          onChangeText={setNewSkill}
          placeholder="Add a new skill..."
          placeholderTextColor={theme.colors.secondary}
          returnKeyType="done"
          onSubmitEditing={editingSkill ? handleUpdateSkill : handleAddSkill}
        />
        {editingSkill ? (
          <ButtonsRow>
            <ActionButton onPress={handleCancelEdit} style={{ backgroundColor: theme.colors.background }}>
              <ActionButtonText style={{ color: theme.colors.text }}>Cancel</ActionButtonText>
            </ActionButton>
            <ActionButton onPress={handleUpdateSkill} style={{ backgroundColor: theme.colors.primary }}>
              <ActionButtonText style={{ color: 'white' }}>Update</ActionButtonText>
            </ActionButton>
          </ButtonsRow>
        ) : (
          <AddButton onPress={handleAddSkill}>
            <Ionicons name="add" size={24} color="white" />
          </AddButton>
        )}
      </InputContainer>

      <SkillsListContainer>
        {skillsList.length > 0 ? (
          skillsList.map(skill => (
            <SkillItem key={skill.id}>
              <SkillName>{skill.name}</SkillName>
              <SkillActions>
                <SkillAction onPress={() => handleEditSkill(skill)}>
                  <Ionicons name="pencil-outline" size={18} color={theme.colors.text} />
                </SkillAction>
                <SkillAction onPress={() => handleDeleteSkill(skill.id)}>
                  <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                </SkillAction>
              </SkillActions>
            </SkillItem>
          ))
        ) : (
          <EmptyListMessage>No skills added yet. Add some skills to showcase your expertise.</EmptyListMessage>
        )}
      </SkillsListContainer>

      {skillsList.length > 0 && (
        <HelpText>Tap and hold to drag and reorder your skills (most important first)</HelpText>
      )}
    </ProfileEditModal>
  );
};

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const SkillInput = styled.TextInput`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

const AddButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-left: 12px;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  margin-left: 12px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 8px;
`;

const ActionButtonText = styled.Text`
  font-size: 14px;
  font-weight: 500;
`;

const SkillsListContainer = styled.View`
  margin-bottom: 16px;
`;

const SkillItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  margin-bottom: 8px;
`;

const SkillName = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const SkillActions = styled.View`
  flex-direction: row;
`;

const SkillAction = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
`;

const EmptyListMessage = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.secondary};
  font-size: 14px;
  margin: 20px 0;
`;

const HelpText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  margin-bottom: 16px;
`;

export default ProfileSkillsEditModal;
