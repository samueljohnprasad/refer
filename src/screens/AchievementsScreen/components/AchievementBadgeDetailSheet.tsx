import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheet,
  Group,
  Host,
  RNHostView,
} from "@expo/ui/swift-ui";
import {
  type PresentationDetent,
  presentationDetents,
  presentationDragIndicator,
  presentationBackground,
} from "@expo/ui/swift-ui/modifiers";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BarChartIcon,
  CheckmarkCircle02Icon,
  Medal01Icon,
  StarsIcon,
} from "@hugeicons/core-free-icons";
import { Grayscale } from "react-native-color-matrix-image-filters";

import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import type {
  Achievement,
  AchievementConditionType,
} from "@/src/types/achievements";

export interface AchievementProgressItem {
  achievement: Achievement;
  currentProgress: number;
  isUnlocked: boolean;
  progressPercent: number;
  unlockedAt?: string;
}

interface AchievementBadgeDetailSheetProps {
  item: AchievementProgressItem | null;
  isPresented: boolean;
  onIsPresentedChange: (isPresented: boolean) => void;
}


const DEFAULT_DETENT: PresentationDetent = { fraction: 0.72 };
const SHEET_DETENTS: PresentationDetent[] = [DEFAULT_DETENT, "large"];

const getProgressText = (item: AchievementProgressItem): string => {
  const target = item.achievement.condition.target;
  const progress = item.isUnlocked
    ? target
    : Math.min(Math.max(item.currentProgress, 0), target);

  return `${progress}/${target}`;
};

