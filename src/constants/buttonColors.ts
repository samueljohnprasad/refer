/**
 * Button Color Palettes
 * 
 * Pre-designed color combinations for AnimatedButton with proper
 * shadow colors that create the Duolingo-style 3D effect.
 * 
 * Each palette includes:
 * - backgroundColor: Main button face color
 * - shadowColor: Darker shade for the 3D shadow layer (typically 20-25% darker)
 * - textColor: Optimal text color for contrast (optional, defaults to white)
 * 
 * Usage:
 * ```tsx
 * import { BUTTON_COLORS } from '@/src/constants/buttonColors';
 * 
 * <AnimatedButton
 *   title="Sign in with Google"
 *   onPress={handlePress}
 *   backgroundColor={BUTTON_COLORS.google.backgroundColor}
 *   shadowColor={BUTTON_COLORS.google.shadowColor}
 *   textColor={BUTTON_COLORS.google.textColor}
 * />
 * ```
 */

export interface ButtonColorPalette {
    backgroundColor: string;
    shadowColor: string;
    textColor?: string;
}

// ─── Social Sign-In Buttons ──────────────────────────────────────────────────

export const BUTTON_COLORS = {
    /** Apple Sign In - Black with subtle grey shadow */
    apple: {
        backgroundColor: '#000000',
        shadowColor: '#333333',
        textColor: '#FFFFFF',
    },

    /** Google Sign In - White with light grey shadow, dark text */
    google: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#E0E0E0',
        textColor: '#1A1A1A',
    },

    /** Facebook Sign In - Official Facebook blue */
    facebook: {
        backgroundColor: '#1877F2',
        shadowColor: '#1464C7',
        textColor: '#FFFFFF',
    },

    /** Twitter/X Sign In - Black (new X branding) */
    twitter: {
        backgroundColor: '#000000',
        shadowColor: '#2C2C2C',
        textColor: '#FFFFFF',
    },

    /** LinkedIn Sign In - Official LinkedIn blue */
    linkedin: {
        backgroundColor: '#0A66C2',
        shadowColor: '#084F94',
        textColor: '#FFFFFF',
    },

    /** GitHub Sign In - Dark grey/black */
    github: {
        backgroundColor: '#24292E',
        shadowColor: '#1B1F23',
        textColor: '#FFFFFF',
    },

    // ─── Phone & Email Sign-In ─────────────────────────────────────────────────

    /** Phone Sign In - iOS green */
    phone: {
        backgroundColor: '#34C759',
        shadowColor: '#2AA946',
        textColor: '#FFFFFF',
    },

    /** Email Sign In - Professional blue */
    email: {
        backgroundColor: '#007AFF',
        shadowColor: '#0062CC',
        textColor: '#FFFFFF',
    },

    // ─── Primary Action Colors ─────────────────────────────────────────────────

    /** Primary - Duolingo green (active/success) */
    primary: {
        backgroundColor: '#58CC02',
        shadowColor: '#45A802',
        textColor: '#FFFFFF',
    },

    /** Secondary - Professional blue */
    secondary: {
        backgroundColor: '#4299E1',
        shadowColor: '#3182CE',
        textColor: '#FFFFFF',
    },

    /** Tertiary - Soft purple */
    tertiary: {
        backgroundColor: '#9F7AEA',
        shadowColor: '#805AD5',
        textColor: '#FFFFFF',
    },

    // ─── Semantic Colors ───────────────────────────────────────────────────────

    /** Success - Green */
    success: {
        backgroundColor: '#48BB78',
        shadowColor: '#38A169',
        textColor: '#FFFFFF',
    },

    /** Warning - Orange/Amber */
    warning: {
        backgroundColor: '#F6AD55',
        shadowColor: '#ED8936',
        textColor: '#1A1A1A',
    },

    /** Danger/Error - Red */
    danger: {
        backgroundColor: '#F56565',
        shadowColor: '#E53E3E',
        textColor: '#FFFFFF',
    },

    /** Info - Light blue */
    info: {
        backgroundColor: '#4299E1',
        shadowColor: '#3182CE',
        textColor: '#FFFFFF',
    },

    // ─── Neutral Colors ────────────────────────────────────────────────────────

    /** Light - White/off-white with subtle shadow */
    light: {
        backgroundColor: '#F7FAFC',
        shadowColor: '#E2E8F0',
        textColor: '#2D3748',
    },

    /** Dark - Charcoal/dark grey */
    dark: {
        backgroundColor: '#2D3748',
        shadowColor: '#1A202C',
        textColor: '#FFFFFF',
    },

    /** Grey - Medium grey */
    grey: {
        backgroundColor: '#A0AEC0',
        shadowColor: '#718096',
        textColor: '#FFFFFF',
    },

    // ─── Vibrant/Playful Colors ────────────────────────────────────────────────

    /** Pink - Vibrant pink */
    pink: {
        backgroundColor: '#FF6B9D',
        shadowColor: '#E55A87',
        textColor: '#FFFFFF',
    },

    /** Purple - Rich purple */
    purple: {
        backgroundColor: '#9F7AEA',
        shadowColor: '#805AD5',
        textColor: '#FFFFFF',
    },

    /** Teal - Calming teal */
    teal: {
        backgroundColor: '#38B2AC',
        shadowColor: '#2C7A7B',
        textColor: '#FFFFFF',
    },

    /** Orange - Energetic orange */
    orange: {
        backgroundColor: '#FF6B35',
        shadowColor: '#E55529',
        textColor: '#FFFFFF',
    },

    /** Yellow/Gold - Bright yellow */
    gold: {
        backgroundColor: '#FFD700',
        shadowColor: '#E6C200',
        textColor: '#1A1A1A',
    },

    /** Indigo - Deep indigo */
    indigo: {
        backgroundColor: '#667EEA',
        shadowColor: '#5A67D8',
        textColor: '#FFFFFF',
    },

    /** Cyan - Bright cyan */
    cyan: {
        backgroundColor: '#00D9FF',
        shadowColor: '#00B8D4',
        textColor: '#1A1A1A',
    },

    /** Lime - Fresh lime green */
    lime: {
        backgroundColor: '#84CC16',
        shadowColor: '#65A30D',
        textColor: '#FFFFFF',
    },

    /** Rose - Soft rose */
    rose: {
        backgroundColor: '#FB7185',
        shadowColor: '#F43F5E',
        textColor: '#FFFFFF',
    },

    // ─── Duolingo-Inspired Colors ──────────────────────────────────────────────

    /** Duolingo Green - The iconic green */
    duolingoGreen: {
        backgroundColor: '#58CC02',
        shadowColor: '#45A802',
        textColor: '#FFFFFF',
    },

    /** Duolingo Gold - Achievement/completion gold */
    duolingoGold: {
        backgroundColor: '#FFC800',
        shadowColor: '#E5A800',
        textColor: '#1A1A1A',
    },

    /** Duolingo Blue - Cool blue accent */
    duolingoBlue: {
        backgroundColor: '#1CB0F6',
        shadowColor: '#0A8FD4',
        textColor: '#FFFFFF',
    },

    /** Duolingo Red - Error/streak loss */
    duolingoRed: {
        backgroundColor: '#FF4B4B',
        shadowColor: '#E53E3E',
        textColor: '#FFFFFF',
    },

    // ─── Gradient-Inspired (use backgroundColor for solid fallback) ────────────

    /** Sunset - Warm gradient feel */
    sunset: {
        backgroundColor: '#FF6B6B',
        shadowColor: '#E55555',
        textColor: '#FFFFFF',
    },

    /** Ocean - Cool gradient feel */
    ocean: {
        backgroundColor: '#4A90E2',
        shadowColor: '#357ABD',
        textColor: '#FFFFFF',
    },

    /** Forest - Natural green gradient */
    forest: {
        backgroundColor: '#2ECC71',
        shadowColor: '#27AE60',
        textColor: '#FFFFFF',
    },

    /** Lavender - Soft purple gradient */
    lavender: {
        backgroundColor: '#B794F4',
        shadowColor: '#9F7AEA',
        textColor: '#FFFFFF',
    },
} as const;

export type ButtonColorKey = keyof typeof BUTTON_COLORS;

/**
 * Helper to get button colors by key with type safety
 */
export function getButtonColors(key: ButtonColorKey): ButtonColorPalette {
    return BUTTON_COLORS[key];
}

/**
 * Helper to create custom button colors with auto-generated shadow
 * (darkens the background by 25% for the shadow)
 */
export function createButtonColors(
    backgroundColor: string,
    textColor: string = '#FFFFFF',
    shadowDarkenFactor: number = 0.25,
): ButtonColorPalette {
    // Simple darkening logic (you can import darkenHex from colorUtils if needed)
    const darken = (hex: string, factor: number): string => {
        const cleaned = hex.replace('#', '');
        const r = Math.max(0, Math.round(parseInt(cleaned.slice(0, 2), 16) * (1 - factor)));
        const g = Math.max(0, Math.round(parseInt(cleaned.slice(2, 4), 16) * (1 - factor)));
        const b = Math.max(0, Math.round(parseInt(cleaned.slice(4, 6), 16) * (1 - factor)));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    return {
        backgroundColor,
        shadowColor: darken(backgroundColor, shadowDarkenFactor),
        textColor,
    };
}
