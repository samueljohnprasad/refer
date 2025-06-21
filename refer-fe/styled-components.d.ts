import 'styled-components/native';
import { ThemeInterface } from './constants/theme';

// Extend the DefaultTheme in styled-components
declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeInterface {
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
}
