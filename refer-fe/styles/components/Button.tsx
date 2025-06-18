import React from "react";
import { ActivityIndicator, TouchableOpacityProps, View } from "react-native";
import styled from "styled-components/native";
import { ThemeInterface } from "../../constants/theme";

// Define button variants and sizes
export type ButtonVariant =
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

// Props for our styled button
export interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isFullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

// Base button container with proper types
const ButtonContainer = styled.TouchableOpacity<{
    variant: ButtonVariant;
    size: ButtonSize;
    isFullWidth: boolean;
    disabled?: boolean;
    theme: ThemeInterface;
}>`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: ${({ theme }) => theme.borderRadius.md}px;
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    width: ${({ isFullWidth }) => (isFullWidth ? "100%" : "auto")};

    /* Size variations */
    padding-vertical: ${({ theme, size }) => {
        switch (size) {
            case "sm":
                return theme.spacing.xs;
            case "lg":
                return theme.spacing.md;
            default: // md
                return theme.spacing.sm;
        }
    }}px;

    padding-horizontal: ${({ theme, size }) => {
        switch (size) {
            case "sm":
                return theme.spacing.sm;
            case "lg":
                return theme.spacing.lg;
            default: // md
                return theme.spacing.md;
        }
    }}px;

    /* Variant styles */
    background-color: ${({ theme, variant }) => {
        switch (variant) {
            case "secondary":
                return theme.colors.secondary;
            case "tertiary":
                return theme.mode === "dark" ? "#2C2C2C" : "#EEE";
            case "outline":
            case "ghost":
                return "transparent";
            default: // primary
                return theme.colors.primary;
        }
    }};

    border-width: ${({ variant }) => (variant === "outline" ? 1 : 0)}px;
    border-color: ${({ theme, variant }) => {
        if (variant === "outline") {
            return theme.colors.primary;
        }
        return "transparent";
    }};
`;

// Text styling according to variant
const ButtonText = styled.Text<{
    variant: ButtonVariant;
    size: ButtonSize;
    theme: ThemeInterface;
}>`
    font-weight: bold;
    text-align: center;

    /* Size variations */
    font-size: ${({ theme, size }) => {
        switch (size) {
            case "sm":
                return theme.typography.fontSize.sm;
            case "lg":
                return theme.typography.fontSize.lg;
            default: // md
                return theme.typography.fontSize.md;
        }
    }}px;

    /* Variant-based text colors */
    color: ${({ theme, variant }) => {
        switch (variant) {
            case "outline":
            case "ghost":
                return theme.colors.primary;
            case "tertiary":
                return theme.colors.text;
            case "primary":
            case "secondary":
            default:
                return "#FFFFFF";
        }
    }};
`;

const IconContainer = styled.View<{ isLeft: boolean; hasText: boolean }>`
    margin-left: ${({ isLeft, hasText }) => (!isLeft && hasText ? 8 : 0)}px;
    margin-right: ${({ isLeft, hasText }) => (isLeft && hasText ? 8 : 0)}px;
`;

// Main Button component
export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    isFullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    ...rest
}) => {
    const hasText = typeof children === "string";

    return (
        <ButtonContainer
            variant={variant}
            size={size}
            isFullWidth={isFullWidth}
            disabled={disabled || isLoading}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || isLoading }}
            {...rest}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={
                        variant === "outline" || variant === "ghost"
                            ? "#3366FF"
                            : "#FFFFFF"
                    }
                />
            ) : (
                <>
                    {leftIcon && (
                        <IconContainer
                            isLeft={true}
                            hasText={hasText}
                        >
                            {leftIcon}
                        </IconContainer>
                    )}

                    {typeof children === "string" ? (
                        <ButtonText
                            variant={variant}
                            size={size}
                        >
                            {children}
                        </ButtonText>
                    ) : (
                        <View>{children}</View>
                    )}

                    {rightIcon && (
                        <IconContainer
                            isLeft={false}
                            hasText={hasText}
                        >
                            {rightIcon}
                        </IconContainer>
                    )}
                </>
            )}
        </ButtonContainer>
    );
};

export default Button;
