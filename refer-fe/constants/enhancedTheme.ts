// Enhanced Design System based on Figma design
// This provides improved colors, shadows, spacing, and typography

export interface EnhancedThemeInterface {
  mode: 'light' | 'dark';
  colors: {
    // Brand Colors
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    
    // Background Colors
    background: string;
    backgroundSecondary: string;
    card: string;
    
    // Text Colors
    text: string;
    textSecondary: string;
    textMuted: string;
    
    // UI Colors
    border: string;
    borderLight: string;
    notification: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    
    // Neutral Color Palette
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  
  spacing: {
    xs: number;    // 4px
    sm: number;    // 6px
    md: number;    // 8px
    lg: number;    // 12px
    xl: number;    // 16px
    '2xl': number; // 20px
    '3xl': number; // 24px
    '4xl': number; // 32px
    '5xl': number; // 40px
    '6xl': number; // 48px
  };
  
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
      // Backward compatibility
      regular: string;
      medium: string;
      bold: string;
    };
    fontSize: {
      xs: number;   // 11px
      sm: number;   // 13px
      md: number;   // 14px
      base: number; // 15px
      lg: number;   // 16px
      xl: number;   // 18px
      xxl: number;  // 20px
      '2xl': number; // 22px
      '3xl': number; // 28px
      '4xl': number; // 32px
    };
    fontWeight: {
      light: number;    // 300
      normal: number;   // 400
      medium: number;   // 500
      semibold: number; // 600
      bold: number;     // 700
      extrabold: number; // 800
    };
    lineHeight: {
      tight: number;   // 1.2
      normal: number;  // 1.4
      relaxed: number; // 1.6
    };
  };
  
  borderRadius: {
    xs: number;    // 2px
    sm: number;    // 4px
    md: number;    // 6px
    lg: number;    // 8px
    xl: number;    // 12px
    '2xl': number; // 16px
    full: number;  // 9999px
  };
  
  shadows: {
    xs: string;   // Very subtle
    sm: string;   // Light shadow
    md: string;   // Standard card shadow
    lg: string;   // Elevated shadow
    xl: string;   // High elevation
    '2xl': string; // Maximum elevation
    inner: string; // Inset shadow
  };
  
  breakpoints: {
    sm: number;   // 640px
    md: number;   // 768px
    lg: number;   // 1024px
    xl: number;   // 1280px
    '2xl': number; // 1536px
  };
}

export const enhancedLightTheme: EnhancedThemeInterface = {
  mode: 'light',
  colors: {
    // Brand Colors - Professional and modern
    primary: '#0066CC',      // Professional blue
    primaryDark: '#0052A3',  // Darker blue for hover states
    primaryLight: '#E6F3FF', // Light blue background
    secondary: '#10B981',    // Modern green for success
    accent: '#8B5CF6',       // Purple accent
    
    // Background Colors
    background: '#FAFBFC',       // Slightly warm white
    backgroundSecondary: '#F8FAFC', // Secondary background
    card: '#FFFFFF',             // Pure white for cards
    
    // Text Colors
    text: '#0F172A',        // Dark professional text
    textSecondary: '#64748B', // Balanced gray
    textMuted: '#94A3B8',    // Light gray for metadata
    
    // UI Colors
    border: '#E2E8F0',       // Soft border
    borderLight: '#F1F5F9',  // Very light border
    notification: '#EF4444',  // Modern red
    success: '#10B981',      // Consistent with secondary
    error: '#EF4444',        // Modern red
    warning: '#F59E0B',      // Vibrant amber
    info: '#0EA5E9',         // Bright blue
    
    // Neutral Palette - Slate colors for professional look
    neutral: {
      50: '#F8FAFC',   // Lightest background
      100: '#F1F5F9',  // Very light gray
      200: '#E2E8F0',  // Light borders
      300: '#CBD5E1',  // Medium light
      400: '#94A3B8',  // Medium gray
      500: '#64748B',  // Balanced text
      600: '#475569',  // Dark text
      700: '#334155',  // Very dark
      800: '#1E293B',  // Near black
      900: '#0F172A',  // Darkest
    },
  },
  
  spacing: {
    xs: 4,   // Tight spacing
    sm: 6,   // Small gaps
    md: 8,   // Medium spacing
    lg: 12,  // Standard spacing
    xl: 16,  // Large spacing
    '2xl': 20, // Section padding
    '3xl': 24, // Card padding
    '4xl': 32, // Section gaps
    '5xl': 40, // Large sections
    '6xl': 48, // Maximum spacing
  },
  
  typography: {
    fontFamily: {
      primary: 'Inter',
      secondary: 'System',  // Using system font since SF Pro Display requires manual installation
      mono: 'JetBrainsMono',
      // Backward compatibility
      regular: 'Inter',
      medium: 'Inter-Medium',
      bold: 'Inter-Bold',
    },
    fontSize: {
      xs: 11,   // Small metadata
      sm: 13,   // Secondary text
      md: 14,   // Standard body
      base: 15, // Comfortable reading
      lg: 16,   // Emphasized text
      xl: 18,   // Section headers
      xxl: 20,  // Large headers
      '2xl': 22, // Page titles
      '3xl': 28, // Large headers
      '4xl': 32, // Hero text
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  borderRadius: {
    xs: 2,     // Small elements
    sm: 4,     // Buttons, tags
    md: 6,     // Inputs
    lg: 8,     // Cards
    xl: 12,    // Large cards
    '2xl': 16, // Hero sections
    full: 9999, // Pills
  },
  
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
};

export const enhancedDarkTheme: EnhancedThemeInterface = {
  mode: 'dark',
  colors: {
    // Brand Colors - Adjusted for dark mode
    primary: '#3B82F6',      // Brighter blue for dark
    primaryDark: '#2563EB',  // Darker blue
    primaryLight: '#1E3A8A', // Dark blue background
    secondary: '#10B981',    // Green stays the same
    accent: '#A855F7',       // Brighter purple
    
    // Background Colors
    background: '#0F172A',       // Dark background
    backgroundSecondary: '#1E293B', // Secondary dark
    card: '#1E293B',             // Card background
    
    // Text Colors
    text: '#F8FAFC',        // Light text
    textSecondary: '#CBD5E1', // Light gray
    textMuted: '#64748B',    // Medium gray
    
    // UI Colors
    border: '#334155',       // Dark border
    borderLight: '#1E293B',  // Very dark border
    notification: '#EF4444',  // Red stays same
    success: '#10B981',      // Green stays same
    error: '#EF4444',        // Red stays same
    warning: '#F59E0B',      // Amber stays same
    info: '#0EA5E9',         // Blue stays same
    
    // Neutral Palette - Inverted for dark mode
    neutral: {
      50: '#0F172A',   // Darkest
      100: '#1E293B',  // Very dark
      200: '#334155',  // Dark borders
      300: '#475569',  // Medium dark
      400: '#64748B',  // Medium
      500: '#94A3B8',  // Light gray
      600: '#CBD5E1',  // Light
      700: '#E2E8F0',  // Very light
      800: '#F1F5F9',  // Near white
      900: '#F8FAFC',  // Lightest
    },
  },
  
  // Same spacing, typography, borderRadius, shadows, and breakpoints as light theme
  spacing: enhancedLightTheme.spacing,
  typography: enhancedLightTheme.typography,
  borderRadius: enhancedLightTheme.borderRadius,
  shadows: enhancedLightTheme.shadows,
  breakpoints: enhancedLightTheme.breakpoints,
};

// Export the enhanced themes
export { enhancedLightTheme as lightTheme, enhancedDarkTheme as darkTheme };
