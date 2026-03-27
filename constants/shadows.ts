/**
 * Shared Shadow System — Single Source of Truth
 *
 * Replaces the 4 duplicated shadow constants:
 *   - SHADOW_SUBTLE  (JournalCalendarScreen)
 *   - LOG_SHADOW     (EmotionLogger)
 *   - WIDGET_SHADOW  (CalorieWidget)
 *   - shadowCard     (DiscoveryScreen)
 *
 * Usage:
 *   import { CARD_SHADOW } from '@/constants/shadows';
 *   <View style={CARD_SHADOW} />
 */
import { Platform, ViewStyle } from 'react-native';

/** Standard card shadow — use on all elevated cards */
export const CARD_SHADOW: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  android: {
    elevation: 3,
  },
}) as ViewStyle;

/** Subtle shadow — use on small interactive elements (icon buttons, badges) */
export const SUBTLE_SHADOW: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  android: {
    elevation: 2,
  },
}) as ViewStyle;

/** Elevated shadow — use on floating elements (FABs, tooltips) */
export const ELEVATED_SHADOW: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  android: {
    elevation: 6,
  },
}) as ViewStyle;
