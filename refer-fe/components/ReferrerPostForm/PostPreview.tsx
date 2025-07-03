import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';

// Types
interface PostPreviewProps {
  data: {
    company: string;
    role: string;
    description: string;
    teamSize: string;
    location: string;
    experienceLevel: string;
    skills: string[];
    expiryDays: number;
    salaryRange?: string;
    remote?: boolean;
  };
  onClose: () => void;
}

// Styled components
const ModalOverlay = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.text}20;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const PreviewContainer = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  width: 100%;
  max-height: 80%;
  overflow: hidden;
`;

const PreviewHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const PreviewTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

const PreviewContent = styled.ScrollView`
  padding: 16px;
`;

const CompanyHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const CompanyIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${props => props.theme.colors.primary}20;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const CompanyName = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const RoleText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const InfoText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-left: 8px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border}80;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  margin-top: 12px;
`;

const Description = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  line-height: 20px;
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const SkillTag = styled.View`
  background-color: ${props => props.theme.colors.primary}20;
  padding: 6px 12px;
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const SkillText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
`;

const FooterContainer = styled.View`
  padding: 16px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
`;

const ActionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.background};
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  margin-left: 4px;
  margin-right: 4px;
  flex: 1;
`;

const ActionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  margin-left: 6px;
`;

const Badge = styled.View`
  background-color: ${props => props.theme.colors.primary};
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text`
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  font-weight: bold;
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 12px 16px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: ${props => props.theme.typography.fontSize.md}px;
`;

export default function PostPreview({ data, onClose }: PostPreviewProps) {
  const { theme } = useTheme();
  const [sharing, setSharing] = useState(false);
  const today = new Date();
  const expiryDate = new Date(today);
  expiryDate.setDate(today.getDate() + data.expiryDays);

  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const firstLetter = data.company.charAt(0).toUpperCase();
  
  // Share post function
  const handleShare = async () => {
    setSharing(true);
    
    try {
      const message = ` 
🔥 Referral Opportunity 🔥

Company: ${data.company}
Role: ${data.role}
Location: ${data.location || 'Flexible'}
Experience: ${data.experienceLevel}
${data.salaryRange ? `Salary Range: ${data.salaryRange}` : ''}

${data.remote ? '✅ Remote work available' : ''}

Apply through ReferNet to get a direct referral!
      `;

      const result = await Share.share({
        message,
        title: `Referral Opportunity at ${data.company}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share post');
    } finally {
      setSharing(false);
    }
  };

  return (
    <ModalOverlay>
      <PreviewContainer style={{
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5
      }}>
        <PreviewHeader>
          <PreviewTitle>Post Preview</PreviewTitle>
          <CloseButton onPress={onClose}>
            <FontAwesome name="times" size={20} color={theme.colors.text} />
          </CloseButton>
        </PreviewHeader>
        
        <PreviewContent>
          <CompanyHeader>
            <CompanyIcon>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.primary }}>
                {firstLetter}
              </Text>
            </CompanyIcon>
            <View>
              <CompanyName>{data.company}</CompanyName>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RoleText>{data.role}</RoleText>
                {data.remote && (
                  <Badge>
                    <BadgeText>REMOTE</BadgeText>
                  </Badge>
                )}
              </View>
            </View>
          </CompanyHeader>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data.location && (
              <InfoRow>
                <FontAwesome name="map-marker" size={16} color={theme.colors.text} />
                <InfoText>{data.location}</InfoText>
              </InfoRow>
            )}
            
            {data.teamSize && (
              <InfoRow style={{ marginLeft: 16 }}>
                <FontAwesome name="users" size={14} color={theme.colors.text} />
                <InfoText>{data.teamSize}</InfoText>
              </InfoRow>
            )}
            
            <InfoRow style={{ marginLeft: 16 }}>
              <FontAwesome name="graduation-cap" size={14} color={theme.colors.text} />
              <InfoText>{data.experienceLevel}</InfoText>
            </InfoRow>
          </View>
          
          <Divider />
          
          <SectionTitle>About This Role</SectionTitle>
          <Description>{data.description}</Description>
          
          <SectionTitle>Skills</SectionTitle>
          <SkillsContainer>
            {data.skills.map((skill, index) => (
              <SkillTag key={index}>
                <SkillText>{skill}</SkillText>
              </SkillTag>
            ))}
          </SkillsContainer>
          
          <Divider />
          
          <View>
            {data.salaryRange && (
              <InfoRow>
                <FontAwesome name="money" size={14} color={theme.colors.success} />
                <InfoText style={{ color: theme.colors.success, fontWeight: 'bold' }}>
                  {data.salaryRange}
                </InfoText>
              </InfoRow>
            )}
            <InfoRow>
              <FontAwesome name="calendar" size={14} color={theme.colors.text} />
              <InfoText>Posted on {formatDate(today)}</InfoText>
            </InfoRow>
            <InfoRow>
              <FontAwesome name="clock-o" size={14} color={theme.colors.text} />
              <InfoText>Expires on {formatDate(expiryDate)} ({data.expiryDays} days)</InfoText>
            </InfoRow>
          </View>
        </PreviewContent>
        
        <FooterContainer>
          <ActionRow>
            <ActionButton onPress={handleShare}>
              <FontAwesome name="share-alt" size={16} color={theme.colors.primary} />
              <ActionText>{sharing ? 'Sharing...' : 'Share'}</ActionText>
            </ActionButton>
            
            <ActionButton>
              <FontAwesome name="bookmark-o" size={16} color={theme.colors.primary} />
              <ActionText>Save</ActionText>
            </ActionButton>
            
            <ActionButton>
              <FontAwesome name="pencil" size={16} color={theme.colors.primary} />
              <ActionText>Edit</ActionText>
            </ActionButton>
          </ActionRow>
          
          <Button onPress={onClose}>
            <ButtonText>Close Preview</ButtonText>
          </Button>
        </FooterContainer>
      </PreviewContainer>
    </ModalOverlay>
  );
}
