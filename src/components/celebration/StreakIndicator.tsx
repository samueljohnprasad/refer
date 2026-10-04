import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export function StreakIndicator() {
  const { t } = useTranslation('home');

  return (
    <View className="flex-row items-center justify-center bg-orange-100/50 px-3 py-1 rounded-full mt-2 self-center">
      <Text className="text-orange-600 font-nunito-700 text-sm">
        🔥 {t('streak.streakCount', { count: 7 })} ↑
      </Text>
    </View>
  );
}
