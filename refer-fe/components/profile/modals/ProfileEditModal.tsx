import React, { ReactNode } from 'react';
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

interface ProfileEditModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave?: () => void;
  children: ReactNode;
  saveDisabled?: boolean;
  scrollable?: boolean;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  title,
  onClose,
  onSave,
  children,
  saveDisabled = false,
  scrollable = true
}) => {
  const { theme } = useTheme();

  const handleBackdropPress = () => {
    // Optional: You can add a confirmation if there are unsaved changes
    onClose();
  };

  const handleContentPress = (e: any) => {
    // Prevent closing when pressing inside the content
    e.stopPropagation();
  };

  const Content = scrollable ? ScrollableContent : FixedContent;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalContainer onPress={handleBackdropPress}>
        <ModalContent onPress={handleContentPress} activeOpacity={1}>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </CloseButton>
          </ModalHeader>
          
          <Content>
            {children}
          </Content>
          
          <ModalFooter>
            <CancelButton onPress={onClose}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
            <SaveButton 
              onPress={onSave} 
              disabled={saveDisabled}
              style={{ opacity: saveDisabled ? 0.5 : 1 }}
            >
              <SaveButtonText>Save</SaveButtonText>
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

const ModalContainer = styled(TouchableWithoutFeedback)`
  flex: 1;
`;

const ModalContent = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.card};
  margin: auto 16px;
  border-radius: 16px;
  max-height: 85%;
  width: 90%;
  overflow: hidden;
`;

const ScrollableContent = styled(ScrollView)`
  padding: 16px;
`;

const FixedContent = styled.View`
  padding: 16px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
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

const ModalFooter = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding: 16px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
`;

const CancelButton = styled.TouchableOpacity`
  padding: 12px 20px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background};
  margin-right: 12px;
`;

const CancelButtonText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
`;

const SaveButton = styled.TouchableOpacity`
  padding: 12px 24px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary};
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

export default ProfileEditModal;
