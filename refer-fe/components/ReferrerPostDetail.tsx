import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Alert,
    TouchableOpacity,
    Platform,
    ViewStyle,
    ActivityIndicator,
} from "react-native";
import Reanimated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSequence,
    withDelay,
    Easing as REasing,
    interpolate,
    withSpring,
} from 'react-native-reanimated';
import styled from "styled-components/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import Modal from "./common/Modal";
import { ReferrerPost } from "@/types/posts";

interface ReferrerPostDetailProps {
    visible: boolean;
    post: ReferrerPost | null;
    onClose: () => void;
    onApply?: () => void;
}

const ReferrerPostDetail: React.FC<ReferrerPostDetailProps> = ({
    visible,
    post,
    onClose,
    onApply,
}) => {
    const { theme } = useTheme();
    const [isApplying, setIsApplying] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    
    // Animation values
    const loadingProgress = useSharedValue(0);
    const pulseAnim = useSharedValue(1);
    
    const applyButtonScale = useSharedValue(1);
    const shareButtonScale = useSharedValue(1);
    const saveButtonScale = useSharedValue(1);
    const userInfoOpacity = useSharedValue(0);

    if (!post) return null;

    const daysLeft = post.expiresAt
        ? Math.ceil((new Date(post.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
        
    useEffect(() => {
        if (visible) {
            userInfoOpacity.value = 0;
            userInfoOpacity.value = withDelay(
                250, 
                withTiming(1, { duration: 400 })
            );
            startPulseAnimation();
        }
    }, [visible]);
    
    const startPulseAnimation = () => {
        pulseAnim.value = withSequence(
            withTiming(1.08, { duration: 800, easing: REasing.inOut(REasing.ease) }),
            withTiming(1, { duration: 800, easing: REasing.inOut(REasing.ease) })
        );
        
        setTimeout(() => {
            if (visible) startPulseAnimation();
        }, 1600);
    };

    const handleApply = (): void => {
        applyButtonScale.value = withSequence(
            withTiming(0.95, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
        
        setIsApplying(true);
        setIsSubmitted(false);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);

            // Show success for a moment before closing
            setTimeout(() => {
            Alert.alert(
                "Application Submitted",
                    "Your application has been sent. The referrer will be notified."
                );
                onClose();
                // Reset states after closing
                setTimeout(() => {
                    setIsApplying(false);
                    setIsSubmitted(false);
                }, 300)
            }, 1200);
        }, 2000);
    };

    // Animated styles
    const userInfoStyle = useAnimatedStyle(() => ({
            opacity: userInfoOpacity.value
    }));
    
    const statusBadgeStyle = useAnimatedStyle(() => ({
            transform: [{ scale: pulseAnim.value }]
    }));
    
    const applyButtonStyle = useAnimatedStyle(() => ({
            transform: [{ scale: applyButtonScale.value }]
    }));
    
    const shareButtonStyle = useAnimatedStyle(() => ({
            transform: [{ scale: shareButtonScale.value }]
    }));
    
    const saveButtonStyle = useAnimatedStyle(() => ({
            transform: [{ scale: saveButtonScale.value }]
    }));
    
    const progressStyle = useAnimatedStyle(() => ({
            width: `${interpolate(loadingProgress.value, [0, 1], [0, 100])}%`,
    }));
    
    const handleSharePress = () => {
        shareButtonScale.value = withSequence(
            withTiming(0.9, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
    };
    
    const handleSavePress = () => {
        saveButtonScale.value = withSequence(
            withTiming(0.9, { duration: 100 }),
            withSpring(1)
        );
        setIsSaved(!isSaved);
        // In a real app, you would also make an API call here to save the post
    };

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Referrer Post"
        >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Reanimated.View style={[{
                            flexDirection: 'row' as const,
                            alignItems: 'center' as const,
                            marginBottom: 16,
                        }, userInfoStyle]}>
                            <UserAvatar>
                                <FontAwesome
                                    name="user"
                                    size={26}
                                    color={theme.colors.primary}
                                />
                            </UserAvatar>
                            <UserInfoContent>
                                <UserName>{post.user}</UserName>
                        <PostTime>Posted on {new Date(post.createdAt).toLocaleDateString()}</PostTime>
                            </UserInfoContent>
                        </Reanimated.View>

                        <Divider />

                        <Section>
                            <SectionTitle>Company</SectionTitle>
                            <CompanyContainer>
                                <CompanyIconContainer>
                                    <FontAwesome
                                        name="building"
                                        size={20}
                                        color={theme.colors.primary}
                                    />
                                </CompanyIconContainer>
                                <CompanyName>{post.company}</CompanyName>
                            </CompanyContainer>
                        </Section>

                        <Section>
                            <SectionTitle>Role</SectionTitle>
                            <RoleContainer>
                                <RoleText>{post.role}</RoleText>
                                <Reanimated.View style={[{
                                    backgroundColor: post.status.toLowerCase() === "active" 
                                        ? theme.colors.success 
                                        : theme.colors.warning,
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    borderRadius: 16,
                                    flexDirection: 'row' as const,
                                    alignItems: 'center' as const,
                                }, statusBadgeStyle]}>
                                    <FontAwesome
                                        name={
                                            post.status.toLowerCase() ===
                                            "active"
                                                ? "check-circle"
                                                : "clock-o"
                                        }
                                        size={14}
                                        color="white"
                                    />
                                    <StatusText>{post.status}</StatusText>
                                </Reanimated.View>
                            </RoleContainer>
                        </Section>

                        <Section>
                            <SectionTitle>Description</SectionTitle>
                            <DescriptionText>
                                {post.description}
                            </DescriptionText>
                        </Section>

                        <Section>
                            <SectionTitle>What to Expect</SectionTitle>
                            <ExpectationCard>
                                <ExpectationItem>
                                    <ExpectationIcon>
                                        <FontAwesome
                                            name="check"
                                            size={14}
                                            color={theme.colors.success}
                                        />
                                    </ExpectationIcon>
                                    <ExpectationText>
                                        Direct referral to hiring team
                                    </ExpectationText>
                                </ExpectationItem>
                                <ExpectationItem>
                                    <ExpectationIcon>
                                        <FontAwesome
                                            name="check"
                                            size={14}
                                            color={theme.colors.success}
                                        />
                                    </ExpectationIcon>
                                    <ExpectationText>
                                        Resume will be reviewed within 48 hours
                                    </ExpectationText>
                                </ExpectationItem>
                                <ExpectationItem>
                                    <ExpectationIcon>
                                        <FontAwesome
                                            name="check"
                                            size={14}
                                            color={theme.colors.success}
                                        />
                                    </ExpectationIcon>
                                    <ExpectationText>
                                        Chat directly with the referrer
                                    </ExpectationText>
                                </ExpectationItem>
                            </ExpectationCard>
                        </Section>

                        <Section>
                            <SectionTitle>Expiration</SectionTitle>
                            <ExpiryInfoCard
                                isExpiringSoon={
                                    daysLeft !== null && daysLeft <= 7
                                }
                            >
                                <FontAwesome
                                    name="calendar"
                                    size={16}
                                    color={
                                        daysLeft && daysLeft <= 7
                                            ? theme.colors.error
                                            : theme.colors.primary
                                    }
                                />
                                <ExpiryText
                                    isExpiringSoon={
                                        daysLeft !== null && daysLeft <= 7
                                    }
                                >
                                    {daysLeft !== null
                                        ? `Expires in ${daysLeft} day${
                                              daysLeft === 1 ? "" : "s"
                                          }`
                                        : "No expiration set"}
                                </ExpiryText>
                            </ExpiryInfoCard>
                        </Section>

                        <ActionSection>
                            <Reanimated.View style={applyButtonStyle}>
                                <ApplyButton
                                    disabled={isApplying}
                                    isApplying={isApplying}
                                    onPress={handleApply}
                                >
                                {isApplying ? (
                            isSubmitted ? (
                                <>
                                    <FontAwesome name="check" size={16} color="white" style={{ marginRight: 8 }} />
                                    <ApplyButtonText>Submitted!</ApplyButtonText>
                                </>
                            ) : (
                                <>
                                    <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                                    <ApplyButtonText>Sending Application...</ApplyButtonText>
                                    </>
                            )
                                ) : (
                                    <>
                                        <FontAwesome 
                                            name="paper-plane" 
                                            size={16} 
                                            color="white" 
                                            style={{ marginRight: 8 }}
                                        />
                                        <ApplyButtonText>
                                            Apply For Referral
                                        </ApplyButtonText>
                                    </>
                                )}
                                </ApplyButton>
                            </Reanimated.View>
                            <ButtonRow>
                                <Reanimated.View style={shareButtonStyle}>
                                    <SecondaryButton onPress={handleSharePress}>
                                    <FontAwesome
                                        name="share"
                                        size={16}
                                        color={theme.colors.primary}
                                    />
                                    <SecondaryButtonText>
                                        Share
                                    </SecondaryButtonText>
                                    </SecondaryButton>
                                </Reanimated.View>
                                <Reanimated.View style={saveButtonStyle}>
                                    <SecondaryButton onPress={handleSavePress}>
                                    <FontAwesome
                                name={isSaved ? "bookmark" : "bookmark-o"}
                                        size={16}
                                        color={theme.colors.primary}
                                    />
                                    <SecondaryButtonText>
                                {isSaved ? "Saved" : "Save"}
                                    </SecondaryButtonText>
                                    </SecondaryButton>
                                </Reanimated.View>
                            </ButtonRow>
                        </ActionSection>
                    </ScrollView>
        </Modal>
    );
};

// Restoring all the original styled components
const Section = styled.View`
    margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 12px;
    opacity: 0.8;
`;

const Divider = styled.View`
    height: 1px;
    background-color: ${(props) => props.theme.colors.border};
    margin-top: 4px;
    margin-bottom: 20px;
`;

const UserAvatar = styled.View`
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: ${(props) => props.theme.colors.background};
    justify-content: center;
    align-items: center;
    margin-right: 12px;
`;

const UserInfoContent = styled.View`
    flex: 1;
`;

const UserName = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
`;

const PostTime = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.secondary};
    opacity: 0.7;
`;

const CompanyContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const CompanyIconContainer = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${(props) => props.theme.colors.background};
    justify-content: center;
    align-items: center;
    margin-right: 12px;
`;

const CompanyName = styled.Text`
    font-size: 18px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary};
`;

const RoleContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: ${(props) => props.theme.colors.background};
    padding: 12px 16px;
    border-radius: 8px;
`;

const RoleText = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    flex: 1;
`;

const StatusText = styled.Text`
    color: white;
    font-size: 14px;
    font-weight: bold;
    margin-left: 6px;
`;

const DescriptionText = styled.Text`
    font-size: 16px;
    color: ${(props) => props.theme.colors.text};
    line-height: 22px;
    background-color: ${(props) => props.theme.colors.background};
    padding: 16px;
    border-radius: 8px;
`;

const ExpectationCard = styled.View`
    background-color: ${(props) => props.theme.colors.background};
    padding: 16px;
    border-radius: 8px;
`;

const ExpectationItem = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;
`;

const ExpectationIcon = styled.View`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${(props) => props.theme.colors.success + "20"};
    justify-content: center;
    align-items: center;
    margin-right: 12px;
`;

const ExpectationText = styled.Text`
    font-size: 15px;
    color: ${(props) => props.theme.colors.text};
`;

interface ExpiryProps {
    isExpiringSoon: boolean;
}

const ExpiryInfoCard = styled.View<ExpiryProps>`
    background-color: ${(props) =>
        props.isExpiringSoon
            ? props.theme.colors.error + "15"
            : props.theme.colors.background};
    padding: 12px 16px;
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
`;

const ExpiryText = styled.Text<ExpiryProps>`
    color: ${(props) =>
        props.isExpiringSoon
            ? props.theme.colors.error
            : props.theme.colors.text};
    font-size: 15px;
    font-weight: 500;
    margin-left: 10px;
`;

const ActionSection = styled.View`
    margin-top: 20px;
    margin-bottom: 20px;
`;

interface ApplyButtonProps {
    isApplying: boolean;
}

const ApplyButton = styled.TouchableOpacity<ApplyButtonProps>`
    background-color: ${(props) =>
        props.isApplying
            ? props.theme.colors.primary
            : props.theme.colors.primary
    };
    padding: 16px;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    overflow: hidden;
    flex-direction: row;
`;

const ProgressBarContainer = styled.View`
    height: 4px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    margin-top: 8px;
`;

const ApplyButtonText = styled.Text`
    color: white;
    font-size: 16px;
    font-weight: bold;
`;

const ButtonRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const SecondaryButton = styled.TouchableOpacity`
    flex: 0.48;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 8px;
    background-color: ${(props) => props.theme.colors.background};
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.border};
`;

const SecondaryButtonText = styled.Text`
    color: ${(props) => props.theme.colors.primary};
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
`;

export default ReferrerPostDetail;
