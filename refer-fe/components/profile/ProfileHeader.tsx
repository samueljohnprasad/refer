import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface ProfileHeaderProps {
  name: string;
  username: string;
  bio: string;
  company?: string;
  position?: string;
  location?: string;
  website?: string;
  profileImage: string;
  coverImage: string;
  isVerified: boolean;
  onEditProfile?: () => void;
  onEditPhotos?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  username,
  bio,
  company,
  position,
  location,
  website,
  profileImage,
  coverImage,
  isVerified,
  onEditProfile,
  onEditPhotos
}) => {
  const { theme } = useTheme();
  
  return (
    <Container>
      {/* Cover Photo */}
      <CoverImageContainer>
        <CoverImage source={{ uri: coverImage }} />
        <CoverOverlay />
        <EditButton onPress={onEditProfile} style={{ position: 'absolute', top: 16, right: 16 }}>
          <Ionicons name="pencil-outline" size={18} color="#fff" />
        </EditButton>
        
        {onEditPhotos && (
          <EditPhotoButton onPress={onEditPhotos}>
            <Ionicons name="camera" size={20} color="white" />
          </EditPhotoButton>
        )}
      </CoverImageContainer>
      
      {/* Profile Info Section */}
      <ProfileInfoContainer>
        <ProfileImageContainer>
          <ProfileImage source={{ uri: profileImage }} />
          {isVerified && (
            <VerifiedBadge>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            </VerifiedBadge>
          )}
        </ProfileImageContainer>
        
        <NameContainer>
          <NameRow>
            <NameText>{name}</NameText>
            {isVerified && (
              <VerifiedIcon>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              </VerifiedIcon>
            )}
          </NameRow>
          <UsernameText>@{username}</UsernameText>
          {company && position && (
            <CompanyRow>
              <Ionicons name="business-outline" size={16} color={theme.colors.text} style={{ marginRight: 4 }} />
              <CompanyText>{position} at {company}</CompanyText>
            </CompanyRow>
          )}
          {location && (
            <InfoRow>
              <Ionicons name="location-outline" size={16} color={theme.colors.text} style={{ marginRight: 4 }} />
              <InfoText>{location}</InfoText>
            </InfoRow>
          )}
          {website && (
            <InfoRow>
              <Ionicons name="link-outline" size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
              <WebsiteText>{website}</WebsiteText>
            </InfoRow>
          )}
          <BioText>{bio}</BioText>
        </NameContainer>
        
        {/* Action Buttons */}
        <ButtonsRow>
          <PrimaryButton onPress={onEditProfile}>
            <ButtonText>Edit Profile</ButtonText>
          </PrimaryButton>
          <SecondaryButton>
            <Ionicons name="share-social-outline" size={18} color={theme.colors.text} />
          </SecondaryButton>
          <SecondaryButton>
            <Ionicons name="qr-code-outline" size={18} color={theme.colors.text} />
          </SecondaryButton>
        </ButtonsRow>
      </ProfileInfoContainer>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const CoverImageContainer = styled.View`
  height: 140px;
  position: relative;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const CoverOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ProfileInfoContainer = styled.View`
  padding: 0 16px 16px;
  margin-top: -50px;
`;

const ProfileImageContainer = styled.View`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 12px;
`;

const ProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border-width: 4px;
  border-color: ${props => props.theme.colors.card};
`;

const VerifiedBadge = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${props => props.theme.colors.card};
  border-radius: 12px;
  padding: 2px;
`;

const NameContainer = styled.View`
  margin-top: 8px;
`;

const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NameText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-right: 4px;
`;

const UsernameText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 8px;
`;

const VerifiedIcon = styled.View`
  margin-left: 4px;
`;

const CompanyRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const CompanyText = styled.Text`
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const WebsiteText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
`;

const BioText = styled.Text`
  font-size: 15px;
  line-height: 20px;
  color: ${props => props.theme.colors.text};
  margin-top: 8px;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  margin-top: 16px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  border-radius: 20px;
  padding: 8px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const SecondaryButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  border-radius: 20px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const EditPhotoButton = styled.TouchableOpacity`
  position: absolute;
  bottom: -24px;
  left: 90px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: white;
`;

const EditButton = styled.TouchableOpacity`
  background-color: rgba(0, 0, 0, 0.6);
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export default ProfileHeader;
