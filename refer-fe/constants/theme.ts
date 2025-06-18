import { DefaultTheme } from 'styled-components/native';

export interface ThemeInterface extends DefaultTheme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const lightTheme: ThemeInterface = {
  mode: 'light',
  colors: {
    primary: '#3366FF', // Primary brand color
    secondary: '#2EC4B6', // Secondary brand color
    background: '#F8F9FA', // Page background
    card: '#FFFFFF', // Card/box background
    text: '#212529', // Primary text color
    border: '#E9ECEF', // Border color
    notification: '#FF4D4F', // Badge/notification color
    success: '#52C41A', // Success color
    error: '#FF4D4F', // Error color
    warning: '#FAAD14', // Warning color
    info: '#1890FF', // Info color
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const darkTheme: ThemeInterface = {
  mode: 'dark',
  colors: {
    primary: '#5E84FF', // Slightly lighter primary for dark mode
    secondary: '#3DD9CF', // Slightly lighter secondary for dark mode
    background: '#121212', // Dark background
    card: '#1E1E1E', // Card/box background
    text: '#E9ECEF', // Light text color
    border: '#2C2C2C', // Dark border color
    notification: '#FF7875', // Slightly lighter badge/notification color
    success: '#73D13D', // Slightly lighter success color
    error: '#FF7875', // Slightly lighter error color
    warning: '#FFD666', // Slightly lighter warning color
    info: '#40A9FF', // Slightly lighter info color
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};
