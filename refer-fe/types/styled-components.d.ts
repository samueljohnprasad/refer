import 'styled-components/native';
import { EnhancedThemeInterface } from '../constants/enhancedTheme';

// Extend the DefaultTheme in styled-components
declare module 'styled-components/native' {
  export interface DefaultTheme extends EnhancedThemeInterface {
    // DefaultTheme now uses the exact same structure as EnhancedThemeInterface
  }
}
