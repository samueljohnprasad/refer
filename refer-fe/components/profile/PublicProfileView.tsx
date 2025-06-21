import React from 'react';
import { View, Text, Linking, TouchableOpacity, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { Profile } from '../../types/profile.types';

type PublicProfileViewProps = {
  profile: Profile;
};

const PublicProfileView: React.FC<PublicProfileViewProps> = ({ profile }: PublicProfileViewProps) => {
  // Helper function to open URLs
  const handleOpenLink = async (url: string): Promise<void> => {
    if (!url) return;
    // Add https if not present
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const canOpen = await Linking.canOpenURL(formattedUrl);
    if (canOpen) {
      await Linking.openURL(formattedUrl);
    }
  };

  // Share profile function
  const handleShareProfile = async (): Promise<void> => {
    try {
      await Share.share({
        message: `Check out ${profile.fullName || profile.username}'s profile on ReferNet`,
        url: `https://refernet.com/${profile.username}`, // This would be your actual URL format
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  return (
    <Container>
      <ProfileHeader>
        <ProfileAvatar>
          {/* If you have an avatar image, use it here instead */}
        </ProfileAvatar>
        
        <HeaderContent>
          <ProfileName>{profile.fullName || profile.username}</ProfileName>
          {profile.headline && <ProfileHeadline>{profile.headline}</ProfileHeadline>}
          
          {/* Only show location if privacy settings allow */}
          {profile.location && profile.privacySettings?.showLocation && (
            <ProfileLocation>
              <Feather name="map-pin" size={14} color="#666" />
              <LocationText>{profile.location}</LocationText>
            </ProfileLocation>
          )}
        </HeaderContent>
      </ProfileHeader>
      
      <ShareProfileButton onPress={handleShareProfile}>
        <Feather name="share-2" size={16} color="#007bff" />
        <ShareButtonText>Share Profile</ShareButtonText>
      </ShareProfileButton>
      
      {/* Contact Information Section */}
      {profile.privacySettings?.showEmail && profile.contactEmail && (
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <ContactItem>
            <Feather name="mail" size={16} color="#666" />
            <ContactText>{profile.contactEmail}</ContactText>
          </ContactItem>
        </Section>
      )}
      
      {/* About Section */}
      {profile.summary && (
        <Section>
          <SectionTitle>About</SectionTitle>
          <SectionContent>{profile.summary}</SectionContent>
        </Section>
      )}
      
      {/* Experience Section */}
      {profile.experience && (
        <Section>
          <SectionTitle>Experience</SectionTitle>
          <SectionContent>{profile.experience}</SectionContent>
        </Section>
      )}
      
      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <Section>
          <SectionTitle>Skills</SectionTitle>
          <SkillsContainer>
            {profile.skills.map((skill, index) => (
              <SkillChip key={index}>
                <SkillText>{skill}</SkillText>
              </SkillChip>
            ))}
          </SkillsContainer>
        </Section>
      )}
      
      {/* Social Links Section */}
      {profile.privacySettings?.showSocialLinks && 
       profile.socialLinks && 
       (profile.socialLinks.linkedin || 
        profile.socialLinks.twitter || 
        profile.socialLinks.github || 
        profile.socialLinks.website) && (
        <Section>
          <SectionTitle>Connect</SectionTitle>
          <SocialLinksContainer>
            {profile.socialLinks.linkedin && (
              <SocialButton onPress={() => handleOpenLink(profile.socialLinks?.linkedin || '')}>
                <Feather name="linkedin" size={20} color="#0077B5" />
              </SocialButton>
            )}
            {profile.socialLinks.twitter && (
              <SocialButton onPress={() => handleOpenLink(profile.socialLinks?.twitter || '')}>
                <Feather name="twitter" size={20} color="#1DA1F2" />
              </SocialButton>
            )}
            {profile.socialLinks.github && (
              <SocialButton onPress={() => handleOpenLink(profile.socialLinks?.github || '')}>
                <Feather name="github" size={20} color="#333" />
              </SocialButton>
            )}
            {profile.socialLinks.website && (
              <SocialButton onPress={() => handleOpenLink(profile.socialLinks?.website || '')}>
                <Feather name="globe" size={20} color="#4285F4" />
              </SocialButton>
            )}
          </SocialLinksContainer>
        </Section>
      )}
      
      <ProfileFooter>
        <UsernameText>@{profile.username}</UsernameText>
      </ProfileFooter>
    </Container>
  );
};

// Styled Components - using explicit values to avoid token errors
const Container = styled.View`
  padding: 20px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0px 2px 10px rgba(0,0,0,0.06);
  elevation: 2;
  margin: 16px;
`;

const ProfileHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileAvatar = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #e0e7ef;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const AvatarText = styled.Text`
  color: white;
  font-size: 32px;
  font-weight: bold;
`;

const HeaderContent = styled.View`
  flex: 1;
`;

const ProfileName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin-bottom: 2px;
`;

const ProfileHeadline = styled.Text`
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
`;

const ProfileLocation = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LocationText = styled.Text`
  font-size: 14px;
  color: #666666;
  margin-left: 4px;
`;

const Section = styled.View`
  margin-bottom: 24px;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: #eeeeee;
`;

const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
`;

const SectionContent = styled.Text`
  font-size: 15px;
  color: #444;
  line-height: 22px;
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const SkillChip = styled.View`
  background-color: #e6f0fa;
  border-radius: 14px;
  padding: 6px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const SkillText = styled.Text`
  color: #2176ae;
  font-size: 13px;
`;

const SocialLinksContainer = styled.View`
  flex-direction: row;
  margin-top: 8px;
`;

const SocialButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #e6f0fa;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  transition: background-color 0.2s;

  &:active {
    background-color: #cfe0fc;
  }
  &:hover {
    background-color: #cfe0fc;
  }
`;

const ContactItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const ContactText = styled.Text`
  font-size: 16px;
  color: #444444;
  margin-left: 8px;
`;

const ShareProfileButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
  padding: 8px 14px;
  background-color: #e6f0fa;
  border-radius: 20px;
  margin-bottom: 16px;
`;

const ShareButtonText = styled.Text`
  color: #2176ae;
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
`;

const ProfileFooter = styled.View`
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: #eeeeee;
`;

const UsernameText = styled.Text`
  font-size: 14px;
  color: #999999;
  font-style: italic;
`;

export default PublicProfileView;
