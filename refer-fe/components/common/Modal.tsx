import React, { useEffect } from 'react';
import { Modal as RNModal, Platform, TouchableOpacity } from 'react-native';
import Reanimated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    withDelay,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const ModalOverlay = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
`;

const ModalContainer = styled(Reanimated.View)`
    width: 90%;
    max-height: 90%;
    background-color: ${props => props.theme.colors.card};
    border-radius: 15px;
    padding: 20px;
    ${Platform.select({
        ios: `
            shadow-color: #000;
            shadow-offset: { width: 0, height: 4 };
            shadow-opacity: 0.3;
            shadow-radius: 4.65;
        `,
        android: `
            elevation: 8;
        `,
    })}
`;

const HeaderContainer = styled(Reanimated.View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Title = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
    padding: 5px;
`;

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ visible, onClose, title, children }: ModalProps) {
    const { theme } = useTheme();
    
    const fadeAnim = useSharedValue(0);
    const scaleAnim = useSharedValue(0.95);
    const headerTranslateY = useSharedValue(-50);

    useEffect(() => {
        if (visible) {
            fadeAnim.value = withTiming(1, { duration: 300 });
            scaleAnim.value = withTiming(1, { duration: 300 });
            headerTranslateY.value = withDelay(100, withSpring(0, { damping: 15 }));
        } else {
            fadeAnim.value = withTiming(0, { duration: 200 });
            scaleAnim.value = withTiming(0.95, { duration: 200 });
            headerTranslateY.value = withTiming(-50, { duration: 200 });
        }
    }, [visible]);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }));

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleAnim.value }],
    }));

    const headerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: headerTranslateY.value }],
    }));

    return (
        <RNModal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Reanimated.View style={[{ flex: 1 }, overlayStyle]}>
                 <ModalOverlay>
                    <ModalContainer style={containerStyle}>
                        <HeaderContainer style={headerStyle}>
                            <Title>{title}</Title>
                            <CloseButton onPress={onClose}>
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={theme.colors.text}
                                />
                            </CloseButton>
                        </HeaderContainer>
                        {children}
                    </ModalContainer>
                </ModalOverlay>
            </Reanimated.View>
        </RNModal>
    );
} 