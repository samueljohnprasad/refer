import React from 'react';
import { Link, Stack } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Center } from '@/components/ui/center';
import { useTranslation } from 'react-i18next';

export default function NotFoundScreen() {
  const { t } = useTranslation('common');
  return (
    <>
      <Stack.Screen options={{ title: t('shell.notFoundTitle') }} />
      <Center className="flex-1">
        <Text className="text-secondary-200">{t('shell.notFoundMessage')}</Text>
        <Link href="/" style={{ marginTop: 10 }}>
          <Text className="text-primary-500">{t('shell.goHome')}</Text>
        </Link>
      </Center>
    </>
  );
}
