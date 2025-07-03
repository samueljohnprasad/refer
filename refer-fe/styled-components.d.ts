import 'styled-components/native';
import { ThemeInterface } from './constants/theme';

// Extend the DefaultTheme in styled-components
declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeInterface {
    // DefaultTheme now uses the exact same structure as ThemeInterface
    // No need to manually redefine properties - they're inherited from ThemeInterface
  }
}
