import * as Haptics from 'expo-haptics';

export const hapticFeedback = () => {
  Haptics.selectionAsync();
};