const getUnlockDateText = (unlockedAt?: string): string | null => {
  if (!unlockedAt) return null;

  const date = new Date(unlockedAt);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const BadgeArtwork: React.FC<{ item: AchievementProgressItem }> = ({
  item,
}) => {
  const { achievement, isUnlocked } = item;
  const isNumberIcon = !Number.isNaN(Number(achievement.icon));

  return (
    <View className="h-24 w-24 items-center justify-center rounded-[28px] bg-sage-50">
      {achievement.imageAsset ? (
        <Grayscale amount={isUnlocked ? 0 : 1}>
          <Image
            source={achievement.imageAsset.unlocked}
            resizeMode="contain"
            style={[
              styles.badgeImage,
              { opacity: isUnlocked ? 1 : 0.45 },
            ]}
          />
        </Grayscale>
      ) : isNumberIcon ? (
        <Text
          className="happy-font-heading-bold text-[42px]"
          style={{ color: isUnlocked ? achievement.color : SEMANTIC_COLORS.text.tertiary }}
        >
          {achievement.icon}
        </Text>
      ) : (
        <Text style={[styles.emojiIcon, { opacity: isUnlocked ? 1 : 0.45 }]}>
          {achievement.icon}
        </Text>
      )}
    </View>
  );
};



export const AchievementBadgeDetailSheet: React.FC<
  AchievementBadgeDetailSheetProps
> = ({ item, isPresented, onIsPresentedChange }) => {
  const insets = useSafeAreaInsets();
  const [selectedDetent, setSelectedDetent] =
    useState<PresentationDetent>(DEFAULT_DETENT);

  useEffect(() => {
    if (isPresented) {
      setSelectedDetent(DEFAULT_DETENT);
    }
  }, [isPresented, item?.achievement.id]);

  if (!isPresented || !item) return null;

  const { achievement, isUnlocked, progressPercent } = item;
  const progress = Math.min(Math.max(progressPercent, 0), 100);
  const unlockDate = getUnlockDateText(item.unlockedAt);

  return (
    <Host colorScheme="light" style={StyleSheet.absoluteFill}>
      <BottomSheet
        isPresented={isPresented}
        onIsPresentedChange={onIsPresentedChange}
      >
        <Group
          modifiers={[
            presentationDetents(SHEET_DETENTS, {
              selection: selectedDetent,
              onSelectionChange: setSelectedDetent,
            }),
            presentationDragIndicator("visible"),
            presentationBackground("#FFFFFF"),
          ]}
        >
          <RNHostView>
            <View style={styles.sheet}>
              <View className="border-b border-sage-100 bg-white px-5 pb-3 pt-5">
                <View className="flex-row items-center justify-between">
                  <View className="min-w-0 flex-1">
                    <Text className="happy-brand-eyebrow">Badge Details</Text>
                    <Text
                      className="happy-font-heading-bold mt-1 text-[22px] leading-tight text-ink"
                      numberOfLines={1}
                    >
                      {achievement.name}
                    </Text>
                  </View>
                </View>
              </View>

              <ScrollView
                className="flex-1 bg-white"
                contentContainerStyle={[
                  styles.content,
                  { paddingBottom: Math.max(insets.bottom, 24) + 88 },
                ]}
                showsVerticalScrollIndicator={false}
              >
                <View className="items-center">
                  <BadgeArtwork item={item} />
                  <View
                    className="mt-3 rounded-full px-4 py-2"
                    style={{
                      backgroundColor: isUnlocked
                        ? SEMANTIC_COLORS.selection.surface
                        : "rgba(212,169,67,0.14)",
                    }}
                  >
                    <View className="flex-row items-center gap-1.5">
                      <HugeiconsIcon
                        icon={isUnlocked ? CheckmarkCircle02Icon : Medal01Icon}
                        size={16}
                        color={isUnlocked ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.warning.foreground}
                        strokeWidth={2}
                      />
                      <Text
                        className="happy-font-body-bold text-sm"
                        style={{ color: isUnlocked ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.warning.foreground }}
                      >
                        {isUnlocked ? "Unlocked" : "In progress"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-6 px-4">
                  <Text className="happy-font-body-medium text-[16px] leading-6 text-ink text-center">
                    {achievement.description}
                  </Text>

                  {isUnlocked ? (
                    unlockDate ? (
                      <View className="mt-2">
                        <Text className="happy-font-body-medium text-[13px] text-ink-muted text-center">
                          Unlocked on {unlockDate}
                        </Text>
                      </View>
                    ) : null
                  ) : (
                    <View className="mt-6">
                      <View className="mb-2 flex-row items-center justify-between">
                        <Text className="happy-font-body-bold text-sm text-ink">
                          Progress
                        </Text>
                        <Text className="happy-font-body-bold text-sm text-ink">
                          {getProgressText(item)}
                        </Text>
                      </View>
                      <View className="h-2.5 overflow-hidden rounded-full bg-sage-100">
                        <View
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: achievement.color,
                            width: `${progress}%`,
                          }}
                        />
                      </View>
                    </View>
                  )}
                </View>

                <View className="mt-8 flex-row justify-center gap-12 border-t border-sage-100/60 pt-6">
                  <View className="items-center">
                    <View className="mb-1.5 flex-row items-center gap-1.5">
                      <HugeiconsIcon icon={StarsIcon} size={14} color={SEMANTIC_COLORS.warning.foreground} strokeWidth={2.5} />
                      <Text className="happy-font-body-bold text-[11px] text-ink-muted uppercase tracking-wider">
                        Reward
                      </Text>
                    </View>
                    <Text className="happy-font-heading-bold text-[18px] text-ink">
                      +{achievement.xpBonus} XP
                    </Text>
                  </View>

                  <View className="items-center">
                    <View className="mb-1.5 flex-row items-center gap-1.5">
                      <HugeiconsIcon icon={BarChartIcon} size={14} color={achievement.color} strokeWidth={2.5} />
                      <Text className="happy-font-body-bold text-[11px] text-ink-muted uppercase tracking-wider">
                        Tier
                      </Text>
                    </View>
                    <Text className="happy-font-heading-bold text-[18px] text-ink">
                      Tier {achievement.tier}
                    </Text>
                  </View>
                </View>



                <View style={styles.bottomSpacer} />
              </ScrollView>
            </View>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
};

const styles = StyleSheet.create({
  badgeImage: {
    height: 92,
    width: 92,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  bottomSpacer: {
    height: 1,
  },
  emojiIcon: {
    fontSize: 44,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    height: "100%",
    width: "100%",
  },
});
