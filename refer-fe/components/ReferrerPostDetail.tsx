import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Modal,
    Alert,
    TouchableOpacity,
    Platform,
    ViewStyle,
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
import { ReferrerPost } from "./PostCard";

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
    
    
    
    // Animation values
    const fadeAnim = useSharedValue(0);
    const scaleAnim = useSharedValue(0.95);
    const loadingProgress = useSharedValue(0);
    const pulseAnim = useSharedValue(1);
    
    // Ripple animations for buttons
    const applyButtonScale = useSharedValue(1);
    const shareButtonScale = useSharedValue(1);
    const saveButtonScale = useSharedValue(1);
    
    // Header entrance animation
    const headerTranslateY = useSharedValue(-50);
    const userInfoOpacity = useSharedValue(0);

    // If there's no post to display
    if (!post) return null;

    // Calculate days left for expiration
    const daysLeft = post.expiresAt
        ? Math.ceil((post.expiresAt - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
        
    // Entry animation sequence when modal becomes visible
    useEffect(() => {
        if (visible) {
            // Reset animations for fresh start
            fadeAnim.value = 0;
            scaleAnim.value = 0.95;
            headerTranslateY.value = -50;
            userInfoOpacity.value = 0;
            
            // Staggered animation sequence
            fadeAnim.value = withTiming(1, { duration: 300 });
            scaleAnim.value = withTiming(1, { duration: 300 });
            
            // Slightly delayed header animation
            headerTranslateY.value = withDelay(
                100, 
                withSpring(0, { damping: 15 })
            );
            
            // User info fades in after header
            userInfoOpacity.value = withDelay(
                250, 
                withTiming(1, { duration: 400 })
            );
            
            // Start the pulse animation
            startPulseAnimation();
        }
    }, [visible]);
    
    // Continuous pulse animation for the status badge
    const startPulseAnimation = () => {
        pulseAnim.value = withSequence(
            withTiming(1.08, { duration: 800, easing: REasing.inOut(REasing.ease) }),
            withTiming(1, { duration: 800, easing: REasing.inOut(REasing.ease) })
        );
        
        // Loop the animation
        setTimeout(() => {
            if (visible) startPulseAnimation();
        }, 1600);
    };

    const handleApply = (): void => {
        // Visual feedback animation
        applyButtonScale.value = withSequence(
            withTiming(0.95, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
        
        setIsApplying(true);
        
        // Animate progress
        loadingProgress.value = 0;
        loadingProgress.value = withTiming(1, { 
            duration: 1000,
            easing: REasing.inOut(REasing.ease)
        });
        
        // Show a simple confirmation after animation completes
        setTimeout(() => {
            setIsApplying(false);
            Alert.alert(
                "Application Submitted",
                "Your application has been sent to the referrer. You will be notified when they respond.",
                [{ text: "OK", onPress: onClose }]
            );
            if (onApply) onApply();
        }, 1000);
    };

    // Animated styles
    const containerStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeAnim.value,
        };
    });
    
    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleAnim.value }]
        };
    });
    
    const headerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: headerTranslateY.value }]
        };
    });
    
    const userInfoStyle = useAnimatedStyle(() => {
        return {
            opacity: userInfoOpacity.value
        };
    });
    
    const statusBadgeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseAnim.value }]
        };
    });
    
    const applyButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: applyButtonScale.value }]
        };
    });
    
    const shareButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: shareButtonScale.value }]
        };
    });
    
    const saveButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: saveButtonScale.value }]
        };
    });
    
    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${interpolate(loadingProgress.value, [0, 1], [0, 100])}%`,
        };
    });
    
    // Button press handlers with animations
    const handleSharePress = () => {
        shareButtonScale.value = withSequence(
            withTiming(0.9, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
    };
    
    const handleSavePress = () => {
        saveButtonScale.value = withSequence(
            withTiming(0.9, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Reanimated.View style={[{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
            }, containerStyle]}>
                <Reanimated.View style={[{
                    width: '94%',
                    maxHeight: '90%', 
                    backgroundColor: theme.colors.card,
                    borderRadius: 16,
                    padding: 20,
                    ...(Platform.OS === 'ios' ? {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    } : {
                        elevation: 5,
                    })
                }, cardStyle]}>
                    <Reanimated.View style={[{
                        flexDirection: 'row' as const,
                        justifyContent: 'space-between' as const,
                        alignItems: 'center' as const,
                        marginBottom: 16,
                    }, headerStyle]}>
                        <HeaderTitle>Referrer Post</HeaderTitle>
                        <CloseButton onPress={onClose}>
                            <Ionicons
                                name="close"
                                size={24}
                                color={theme.colors.text}
                            />
                        </CloseButton>
                    </Reanimated.View>

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
                                <PostTime>Posted on {post.createdAt}</PostTime>
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
                                    <>
                                        <ApplyButtonText>
                                            Sending Application...
                                        </ApplyButtonText>
                                        <ProgressBarContainer>
                                            <Reanimated.View style={[{
                                                height: '100%', 
                                                backgroundColor: 'white',
                                                borderRadius: 2,
                                            }, progressStyle]} />
                                        </ProgressBarContainer>
                                    </>
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
                                        name="bookmark"
                                        size={16}
                                        color={theme.colors.primary}
                                    />
                                    <SecondaryButtonText>
                                        Save
                                    </SecondaryButtonText>
                                    </SecondaryButton>
                                </Reanimated.View>
                            </ButtonRow>
                        </ActionSection>
                    </ScrollView>
                </Reanimated.View>
            </Reanimated.View>
        </Modal>
    );
};

// We don't need these anymore since we're using inline styles with the Reanimated.View components

// Using styled components for non-animated elements
// ContentCard is now handled by Reanimated.View

// HeaderRow is now handled by Reanimated.View

const HeaderTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
    padding: 4px;
`;

// UserInfoSection is now handled by Reanimated.View

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
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 4px;
`;

const PostTime = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.secondary};
`;

const Divider = styled.View`
    height: 1px;
    background-color: ${(props) => props.theme.colors.border};
    margin-top: 16px;
    margin-bottom: 16px;
`;

const Section = styled.View`
    margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 8px;
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

interface StatusBadgeProps {
    isActive: boolean;
}

const StatusBadge = styled.View<StatusBadgeProps>`
    background-color: ${(props) =>
        props.isActive
            ? props.theme.colors.success
            : props.theme.colors.warning};
    padding: 6px 10px;
    border-radius: 16px;
    flex-direction: row;
    align-items: center;
`;

const StatusText = styled.Text`
    color: white;
    font-size: 14px;
    font-weight: 500;
    margin-left: 4px;
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
    font-weight: ${(props) => (props.isExpiringSoon ? "600" : "400")};
    margin-left: 8px;
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
            ? props.theme.colors.primary + "80"
            : props.theme.colors.primary};
    padding: ${props => props.isApplying ? '16px 16px 8px 16px' : '16px'};
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 16px;
    overflow: hidden;
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
