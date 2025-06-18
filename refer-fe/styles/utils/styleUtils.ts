import { Platform } from "react-native";
import { ThemeInterface } from "../../constants/theme";

/**
 * Shadow configurations for different elevations that work across platforms
 */
export type ShadowIntensity = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export const getShadow = (
    theme: ThemeInterface,
    intensity: ShadowIntensity = "md"
) => {
    const shadowValues = {
        none: {
            shadowColor: "transparent",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        xs: {
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: theme.mode === "dark" ? 0.3 : 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        sm: {
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: theme.mode === "dark" ? 0.4 : 0.1,
            shadowRadius: 3,
            elevation: 2,
        },
        md: {
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme.mode === "dark" ? 0.5 : 0.15,
            shadowRadius: 5,
            elevation: 3,
        },
        lg: {
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: theme.mode === "dark" ? 0.6 : 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        xl: {
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.mode === "dark" ? 0.7 : 0.25,
            shadowRadius: 12,
            elevation: 6,
        },
    };

    return shadowValues[intensity];
};

/**
 * Platform-specific styles that work with styled-components
 */
export const getPlatformStyles = <T extends Record<string, unknown>>(
    ios: T,
    android: T,
    web: T
): T => {
    if (Platform.OS === "ios") return ios;
    if (Platform.OS === "android") return android;
    return web;
};

/**
 * Create responsive spacing based on screen size
 * To be used with useWindowDimensions hook
 */
export const getResponsiveSpacing = (
    theme: ThemeInterface,
    screenWidth: number
): typeof theme.spacing => {
    // Base spacing for small screens
    const baseSpacing = { ...theme.spacing };

    // Medium screens (tablets)
    if (screenWidth >= 768) {
        return {
            xs: baseSpacing.xs * 1.25,
            sm: baseSpacing.sm * 1.25,
            md: baseSpacing.md * 1.25,
            lg: baseSpacing.lg * 1.25,
            xl: baseSpacing.xl * 1.25,
        };
    }

    // Large screens (desktop)
    if (screenWidth >= 1024) {
        return {
            xs: baseSpacing.xs * 1.5,
            sm: baseSpacing.sm * 1.5,
            md: baseSpacing.md * 1.5,
            lg: baseSpacing.lg * 1.5,
            xl: baseSpacing.xl * 1.5,
        };
    }

    return baseSpacing;
};

/**
 * Helper for applying opacity to any color
 */
export const withOpacity = (color: string, opacity: number): string => {
    // If already has rgba format
    if (color.startsWith("rgba")) {
        const parts = color.match(
            /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([.\d]+)\)/
        );
        if (parts) {
            return `rgba(${parts[1]}, ${parts[2]}, ${parts[3]}, ${opacity})`;
        }
    }

    // If has rgb format
    if (color.startsWith("rgb")) {
        const parts = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (parts) {
            return `rgba(${parts[1]}, ${parts[2]}, ${parts[3]}, ${opacity})`;
        }
    }

    // If hex
    if (color.startsWith("#")) {
        // Convert hex to rgb
        const hex = color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return color; // Fallback
};
