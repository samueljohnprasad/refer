import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import ShortBottomModal from '@/src/components/ShortBottomModal';
import { getMicronutrientById } from '@/src/config/micronutrients';
import { MicronutrientEntry } from '@/src/network/calorieAi';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getNutrientBarColor = (percentage: number): string => {
  if (percentage >= 50) return 'bg-green-500';
  if (percentage >= 25) return 'bg-yellow-500';
  return 'bg-gray-400';
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface MicronutrientRowProps {
  nutrient: MicronutrientEntry;
  index: number;
}

interface MicronutrientSheetProps {
  title: string | undefined;
  micronutrients: MicronutrientEntry[];
}

// ─── Sub-component ───────────────────────────────────────────────────────────

const MicronutrientRow: React.FC<MicronutrientRowProps> = ({ nutrient, index }) => {
  const { t, i18n } = useTranslation("tracking");
  const config = getMicronutrientById(nutrient.name);

  // Guard: skip unknown or zero-value nutrients
  if (!config || nutrient.amount <= 0) return null;

  const percentage = Math.min(
    Math.round((nutrient.amount / config.dailyValue) * 100),
    100,
  );
  const barColor = getNutrientBarColor(percentage);

  return (
    <View key={`${nutrient.name}-${index}`} className="mb-4 pb-4 border-b border-gray-100">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-900 font-medium">
          {t(`nutrientItems.${config.id}.name`)}
        </Text>
        <Text className="text-gray-600">
          {new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }).format(nutrient.amount)} {config.unit}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className={`h-full ${barColor} rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </View>
        <Text className="text-xs text-gray-500 w-12 text-right">
          {new Intl.NumberFormat(i18n.language).format(percentage)}%
        </Text>
      </View>

      <Text className="text-xs text-gray-400 mt-1">
        {t("micronutrients.dailyValue")}: {new Intl.NumberFormat(i18n.language).format(config.dailyValue)} {config.unit}
      </Text>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const MicronutrientSheet = forwardRef<BottomSheetModal, MicronutrientSheetProps>(
  ({ title, micronutrients }, ref) => {
    const { t } = useTranslation("tracking");
    const hasData = micronutrients.length > 0;

    return (
      <ShortBottomModal
        ref={ref}
        snapPoints={['50%', '75%']}
        marginHorizontal={8}
        enableContentPanningGesture
      >
        <View className="px-5 pt-4 pb-2">
          <Text
            style={{
              fontSize: 22,
              fontFamily: APP_FONT_FAMILIES.semiBold,
              color: '#1f2937',
              marginBottom: 12,
            }}
          >
            {title ?? t('micronutrients.title')}
          </Text>
        </View>

        {hasData ? (
          <BottomSheetScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {micronutrients.map((nutrient, idx) => (
              <MicronutrientRow key={`${nutrient.name}-${idx}`} nutrient={nutrient} index={idx} />
            ))}
          </BottomSheetScrollView>
        ) : (
          <View className="py-8 items-center">
            <Text className="text-gray-400 text-center">{t('micronutrients.noData')}</Text>
          </View>
        )}
      </ShortBottomModal>
    );
  },
);

MicronutrientSheet.displayName = 'MicronutrientSheet';
