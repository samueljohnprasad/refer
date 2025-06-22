import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, TextInput, FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Endorser {
  id: string;
  name: string;
  image: string;
  title?: string;
  company?: string;
  relationship?: string;
  date: string;
}

interface Endorsement {
  skillId: string;
  skillName: string;
  count: number;
  endorsers: Endorser[];
}

interface ProfileEndorsementsProps {
  endorsements: Endorsement[];
  onEndorse?: (skillId: string, message: string) => void;
}

const ProfileEndorsements: React.FC<ProfileEndorsementsProps> = ({
  endorsements,
  onEndorse
}) => {
  const { theme } = useTheme();
  const [selectedSkill, setSelectedSkill] = useState<Endorsement | null>(null);
  const [endorsersModalVisible, setEndorsersModalVisible] = useState(false);
  const [endorseModalVisible, setEndorseModalVisible] = useState(false);
  const [endorsementMessage, setEndorsementMessage] = useState('');

  // Sort endorsements by count (highest first)
  const sortedEndorsements = [...endorsements].sort((a, b) => b.count - a.count);

  const handleEndorseSubmit = () => {
    if (selectedSkill) {
      onEndorse?.(selectedSkill.skillId, endorsementMessage);
      setEndorsementMessage('');
      setEndorseModalVisible(false);
      
      // Mock success message in a real app this would update the data
      Alert.alert('Success', `You've endorsed ${selectedSkill.skillName}`);
    }
  };

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Endorsements</SectionTitle>
        <EndorsementCount>{endorsements.reduce((total, e) => total + e.count, 0)}</EndorsementCount>
      </SectionHeader>

      {endorsements.length > 0 ? (
        <>
          <TopSkills>
            {sortedEndorsements.slice(0, 3).map((endorsement) => (
              <SkillItem key={endorsement.skillId}>
                <SkillInfo onPress={() => {
                  setSelectedSkill(endorsement);
                  setEndorsersModalVisible(true);
                }}>
                  <SkillName>{endorsement.skillName}</SkillName>
                  <SkillCount>{endorsement.count}</SkillCount>
                </SkillInfo>
                <EndorseButton 
                  onPress={() => {
                    setSelectedSkill(endorsement);
                    setEndorseModalVisible(true);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
                  <EndorseText>Endorse</EndorseText>
                </EndorseButton>
              </SkillItem>
            ))}
          </TopSkills>

          {endorsements.length > 3 && (
            <ViewAllButton>
              <ViewAllText>View all {endorsements.length} endorsed skills</ViewAllText>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
            </ViewAllButton>
          )}
        </>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <Ionicons name="ribbon-outline" size={32} color={theme.colors.secondary} />
          </EmptyIcon>
          <EmptyText>No endorsements yet</EmptyText>
          <EmptyDescription>
            Endorsements from your network help showcase your expertise
          </EmptyDescription>
        </EmptyState>
      )}

      {/* Endorsers Modal */}
      <Modal
        visible={endorsersModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEndorsersModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {selectedSkill?.skillName} ({selectedSkill?.count})
              </ModalTitle>
              <CloseButton onPress={() => setEndorsersModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>
            
            <FlatList
              data={selectedSkill?.endorsers || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EndorserItem>
                  <EndorserImage source={{ uri: item.image }} />
                  <EndorserInfo>
                    <EndorserName>{item.name}</EndorserName>
                    {(item.title || item.company) && (
                      <EndorserTitle>
                        {item.title}{item.company ? ` at ${item.company}` : ''}
                      </EndorserTitle>
                    )}
                    <EndorserRelationship>
                      {item.relationship || 'Connection'} · {item.date}
                    </EndorserRelationship>
                  </EndorserInfo>
                </EndorserItem>
              )}
              ListEmptyComponent={
                <EmptyEndorsers>
                  <Ionicons name="people-outline" size={40} color={theme.colors.secondary} />
                  <EmptyEndorsersText>No endorsements for this skill yet</EmptyEndorsersText>
                </EmptyEndorsers>
              }
            />
            
            <EndorseButtonLarge 
              onPress={() => {
                setEndorsersModalVisible(false);
                setEndorseModalVisible(true);
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color="white" style={{ marginRight: 8 }} />
              <EndorseButtonLargeText>Endorse this skill</EndorseButtonLargeText>
            </EndorseButtonLarge>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {/* Endorse Modal */}
      <Modal
        visible={endorseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEndorseModalVisible(false)}
      >
        <ModalOverlay>
          <EndorseModalContent>
            <ModalHeader>
              <ModalTitle>Endorse {selectedSkill?.skillName}</ModalTitle>
              <CloseButton onPress={() => setEndorseModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>

            <EndorseForm>
              <EndorseFormLabel>
                How would you rate their expertise in {selectedSkill?.skillName}?
              </EndorseFormLabel>
              
              <RatingContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton key={star}>
                    <Ionicons name="star" size={32} color="#FFC107" />
                  </StarButton>
                ))}
              </RatingContainer>
              
              <EndorseFormLabel>Add a personal note (optional)</EndorseFormLabel>
              <EndorsementInput
                placeholder="Describe how you've seen them demonstrate this skill..."
                placeholderTextColor={theme.colors.secondary}
                multiline
                maxLength={250}
                value={endorsementMessage}
                onChangeText={setEndorsementMessage}
              />
              
              <CharacterCount>
                {endorsementMessage.length}/250 characters
              </CharacterCount>
              
              <ButtonsRow>
                <CancelButton onPress={() => setEndorseModalVisible(false)}>
                  <CancelButtonText>Cancel</CancelButtonText>
                </CancelButton>
                <SubmitButton onPress={handleEndorseSubmit}>
                  <SubmitButtonText>Submit Endorsement</SubmitButtonText>
                </SubmitButton>
              </ButtonsRow>
            </EndorseForm>
          </EndorseModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius?.md || 8}px;
  margin: 0 16px 16px;
  padding: 16px;
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

const EndorsementCount = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const TopSkills = styled.View`
  margin-bottom: 12px;
`;

const SkillItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const SkillInfo = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SkillName = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const SkillCount = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  margin-right: 12px;
`;

const EndorseButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  padding: 6px 12px;
  border-radius: 16px;
`;

const EndorseText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  margin-left: 4px;
`;

const ViewAllButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  margin-top: 4px;
`;

const ViewAllText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  margin-right: 4px;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: 24px 0 12px;
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
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const EmptyDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  padding: 0 24px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 90%;
  background-color: ${props => props.theme.colors.card};
  border-radius: 16px;
  padding: 20px;
  elevation: 5;
  max-height: 70%;
`;

const EndorseModalContent = styled.View`
  width: 90%;
  background-color: ${props => props.theme.colors.card};
  border-radius: 16px;
  padding: 20px;
  elevation: 5;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
`;

const EndorserItem = styled.View`
  flex-direction: row;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const EndorserImage = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 12px;
`;

const EndorserInfo = styled.View`
  flex: 1;
`;

const EndorserName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const EndorserTitle = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const EndorserRelationship = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 2px;
`;

const EmptyEndorsers = styled.View`
  align-items: center;
  padding: 24px 0;
`;

const EmptyEndorsersText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 12px;
  text-align: center;
`;

const EndorseButtonLarge = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
`;

const EndorseButtonLargeText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const EndorseForm = styled.View`
  padding: 4px 0;
`;

const EndorseFormLabel = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
`;

const StarButton = styled.TouchableOpacity`
  padding: 4px;
`;

const EndorsementInput = styled.TextInput`
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 12px;
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  text-align-vertical: top;
`;

const CharacterCount = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  text-align: right;
  margin-top: 4px;
  margin-bottom: 16px;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background};
  align-items: center;
  margin-right: 8px;
`;

const CancelButtonText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
`;

const SubmitButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary};
  align-items: center;
  margin-left: 8px;
`;

const SubmitButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

export default ProfileEndorsements;
