import React from "react";
import { Text, View } from "react-native";
import { useUserLevel } from "@/hooks/data/useUserLevel";
import StageProgressBar from "@/src/components/ui/StageProgressBar";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useTranslation } from "react-i18next";

const LEVEL_TRANSLATION_KEYS = {
  1: "xp.levelNames.level1",
  2: "xp.levelNames.level2",
  3: "xp.levelNames.level3",
  4: "xp.levelNames.level4",
  5: "xp.levelNames.level5",
  6: "xp.levelNames.level6",
  7: "xp.levelNames.level7",
  8: "xp.levelNames.level8",
  9: "xp.levelNames.level9",
  10: "xp.levelNames.level10",
} as const;

const getLevelTranslationKey = (level: number) =>
  LEVEL_TRANSLATION_KEYS[level as keyof typeof LEVEL_TRANSLATION_KEYS] ??
  LEVEL_TRANSLATION_KEYS[1];

interface XPHistorySummaryProps {
  totalXP: number;
  todayXP: number;
}

// ponytail: progression hero with typographic hierarchy and standardized secondary tokens per visual audit
export const XPHistorySummary: React.FC<XPHistorySummaryProps> = React.memo(
  ({ totalXP }) => {
    const { t } = useTranslation("common");
    const {
      currentLevel,
      nextLevel,
      progress,
      currentXP,
      requiredXP,
      isMaxLevel,
    } = useUserLevel();

    return (
      <View className="px-8 pt-1 pb-1">
        {/* 1. Section Header: secondary label token */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.semiBold,
            color: "#636366",
            fontSize: 11,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {t("progressionScreen.currentLevel")}
        </Text>

        {/* 2. Brand Rank Display: muted sage-green status identity */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: APP_FONT_FAMILIES.semiBold,
              color: "#5F7F58",
              fontSize: 18,
              lineHeight: 22,
            }}
          >
            ✦  {t(getLevelTranslationKey(currentLevel.level))}
          </Text>
        </View>

        {/* 3. Progress Sentence: strongest body text with typographic emphasis */}
        <Text style={{ fontSize: 15, marginBottom: 10 }}>
          {isMaxLevel ? (
            <Text
              style={{
                fontFamily: APP_FONT_FAMILIES.semiBold,
                color: "#1C1C1E",
              }}
            >
              {t("xp.maxLevelReached")}
            </Text>
          ) : (
            <>
              <Text
                style={{
                  fontFamily: APP_FONT_FAMILIES.bold,
                  color: "#1C1C1E",
                }}
              >
                {currentXP} / {requiredXP}
              </Text>
              <Text
                style={{
                  fontFamily: APP_FONT_FAMILIES.regular,
                  color: "#3A3A3C",
                }}
              >
                {` ${t("progressionScreen.insightsToNextLevel", { level: nextLevel ? t(getLevelTranslationKey(nextLevel.level)) : t("xp.nextLevel") })}`}
              </Text>
            </>
          )}
        </Text>

        {/* 4. Deliberate Level Progress Track */}
        <StageProgressBar
          progress={progress}
          height={9}
          fillColor="#5F7F58"
          trackColor="rgba(95, 127, 88, 0.22)"
          showGlow={false}
          className="mb-2.5"
        />

        {/* 5. Lifetime Insights: secondary supporting metadata */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.regular,
            color: "#636366",
            fontSize: 12,
          }}
        >
          {t("progressionScreen.lifetimeInsights", { count: totalXP })}
        </Text>
      </View>
    );
  }
);

XPHistorySummary.displayName = "XPHistorySummary";
