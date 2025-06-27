// Define a standalone theme interface that doesn't extend DefaultTheme
export interface ThemeInterface {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundSecondary: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    notification: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    neutral: Record<string, string>;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
      // Backward compatibility properties - required to match styled-components DefaultTheme
      regular: string;
      medium: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      base: number;
      lg: number;
      xl: number;
      xxl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    full: number;
  };
  shadows: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
}

export const lightTheme: ThemeInterface = {
  mode: 'light',
  colors: {
    primary: '#0066CC', // Main brand color - professional blue
    primaryDark: '#0052A3', // Hover states and emphasis
    primaryLight: '#E6F3FF', // Background highlights
    secondary: '#10B981', // Success states, positive actions - modern green
    accent: '#8B5CF6', // Accent color - modern purple
    background: '#FAFBFC', // Primary background - slightly warmer white
    backgroundSecondary: '#F8FAFC', // Secondary background
    card: '#FFFFFF', // Card/box background - pure white for contrast
    text: '#0F172A', // High contrast text - professional dark
    textSecondary: '#64748B', // Secondary text color - balanced gray
    border: '#E2E8F0', // Border color - softer than pure gray
    notification: '#EF4444', // Badge/notification color - modern red
    success: '#10B981', // Success color - consistent with secondary
    error: '#EF4444', // Error color - modern red
    warning: '#F59E0B', // Warning color - vibrant amber
    info: '#0EA5E9', // Info color - bright blue
    neutral: {
      50: '#F8FAFC',  // Lightest background
      100: '#F1F5F9', // Very light gray
      200: '#E2E8F0', // Light gray borders
      300: '#CBD5E1', // Medium light gray
      400: '#94A3B8', // Medium gray
      500: '#64748B', // Balanced gray text
      600: '#475569', // Dark gray text
      700: '#334155', // Very dark gray
      800: '#1E293B', // Near black
      900: '#0F172A', // Darkest text
    },
  },
  spacing: {
    xs: 4, // Tight spacing
    sm: 8, // Small gaps
    md: 12, // Medium spacing
    lg: 16, // Standard spacing
    xl: 20, // Large spacing
    '2xl': 24, // Card padding
    '3xl': 32, // Section spacing
    '4xl': 40, // Large gaps
    '5xl': 48, // Very large spacing
    '6xl': 64, // Maximum spacing
  },
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', // System fonts
      secondary: 'Inter, sans-serif', // Secondary font
      mono: '"Courier New", Courier, monospace', // For code
      // Backward compatibility properties
      regular: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      medium: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      bold: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    fontSize: {
      xs: 12, // Small labels, captions
      sm: 14, // Body text, descriptions
      md: 15, // Medium text
      base: 16, // Default text size (keep for compatibility)
      lg: 18, // Job titles, important text
      xl: 20, // Section headers
      xxl: 22, // Extra large text
      '2xl': 24, // Page titles
      '3xl': 30, // Large headers
      '4xl': 36, // Hero text
    },
    fontWeight: {
      light: 300,
      normal: 400, // Default body text
      medium: 500, // Company names, labels
      semibold: 600, // Job titles, emphasis
      bold: 700, // Headers
      extrabold: 800, // Strong emphasis
    }
  },
  borderRadius: {
    sm: 4,
    md: 6, // For inputs
    lg: 8, // For cards
    xl: 12, // For larger components
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
    sm: 640, // Mobile landscape
    md: 768, // Tablets
    lg: 1024, // Desktops
    xl: 1280, // Large screens
    '2xl': 1536, // Extra large screens
  },
};

export const darkTheme: ThemeInterface = {
  mode: 'dark',
  colors: {
    primary: '#5E84FF', // Slightly lighter primary for dark mode
    primaryDark: '#3A64CC', // Darker primary for dark mode
    primaryLight: '#1A2B52', // Darker background highlights
    secondary: '#1AC889', // Slightly brighter secondary for dark mode
    accent: '#805AD5', // Slightly lighter accent for dark mode
    background: '#121212', // Dark background
    backgroundSecondary: '#1E1E1E', // Secondary background
    card: '#1E1E1E', // Card/box background
    text: '#E9ECEF', // Light text color
    textSecondary: '#A0AEC0', // Secondary text color for dark mode
    border: '#2C2C2C', // Dark border color
    notification: '#FF7875', // Slightly lighter badge/notification color
    success: '#73D13D', // Slightly lighter success color
    error: '#FF7875', // Slightly lighter error color
    warning: '#FFD666', // Slightly lighter warning color
    info: '#40A9FF', // Slightly lighter info color
    neutral: {
      100: '#1A1A1A', // Near black (reversed for dark mode)
      200: '#333333', // Very dark gray
      300: '#4D4D4D', // Dark gray
      400: '#666666', // Medium dark gray
      500: '#808080', // Medium gray
      600: '#999999', // Medium light gray
      700: '#B3B3B3', // Light gray
      800: '#CCCCCC', // Lighter gray
      900: '#E6E6E6', // Near white
    },
  },
  spacing: {
    xs: 4, // Tight spacing
    sm: 8, // Small gaps
    md: 12, // Medium spacing
    lg: 16, // Standard spacing
    xl: 20, // Large spacing
    '2xl': 24, // Card padding
    '3xl': 32, // Section spacing
    '4xl': 40, // Large gaps
    '5xl': 48, // Very large spacing
    '6xl': 64, // Maximum spacing
  },
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', // System fonts
      secondary: 'Inter, sans-serif', // Secondary font
      mono: '"Courier New", Courier, monospace', // For code
      // Backward compatibility properties
      regular: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      medium: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      bold: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    fontSize: {
      xs: 12, // Small labels, captions
      sm: 14, // Body text, descriptions
      md: 15, // Medium text
      base: 16, // Default text size (keep for compatibility)
      lg: 18, // Job titles, important text
      xl: 20, // Section headers
      xxl: 22, // Extra large text
      '2xl': 24, // Page titles
      '3xl': 30, // Large headers
      '4xl': 36, // Hero text
    },
    fontWeight: {
      light: 300,
      normal: 400, // Default body text
      medium: 500, // Company names, labels
      semibold: 600, // Job titles, emphasis
      bold: 700, // Headers
      extrabold: 800, // Strong emphasis
    }
  },
  borderRadius: {
    sm: 4,
    md: 6, // For inputs
    lg: 8, // For cards
    xl: 12, // For larger components
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.25)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  },
  breakpoints: {
    sm: 640, // Mobile landscape
    md: 768, // Tablets
    lg: 1024, // Desktops
    xl: 1280, // Large screens
    '2xl': 1536, // Extra large screens
  },
};
