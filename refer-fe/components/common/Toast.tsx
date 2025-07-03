import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from '../../context/ThemeContext';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  icon?: string;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 2000,
  onHide,
  icon
}) => {
  const { theme } = useTheme();
  const translateYAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();

      const timer = setTimeout(() => {
        hide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.back(1.5)),
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  const getIconName = () => {
    if (icon) return icon as any;
    
    switch (type) {
      case 'success':
        return 'check-circle' as const;
      case 'error':
        return 'times-circle' as const;
      case 'warning':
        return 'exclamation-circle' as const;
      case 'info':
      default:
        return 'info-circle' as const;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.primary;
    }
  };

  if (!visible && !opacityAnim) return null;

  return (
    <Container style={{ transform: [{ translateY: translateYAnim }], opacity: opacityAnim }}>
      <ToastContent backgroundColor={getBackgroundColor()}>
        <IconContainer>
          <FontAwesome name={getIconName()} size={18} color="white" />
        </IconContainer>
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
    </Container>
  );
};

const Container = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  top: ${Platform.OS === 'ios' ? 50 : 20}px;
  left: 0;
  right: 0;
  z-index: 1000;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
`);

const ToastContent = styled.View<{ backgroundColor: string }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${props => props.backgroundColor};
  max-width: 90%;
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 3px;
  ` : `
    elevation: 3;
  `}
`;

const IconContainer = styled.View`
  margin-right: 8px;
`;

const ToastMessage = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

export default Toast;
