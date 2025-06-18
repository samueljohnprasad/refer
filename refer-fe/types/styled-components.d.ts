import 'styled-components/native';
import { ThemeInterface } from '../constants/theme';

// Extend the DefaultTheme in styled-components
declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeInterface {}
}
