import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image } from "react-native";
import DoubleTapWrapper from "./common/DoubleTapWrapper";
import { useToast } from "../context/ToastContext";
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';
import { ThemeInterface } from '../constants/theme';
import { useRouter } from 'expo-router';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { Post, JobSeekerPost, ReferrerPost } from '@/types/posts';
import ResponsiveText from "./common/ResponsiveText";

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onRefer?: (post: JobSeekerPost) => void;
}

// Revert back to TouchableOpacity since wrapping with DoubleTapWrapper below
const Card = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

interface TypeBadgeProps {
  isJobSeeker: boolean;
}

const TypeBadge = styled.View<TypeBadgeProps>`
  background-color: ${props => 
    props.isJobSeeker ? props.theme.colors.primary : props.theme.colors.secondary};
  padding: 4px 8px;
  border-radius: 20px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

const TypeText = styled.Text`
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  font-weight: bold;
`;

const ContentContainer = styled.View`
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UserContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const TimeText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  opacity: 0.6;
`;

const CompanyText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 4px;
`;

const RoleText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  margin-bottom: 4px;
`;

const DescriptionText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const InterestText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  font-style: italic;
`;

const ResumeText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const PrivacyText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 4px;
`;

interface StatusTextProps {
  isActive: boolean;
}

const StatusText = styled.Text<StatusTextProps>`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => 
    props.isActive 
      ? props.theme.colors.success 
      : props.theme.colors.warning};
  font-weight: bold;
`;

interface ExpiryTextProps {
  isExpiringSoon: boolean;
}

const ExpiryText = styled.Text<ExpiryTextProps>`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.isExpiringSoon ? props.theme.colors.error : props.theme.colors.text};
  opacity: ${props => props.isExpiringSoon ? 1 : 0.7};
  margin-top: 8px;
  font-weight: ${props => props.isExpiringSoon ? 'bold' : 'normal'};
`;

const SkillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 4px;
  margin-bottom: 4px;
`;

interface SkillBadgeProps {
  index: number;
}

const SkillBadge = styled.View<SkillBadgeProps>`
  background-color: ${props => {
    // Alternate colors for visual interest
    const colors = [
      props.theme.colors.primary + '20',  // Primary with 20% opacity
      props.theme.colors.secondary + '20', // Secondary with 20% opacity
      props.theme.colors.info + '20',      // Info with 20% opacity
    ];
    return colors[props.index % colors.length];
  }};
  padding: 6px 10px;
  border-radius: 16px;
  margin-right: 6px;
  margin-bottom: 6px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const SkillText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin-top: 8px;
  margin-bottom: 8px;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const FooterButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const ApplyButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  margin-left: 4px;
`;

const ReferButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.secondary};
  padding: 8px 16px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const ReferButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  margin-left: 6px;
