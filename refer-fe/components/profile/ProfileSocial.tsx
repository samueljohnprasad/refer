import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Share, Alert, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import QRCode from 'react-native-qrcode-svg';

interface ProfileSocialProps {
  username: string;
  userId: string;
  profileUrl: string;
}

const ProfileSocial: React.FC<ProfileSocialProps> = ({
  username,
  userId,
  profileUrl
}) => {
  const { theme } = useTheme();
  const [qrVisible, setQrVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  
  // Generate shareable URL
  const generateShareableUrl = () => {
    return profileUrl || `https://refernet.com/profile/${username}`;
  };

  // Handle profile sharing
  const handleShare = async () => {
    try {
      const shareUrl = generateShareableUrl();
      const result = await Share.share({
        message: `Check out my professional profile on ReferNet: ${shareUrl}`,
        url: shareUrl
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while sharing your profile');
    }
  };

  // Function to copy link to clipboard - in a real app this would use Clipboard.setString
  const copyLink = () => {
    // Mock implementation - In real app: Clipboard.setString(generateShareableUrl())
    Alert.alert('Success', 'Profile link copied to clipboard');
  };

  const screenWidth = Dimensions.get('window').width;
  const qrSize = screenWidth * 0.7;

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Share Your Profile</SectionTitle>
      </SectionHeader>

      <ShareOptionsContainer>
        <ShareOption onPress={() => setShareModalVisible(true)}>
          <ShareIconContainer>
            <Ionicons name="share-social" size={24} color={theme.colors.primary} />
          </ShareIconContainer>
          <ShareText>Share Profile</ShareText>
        </ShareOption>
        
        <ShareOption onPress={copyLink}>
          <ShareIconContainer>
            <Ionicons name="link" size={24} color={theme.colors.primary} />
          </ShareIconContainer>
          <ShareText>Copy Link</ShareText>
        </ShareOption>
        
        <ShareOption onPress={() => setQrVisible(true)}>
          <ShareIconContainer>
            <MaterialCommunityIcons name="qrcode" size={24} color={theme.colors.primary} />
          </ShareIconContainer>
          <ShareText>QR Code</ShareText>
        </ShareOption>
      </ShareOptionsContainer>

      <ProfileURLContainer>
        <ProfileURL>{generateShareableUrl()}</ProfileURL>
      </ProfileURLContainer>

      {/* QR Code Modal */}
      <Modal
        visible={qrVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQrVisible(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Profile QR Code</ModalTitle>
              <CloseButton onPress={() => setQrVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>
            
            <QRCodeContainer>
              <QRCode
                value={generateShareableUrl()}
                size={qrSize}
                color={theme.colors.text}
                backgroundColor={theme.colors.card}
              />
            </QRCodeContainer>
            
            <QRInstructions>
              Let others scan this QR code to view your ReferNet profile
            </QRInstructions>
            
            <ShareButton onPress={handleShare}>
              <Ionicons name="share-outline" size={18} color="white" style={{ marginRight: 8 }} />
              <ShareButtonText>Share Link</ShareButtonText>
            </ShareButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {/* Share Options Modal */}
      <Modal
        visible={shareModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <ModalOverlay>
          <SharingOptionsContent>
            <ModalHeader>
              <ModalTitle>Share Profile</ModalTitle>
              <CloseButton onPress={() => setShareModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>
            
            <SharingGrid>
              <SharingOptionButton style={{ backgroundColor: '#25D366' }} onPress={handleShare}>
                <Ionicons name="logo-whatsapp" size={30} color="white" />
                <SharingOptionText>WhatsApp</SharingOptionText>
              </SharingOptionButton>
              
              <SharingOptionButton style={{ backgroundColor: '#0088cc' }} onPress={handleShare}>
                <Ionicons name="paper-plane" size={30} color="white" />
                <SharingOptionText>Telegram</SharingOptionText>
              </SharingOptionButton>
              
              <SharingOptionButton style={{ backgroundColor: '#1DA1F2' }} onPress={handleShare}>
                <Ionicons name="logo-twitter" size={30} color="white" />
                <SharingOptionText>Twitter</SharingOptionText>
              </SharingOptionButton>
              
              <SharingOptionButton style={{ backgroundColor: '#0077B5' }} onPress={handleShare}>
                <Ionicons name="logo-linkedin" size={30} color="white" />
                <SharingOptionText>LinkedIn</SharingOptionText>
              </SharingOptionButton>
              
              <SharingOptionButton style={{ backgroundColor: '#1877F2' }} onPress={handleShare}>
                <Ionicons name="logo-facebook" size={30} color="white" />
                <SharingOptionText>Facebook</SharingOptionText>
              </SharingOptionButton>
              
              <SharingOptionButton style={{ backgroundColor: '#FF4500' }} onPress={handleShare}>
                <Ionicons name="mail" size={30} color="white" />
                <SharingOptionText>Email</SharingOptionText>
              </SharingOptionButton>
              
              <SharingOptionButton style={{ backgroundColor: '#333333' }} onPress={copyLink}>
                <Ionicons name="link" size={30} color="white" />
                <SharingOptionText>Copy Link</SharingOptionText>
              </SharingOptionButton>
              
              <SharingOptionButton style={{ backgroundColor: '#4caf50' }} onPress={() => {
                setShareModalVisible(false);
                setQrVisible(true);
              }}>
                <MaterialCommunityIcons name="qrcode" size={30} color="white" />
                <SharingOptionText>QR Code</SharingOptionText>
              </SharingOptionButton>
            </SharingGrid>
          </SharingOptionsContent>
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

const ShareOptionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 16px;
`;

const ShareOption = styled.TouchableOpacity`
  align-items: center;
`;

const ShareIconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${props => props.theme.colors.primary}20;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const ShareText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.text};
`;

const ProfileURLContainer = styled.View`
  background-color: ${props => props.theme.colors.background};
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
`;

const ProfileURL = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  text-align: center;
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
  padding: 24px;
  elevation: 5;
`;

const SharingOptionsContent = styled.View`
  width: 90%;
  background-color: ${props => props.theme.colors.card};
  border-radius: 16px;
  padding: 24px;
  elevation: 5;
  max-height: 70%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
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

const QRCodeContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const QRInstructions = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  margin-bottom: 20px;
`;

const ShareButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 8px;
`;

const ShareButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const SharingGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const SharingOptionButton = styled.TouchableOpacity`
  width: 23%;
  aspect-ratio: 1;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const SharingOptionText = styled.Text`
  color: white;
  font-size: 10px;
  margin-top: 5px;
  text-align: center;
`;

export default ProfileSocial;
