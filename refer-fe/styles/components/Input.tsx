import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import styled from "styled-components/native";
import { ThemeInterface } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isFullWidth?: boolean;
}

// Container styling
const Container = styled.View<{ isFullWidth: boolean; theme: ThemeInterface }>`
    width: ${({ isFullWidth }) => (isFullWidth ? "100%" : "auto")};
    margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const InputContainer = styled.View<{
    isFocused: boolean;
    hasError: boolean;
    theme: ThemeInterface;
}>`
    flex-direction: row;
    align-items: center;
    border-width: 1px;
    border-color: ${({ isFocused, hasError, theme }) => {
        if (hasError) return theme.colors.error;
        return isFocused ? theme.colors.primary : theme.colors.border;
    }};
    border-radius: ${({ theme }) => theme.borderRadius.md}px;
    background-color: ${({ theme }) =>
        theme.mode === "dark" ? "#1E1E1E" : theme.colors.card};
    padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledInput = styled.TextInput<{ theme: ThemeInterface }>`
    flex: 1;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.typography.fontSize.md}px;
    padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const Label = styled.Text<{ hasError: boolean; theme: ThemeInterface }>`
    font-weight: 500;
    font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
    color: ${({ hasError, theme }) =>
        hasError ? theme.colors.error : theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const ErrorText = styled.Text<{ theme: ThemeInterface }>`
    font-size: ${({ theme }) => theme.typography.fontSize.sm - 2}px;
    color: ${({ theme }) => theme.colors.error};
    margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const HelperText = styled.Text<{ theme: ThemeInterface }>`
    font-size: ${({ theme }) => theme.typography.fontSize.sm - 2}px;
    color: ${({ theme }) => (theme.mode === "dark" ? "#BBBBBB" : "#666666")};
    margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const IconContainer = styled.View<{ isLeft: boolean; theme: ThemeInterface }>`
    margin-left: ${({ isLeft, theme }) => (isLeft ? 0 : theme.spacing.xs)}px;
    margin-right: ${({ isLeft, theme }) => (isLeft ? theme.spacing.xs : 0)}px;
`;

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    isFullWidth = true,
    style,
    ...rest
}) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const hasError: boolean = !!error;

    return (
        <Container isFullWidth={isFullWidth}>
            {label && <Label hasError={hasError}>{label}</Label>}

            <InputContainer
                isFocused={isFocused}
                hasError={hasError}
            >
                {leftIcon && (
                    <IconContainer isLeft={true}>{leftIcon}</IconContainer>
                )}

                <StyledInput
                    placeholderTextColor={
                        theme.mode === "dark" ? "#777777" : "#999999"
                    }
                    onFocus={(e) => {
                        setIsFocused(true);
                        if (rest.onFocus) {
                            rest.onFocus(e);
                        }
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (rest.onBlur) {
                            rest.onBlur(e);
                        }
                    }}
                    {...rest}
                />

                {rightIcon && (
                    <IconContainer isLeft={false}>{rightIcon}</IconContainer>
                )}
            </InputContainer>

            {error && <ErrorText>{error}</ErrorText>}
            {!error && helperText && <HelperText>{helperText}</HelperText>}
        </Container>
    );
};

export default Input;