`;

const IconContainer = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

// Helper to check if a post is a JobSeekerPost
const isJobSeekerPost = (post: Post): post is JobSeekerPost => {
    return 'interestStatement' in post;
};

// Helper to check if a post is a ReferrerPost
const isReferrerPost = (post: Post): post is ReferrerPost => {
    return 'company' in post;
};

export default function PostCard({ post, onPress, onRefer }: PostCardProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [referrerDetailVisible, setReferrerDetailVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const saveAnimation = useSharedValue(1);
  const { showToast } = useToast();
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return `${Math.floor(seconds)} seconds ago`;
  };

  const handleDetailViewPress = () => {
    router.push(`/post/${(post as any)._id}`);
  };
  
  const handleSavePress = () => {
    // Animate the save button
    saveAnimation.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withSpring(1, { damping: 15 })
    );
    
    // Toggle saved state
    setIsSaved((prev) => !prev);
    
    // Show toast notification with appropriate message
    if (!isSaved) {
      showToast(
        'Post saved to your favorites', 
        'success', 
        2500, 
        'bookmark'
      );
    } else {
      showToast(
        'Post removed from your favorites', 
        'info', 
        2500, 
        'bookmark-o'
      );
    }
  };

  const handleDetailPress = () => {
    setReferrerDetailVisible(true);
  };

  const handleRefer = () => {
    if (onRefer && isJobSeekerPost(post)) {
      onRefer(post);
    }
  };

  const renderJobSeekerContent = (post: JobSeekerPost) => {
    const expires = new Date(post.expiresAt || '').getTime();
    const isExpiringSoon = (expires - Date.now()) < (3 * 24 * 60 * 60 * 1000); // 3 days

    return (
      <ContentContainer>
         <UserContainer>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="user-circle" size={18} color={theme.colors.text} style={{ opacity: 0.8 }} />
            <UserText style={{ marginLeft: 8 }}>
              {post.privacy === 'anonymous' ? 'Anonymous User' : `${post.user?.firstName} ${post.user?.lastName}`}
            </UserText>
          </View>
        </UserContainer>

        <Divider />

        <RoleText>{post.title}</RoleText>
        <InterestText>"{post.interestStatement}"</InterestText>
      
        
        <SkillsContainer>
          {post?.skills?.slice(0, 4).map((skill, index) => (
            <SkillBadge key={index} index={index}>
              <SkillText>{skill}</SkillText>
            </SkillBadge>
          ))}
          {post?.skills?.length && post?.skills?.length > 4 && <SkillBadge index={4}><SkillText>+{post?.skills?.length - 4} more</SkillText></SkillBadge>}
        </SkillsContainer>
        
        <ExpiryText isExpiringSoon={isExpiringSoon}>
          Expires in {Math.ceil((expires - Date.now()) / (1000 * 60 * 60 * 24))} days
        </ExpiryText>
      </ContentContainer>
    );
  };

  const renderReferrerContent = (post: ReferrerPost) => {
     const expires = new Date(post.expiresAt).getTime();
    const isExpiringSoon = (expires - Date.now()) < (3 * 24 * 60 * 60 * 1000); // 3 days

    return (
      <ContentContainer>
                <ResponsiveText 
                  content={post.company || ''}
                  baseSize={18}
                  minSize={14}
                  maxSize={20}
                  bold
                  numberOfLines={1}
                  customStyle={{ marginBottom: 2 }}
                />
                <ResponsiveText 
                  content={post.role || ''}
                  baseSize={16}
                  minSize={13}
                  maxSize={18}
                  numberOfLines={1}
                  customStyle={{ color: theme.colors.text, marginBottom: 6 }}
                />
        <ResponsiveText 
                  content={post.description || ''}
                  baseSize={14}
                  minSize={12}
                  scaleRatio={0.1}
                  numberOfLines={2}
                  customStyle={{ color: theme.colors.secondary, marginTop: 4, opacity: 0.8 }}
                />
      </ContentContainer>
    );
  };

  const saveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveAnimation.value }]
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    // Add styles here
  }));

  return (
    <Reanimated.View style={[{ transform: [{ scale: saveAnimation }] }]}>
      <DoubleTapWrapper
        onSingleTap={onPress}
        onDoubleTap={handleSavePress}
        feedbackEnabled={!isSaved}
        style={{ width: '100%' }}
      >
        <Card onPress={onPress} activeOpacity={0.8}>
        <HeaderContainer>
          <TypeBadge isJobSeeker={isJobSeekerPost(post)}>
            <TypeText>
              {isJobSeekerPost(post) ? 'Job Seeker' : 'Referrer'}
            </TypeText>
          </TypeBadge>
          <TimeText>{getTimeAgo(post.createdAt || '')}</TimeText>
        </HeaderContainer>

        {isJobSeekerPost(post) && renderJobSeekerContent(post)}
        {isReferrerPost(post) && renderReferrerContent(post)}
        
        <Divider />
        
        <FooterContainer>
          <FooterButtonsContainer>
            <ApplyButton onPress={handleDetailPress}>
              <FontAwesome name="info-circle" size={16} color="white" />
              <ApplyButtonText>Details</ApplyButtonText>
            </ApplyButton>
            
            {isJobSeekerPost(post) && onRefer && (
              <ReferButton onPress={handleRefer}>
                <FontAwesome name="send" size={14} color="white" />
                <ReferButtonText>Refer</ReferButtonText>
              </ReferButton>
            )}
          </FooterButtonsContainer>
          
                    <TouchableOpacity onPress={handleSavePress}>
            <Reanimated.View style={saveButtonStyle}>
              <FontAwesome 
                name={isSaved ? "bookmark" : "bookmark-o"} 
                size={22} 
                color={theme.colors.text} 
              />
            </Reanimated.View>
          </TouchableOpacity>
        </FooterContainer>
      </Card>
      </DoubleTapWrapper>
    </Reanimated.View>
  );
}
