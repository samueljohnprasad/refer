import React from "react";
import { View, ViewProps } from "react-native";
import styled from "styled-components/native";
import { ThemeInterface } from "../../constants/theme";
import { getShadow, ShadowIntensity } from "../utils/styleUtils";

type CardVariant = "elevated" | "outlined" | "filled";

interface CardProps extends ViewProps {
    variant?: CardVariant;
    elevation?: ShadowIntensity;
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

const CardContainer = styled.View<{
    variant: CardVariant;
    elevation: ShadowIntensity;
    theme: ThemeInterface;
}>`
    background-color: ${({ theme, variant }) =>
        variant === "filled"
            ? theme.mode === "dark"
                ? "#2C2C2C"
                : "#F5F5F5"
            : theme.colors.card};
    border-radius: ${({ theme }) => theme.borderRadius.md}px;
    margin-vertical: ${({ theme }) => theme.spacing.sm}px;
    overflow: hidden;

    /* Apply shadow based on variant */
    ${({ theme, variant, elevation }) => {
        if (variant === "outlined") {
            return `
        border-width: 1px;
        border-color: ${theme.colors.border};
      `;
        } else if (variant === "elevated") {
            const shadow = getShadow(theme, elevation);
            return `
        shadow-opacity: ${shadow.shadowOpacity};
        shadow-radius: ${shadow.shadowRadius}px;
        shadow-color: ${shadow.shadowColor};
        shadow-offset: ${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px;
        elevation: ${shadow.elevation};
      `;
        }
        return "";
    }}
`;

const CardContent = styled.View<{ theme: ThemeInterface }>`
    padding: ${({ theme }) => theme.spacing.md}px;
`;

const CardHeader = styled.View<{ theme: ThemeInterface }>`
    padding: ${({ theme }) => theme.spacing.md}px;
    border-bottom-width: ${({ theme }) => (theme.mode === "dark" ? 1 : 0.5)}px;
    border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const CardFooter = styled.View<{ theme: ThemeInterface }>`
    padding: ${({ theme }) => theme.spacing.md}px;
    border-top-width: ${({ theme }) => (theme.mode === "dark" ? 1 : 0.5)}px;
    border-top-color: ${({ theme }) => theme.colors.border};
`;

export const Card: React.FC<CardProps> = ({
    variant = "elevated",
    elevation = "sm",
    children,
    header,
    footer,
    style,
    ...rest
}) => {
    return (
        <CardContainer
            variant={variant}
            elevation={elevation}
            style={style}
            {...rest}
        >
            {header && <CardHeader>{header}</CardHeader>}
            <CardContent>{children}</CardContent>
            {footer && <CardFooter>{footer}</CardFooter>}
        </CardContainer>
    );
};

export default Card;
