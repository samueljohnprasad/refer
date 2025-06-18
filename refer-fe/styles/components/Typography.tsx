import React from "react";
import { TextProps } from "react-native";
import styled from "styled-components/native";
import { ThemeInterface } from "../../constants/theme";

type TypographyVariant =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "caption"
    | "label"
    | "button";
type FontWeight = "regular" | "medium" | "bold";
type TextAlign = "auto" | "left" | "right" | "center" | "justify";

interface TypographyProps extends TextProps {
    variant?: TypographyVariant;
    weight?: FontWeight;
    align?: TextAlign;
    color?: string;
    italic?: boolean;
    underline?: boolean;
    lineHeight?: number;
    children: React.ReactNode;
}

const StyledText = styled.Text<{
    variant: TypographyVariant;
    weight: FontWeight;
    align: TextAlign;
    customColor?: string;
    italic: boolean;
    underline: boolean;
    customLineHeight?: number;
    theme: ThemeInterface;
}>`
    color: ${({ customColor, theme }) => customColor || theme.colors.text};
    font-weight: ${({ weight }) => {
        switch (weight) {
            case "medium":
                return "500";
            case "bold":
                return "bold";
            default:
                return "normal";
        }
    }};
    text-align: ${({ align }) => align};
    font-style: ${({ italic }) => (italic ? "italic" : "normal")};
    text-decoration-line: ${({ underline }) =>
        underline ? "underline" : "none"};

    /* Font size based on variant */
    font-size: ${({ variant, theme }) => {
        const { fontSize } = theme.typography;

        switch (variant) {
            case "h1":
                return fontSize.xxl + 8;
            case "h2":
                return fontSize.xxl + 4;
            case "h3":
                return fontSize.xxl;
            case "h4":
                return fontSize.xl;
            case "h5":
                return fontSize.lg;
            case "h6":
                return fontSize.md + 2;
            case "button":
                return fontSize.md;
            case "caption":
                return fontSize.xs;
            case "label":
                return fontSize.sm;
            case "body":
            default:
                return fontSize.md;
        }
    }}px;

    /* Line height for proper spacing */
    line-height: ${({ customLineHeight, variant, theme }) => {
        if (customLineHeight) return customLineHeight;

        const { fontSize } = theme.typography;
        const lineHeightMultiplier = 1.4; // Default multiplier

        switch (variant) {
            case "h1":
                return (fontSize.xxl + 8) * 1.2;
            case "h2":
                return (fontSize.xxl + 4) * 1.25;
            case "h3":
                return fontSize.xxl * 1.3;
            case "h4":
                return fontSize.xl * 1.35;
            case "h5":
                return fontSize.lg * 1.4;
            case "h6":
                return (fontSize.md + 2) * 1.4;
            case "caption":
                return fontSize.xs * 1.5;
            default:
                return fontSize.md * lineHeightMultiplier;
        }
    }}px;
`;

export const Typography: React.FC<TypographyProps> = ({
    variant = "body",
    weight = "regular",
    align = "left",
    color,
    italic = false,
    underline = false,
    lineHeight,
    style,
    children,
    ...rest
}) => {
    return (
        <StyledText
            variant={variant}
            weight={weight}
            align={align}
            customColor={color}
            italic={italic}
            underline={underline}
            customLineHeight={lineHeight}
            style={style}
            {...rest}
        >
            {children}
        </StyledText>
    );
};

// Convenience components
export const Heading1 = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="h1"
        weight="bold"
        {...props}
    />
);

export const Heading2 = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="h2"
        weight="bold"
        {...props}
    />
);

export const Heading3 = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="h3"
        weight="bold"
        {...props}
    />
);

export const Heading4 = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="h4"
        weight="medium"
        {...props}
    />
);

export const Heading5 = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="h5"
        weight="medium"
        {...props}
    />
);

export const Heading6 = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="h6"
        weight="medium"
        {...props}
    />
);

export const Body = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="body"
        {...props}
    />
);

export const Caption = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="caption"
        {...props}
    />
);

export const Label = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="label"
        weight="medium"
        {...props}
    />
);

export const ButtonText = (props: Omit<TypographyProps, "variant">) => (
    <Typography
        variant="button"
        weight="medium"
        {...props}
    />
);

export default Typography;
