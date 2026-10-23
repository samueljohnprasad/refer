import React from 'react';
import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Mascot } from '@/src/components/ui/Mascot';

export default function NotFoundScreen() {
  const { t } = useTranslation('common');
  return (
    <>
      <Stack.Screen options={{ title: t('shell.notFoundTitle') }} />
      <View className="flex-1 items-center justify-center px-8 bg-brand-surface">
        {/* ponytail: curious pondering panda for friendly 404 navigation */}
        <View className="happy-mascot-stage mb-5 h-28 w-28 items-center justify-center rounded-[36px]">
          <Mascot state="panda-pondering" size={88} />
        </View>
        <Text className="happy-font-heading-bold text-2xl text-ink text-center">
          {t('shell.notFoundTitle')}
        </Text>
        <Text className="happy-font-body-medium mt-2 mb-8 text-center text-base leading-relaxed text-ink-muted max-w-[280px]">
          {t('shell.notFoundMessage')}
        </Text>
        <Link href="/" className="bg-sage-pill px-6 py-3 rounded-full border border-sage-200">
          <Text className="happy-font-body-bold text-sage-800">{t('shell.goHome')}</Text>
        </Link>
      </View>
    </>
  );
}
