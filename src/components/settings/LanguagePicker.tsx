import React from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/src/lib/i18n';
import { SEMANTIC_COLORS } from '@/src/theme/colors';

export const LANGUAGE_METADATA: Record<
  SupportedLanguage,
  { nativeName: string }
> = {
  en: { nativeName: 'English' },
  fr: { nativeName: 'Français' },
  de: { nativeName: 'Deutsch' },
  es: { nativeName: 'Español' },
  ar: { nativeName: 'العربية' },
  pt: { nativeName: 'Português' },
  it: { nativeName: 'Italiano' },
  zh: { nativeName: '中文' },
};

export function formatLanguageLabel(localizedName: string, nativeName: string) {
  return localizedName === nativeName
    ? localizedName
    : `${localizedName} (${nativeName})`;
}

export interface LanguagePickerProps {
  currentLanguage: string;
  isCustomLanguage?: boolean;
  switchingLang?: string | null;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onReset: () => void;
}

export function LanguagePicker({
  currentLanguage,
  isCustomLanguage = false,
  switchingLang = null,
  onSelectLanguage,
  onReset,
}: LanguagePickerProps) {
  const { t } = useTranslation('settings');
  const activeColor = String(SEMANTIC_COLORS.brand.primary ?? '#5D7E57');

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 48, paddingTop: 4 }}
      >
        {SUPPORTED_LANGUAGES.map((langCode) => {
          const isSelected = isCustomLanguage && currentLanguage === langCode;
          const isSwitchingThis = switchingLang === langCode;
          const meta = LANGUAGE_METADATA[langCode];
          const localizedName = t(`language.languages.${langCode}`);

          return (
            <Pressable
              key={langCode}
              disabled={Boolean(switchingLang)}
              accessibilityRole="button"
              accessibilityLabel={formatLanguageLabel(localizedName, meta.nativeName)}
              onPress={() => {
                void Haptics.selectionAsync();
                onSelectLanguage(langCode);
              }}
              className={`flex-row items-center justify-between px-4 py-4 mb-2 rounded-2xl active:bg-black/[0.04] dark:active:bg-white/[0.06] ${
                isSelected
                  ? 'bg-brand-primary/[0.08] dark:bg-brand-primary/[0.15] border border-brand-primary/20'
                  : 'bg-black/[0.02] dark:bg-white/[0.03] border border-transparent'
              }`}
            >
              <View className="flex-col">
                <Text
                  className={`text-base font-nunito-700 ${
                    isSelected ? 'text-brand-primary' : 'text-ink'
                  }`}
                >
                  {localizedName}
                </Text>
                {localizedName !== meta.nativeName && (
                  <Text className="text-xs text-ink-muted">{meta.nativeName}</Text>
                )}
              </View>

              {isSwitchingThis ? (
                <ActivityIndicator size="small" color={activeColor} />
              ) : isSelected ? (
                <Feather name="check" size={20} color={activeColor} />
              ) : null}
            </Pressable>
          );
        })}

        {/* Use Device Language option */}
        <View className="h-px bg-black/[0.06] dark:bg-white/[0.08] my-3" />
        <Pressable
          disabled={Boolean(switchingLang)}
          accessibilityRole="button"
          accessibilityLabel={t('language.useDevice')}
          onPress={() => {
            void Haptics.selectionAsync();
            onReset();
          }}
          className={`flex-row items-center justify-between px-4 py-4 rounded-2xl active:bg-black/[0.04] dark:active:bg-white/[0.06] ${
            !isCustomLanguage
              ? 'bg-brand-primary/[0.08] dark:bg-brand-primary/[0.15] border border-brand-primary/20'
              : 'bg-black/[0.02] dark:bg-white/[0.03] border border-transparent'
          }`}
        >
          <View className="flex-col">
            <Text
              className={`text-base font-nunito-700 ${
                !isCustomLanguage ? 'text-brand-primary' : 'text-ink'
              }`}
            >
              {t('language.useDevice')}
            </Text>
            <Text className="text-xs text-ink-muted">
              {t('language.deviceDescription')}
            </Text>
          </View>
          {switchingLang === 'device' ? (
            <ActivityIndicator size="small" color={activeColor} />
          ) : !isCustomLanguage ? (
            <Feather name="check" size={20} color={activeColor} />
          ) : null}
        </Pressable>
      </ScrollView>
    </View>
  );
}
