import { matchFont } from '@shopify/react-native-skia';
import { APP_FONT_FAMILIES } from '@/src/theme/typography';

const fontStyle = {
  fontFamily: APP_FONT_FAMILIES.bold,
  fontSize: 13,
  fontStyle: 'normal',
  fontWeight: 'bold',
} as const;

export const font = matchFont(fontStyle);
