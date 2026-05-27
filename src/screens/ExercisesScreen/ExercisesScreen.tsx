import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Brain01Icon,
  CheckmarkBadge01Icon,
  SparklesIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons";

import {
  getCategoryMeta,
  getExerciseConfig,
  getExercisesGrouped,
} from "@/src/data/exerciseRegistry";
import {
  getCategoryIcon,
  getExerciseIcon,
} from "@/src/data/exerciseIconRegistry";
import { Mascot } from "@/src/components/ui/Mascot";
import type {
  ExerciseCategory,
  ExerciseConfig,
  ExerciseType,
} from "@/src/types/exerciseFlow";
import { useCBTHistory, type HistoryLogItem } from "./hooks/useCBTHistory";
import { SuggestedExerciseCard } from "@/src/components/insights/SuggestedExerciseCard";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { GOLD, INK_MUTED, SAGE } from "@/lib/tokens";

type TabKey = "discover" | "log";
type ExerciseGroup = ReturnType<typeof getExercisesGrouped>[number];

const TAB_KEYS = ["discover", "log"] as const;
const COMPLETE_HISTORY_STATUSES = new Set<string>([
  "completed",
  "summary",
  "checker_completed",
]);

const LEGACY_LOG_META = {
  catcher: {
    label: "Thought Catcher",
    icon: Brain01Icon,
    xp: 10,
  },
  reframing: {
    label: "Thought Reframing",
    icon: Brain01Icon,
    xp: 15,
  },
  gratitude: {
    label: "Gratitude Reframe",
    icon: SparklesIcon,
    xp: 10,
  },
} as const;

function isTabKey(value: unknown): value is TabKey {
  return typeof value === "string" && TAB_KEYS.includes(value as TabKey);
}

function buildExerciseFlowRoute(
  type: ExerciseType,
  options?: { entryId?: string; readOnly?: boolean },
): string {
  const params = [`type=${encodeURIComponent(type)}`];

  if (options?.entryId) {
    params.push(`entryId=${encodeURIComponent(options.entryId)}`);
  }

  if (options?.readOnly) {
    params.push("readOnly=true");
  }

  return `/tabs/screens/exercise-flow?${params.join("&")}`;
}

function buildExerciseRoute(
  type: ExerciseType,
  options?: { entryId?: string; readOnly?: boolean },
): string {
  return buildExerciseFlowRoute(type, options);
}

interface ExerciseCardProps {
  exercise: ExerciseConfig<any>;
  onPress: (exercise: ExerciseConfig<any>) => void;
}

const ExerciseCard = memo(function ExerciseCard({
  exercise,
  onPress,
}: ExerciseCardProps): ReactElement {
  const icon = getExerciseIcon(exercise.type);
  const handlePress = useCallback((): void => {
    onPress(exercise);
  }, [exercise, onPress]);

  return (
    <PressableScale
      onPress={handlePress}
      scale={0.98}
      hapticStyle="light"
      accessibilityRole="button"
      accessibilityLabel={`${exercise.title}: ${exercise.subtitle}. Duration: ${exercise.duration}.`}
      className="mb-4 rounded-[30px]"
    >
      <View className="happy-brand-preview-tile rounded-[30px] px-4 py-4">
        <View className="flex-row items-center gap-3">
          <View
            className="h-12 w-12 items-center justify-center rounded-[18px] border border-sage-100 bg-sage-50"
            accessible={false}
          >
            <HugeiconsIcon icon={icon} size={24} color={SAGE[600]} />
          </View>

          <View className="min-w-0 flex-1">
            <Text
              className="happy-font-body-bold text-[17px] leading-5 text-ink"
              numberOfLines={1}
            >
              {exercise.title}
            </Text>
            <Text
              className="happy-font-body-medium mt-1 text-[14px] leading-5 text-ink-soft"
              numberOfLines={2}
            >
              {exercise.subtitle}
            </Text>

            <View className="mt-3 flex-row items-center gap-2">
              <View className="flex-row items-center rounded-full bg-brand-surface-soft px-2.5 py-1">
                <Text size="xs">⏱️</Text>
                <Text className="happy-font-body-bold ml-1 text-ink-soft" size="xs">
                  {exercise.duration}
                </Text>
              </View>
              <View className="flex-row items-center rounded-full bg-gold/15 px-2.5 py-1">
                <Text size="xs">⚡</Text>
                <Text className="happy-font-body-bold ml-1 text-ink-soft" size="xs">
                  +{exercise.xp} XP
                </Text>
              </View>
            </View>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-full border-b-4 border-b-terracotta bg-terracotta">
            <Text className="happy-font-body-bold text-[18px] leading-5 text-brand-surface">
              ›
            </Text>
          </View>
        </View>
      </View>
    </PressableScale>
  );
});

interface DiscoverSectionProps {
  label: string;
  category: ExerciseCategory;
  exercises: ExerciseConfig<any>[];
  onPress: (exercise: ExerciseConfig<any>) => void;
}

const DiscoverSection = memo(function DiscoverSection({
  label,
  category,
  exercises,
  onPress,
}: DiscoverSectionProps): ReactElement {
  const categoryMeta = getCategoryMeta(category);
  const categoryIcon = getCategoryIcon(category);

  return (
    <View className="mb-7">
      <View className="mb-3 flex-row items-center px-1">
        <View className="mr-3 h-12 w-12 items-center justify-center rounded-[20px] border border-sage-100 bg-sage-50">
          <HugeiconsIcon icon={categoryIcon} size={22} color={SAGE[600]} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="happy-font-body-bold text-[20px] leading-6 text-ink">
            {label}
          </Text>
          <Text
            className="happy-font-body-medium mt-0.5 text-[14px] leading-5 text-ink-soft"
            numberOfLines={1}
          >
            {categoryMeta.description}
          </Text>
        </View>
        <View className="happy-brand-status-chip ml-3 rounded-full px-3 py-1">
          <Text className="happy-font-body-bold text-xs text-sage-600">
            {exercises.length}
          </Text>
        </View>
      </View>

      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.type}
          exercise={exercise}
          onPress={onPress}
        />
      ))}
    </View>
  );
});

interface StatusInfo {
  label: string;
  isComplete: boolean;
  badgeIconColor: string;
  badgeClassName: string;
  badgeTextClassName: string;
  cardBorderClassName: string;
  xpEarned: number;
}

function getHistoryXp(item: HistoryLogItem): number {
  if (item.type === "unified" && item.exerciseType) {
    return getExerciseConfig(item.exerciseType)?.xp ?? 0;
  }

  if (item.type === "catcher") return LEGACY_LOG_META.catcher.xp;
  if (item.type === "reframing") return LEGACY_LOG_META.reframing.xp;
  if (item.type === "gratitude") return LEGACY_LOG_META.gratitude.xp;
  return 0;
}

function formatStatus(item: HistoryLogItem): StatusInfo {
  if (
    item.status === "checker_completed" ||
    item.status === "completed" ||
    item.status === "summary"
  ) {
    return {
      label: "Completed",
      isComplete: true,
      badgeIconColor: SAGE[600],
      badgeClassName: "bg-sage-pill",
      badgeTextClassName: "text-sage-600",
      cardBorderClassName: "border-sage-200 border-b-sage-300",
      xpEarned: getHistoryXp(item),
    };
  }

  if (item.status === "catcher_completed") {
    return {
      label: "Ready to Reframe",
      isComplete: false,
      badgeIconColor: GOLD,
      badgeClassName: "bg-gold/15",
      badgeTextClassName: "text-ink-soft",
      cardBorderClassName: "border-sage-100 border-b-sage-200",
      xpEarned: 0,
    };
  }

  return {
    label: "Resume",
    isComplete: false,
    badgeIconColor: INK_MUTED,
    badgeClassName: "bg-sage-50",
    badgeTextClassName: "text-ink-muted",
    cardBorderClassName: "border-sage-100 border-b-sage-200",
    xpEarned: 0,
  };
}

function getLogPresentation(item: HistoryLogItem) {
  if (item.type === "unified" && item.exerciseType) {
    const config = getExerciseConfig(item.exerciseType);
    const categoryMeta = config ? getCategoryMeta(config.category) : null;

    return {
      heading: categoryMeta?.label ?? "Exercise",
      title: config?.title ?? item.title ?? "Exercise",
      icon: config ? getExerciseIcon(config.type) : Brain01Icon,
    };
  }

  if (item.type === "catcher") {
    return {
      heading: LEGACY_LOG_META.catcher.label,
      title: item.title?.trim() || "Untitled Session",
      icon: LEGACY_LOG_META.catcher.icon,
    };
  }

  if (item.type === "reframing") {
    return {
      heading: LEGACY_LOG_META.reframing.label,
      title: item.title?.trim() || "Untitled Session",
      icon: LEGACY_LOG_META.reframing.icon,
    };
  }

  return {
    heading: LEGACY_LOG_META.gratitude.label,
    title: item.title?.trim() || "Untitled Session",
    icon: LEGACY_LOG_META.gratitude.icon,
  };
}

interface LogCardProps {
  item: HistoryLogItem;
  onPress: (item: HistoryLogItem) => void;
}

const LogCard = memo(function LogCard({
  item,
  onPress,
}: LogCardProps): ReactElement {
  const {
    label,
    isComplete,
    badgeIconColor,
    badgeClassName,
    badgeTextClassName,
    cardBorderClassName,
    xpEarned,
  } = formatStatus(item);
  const presentation = getLogPresentation(item);
  const handlePress = useCallback((): void => {
    onPress(item);
  }, [item, onPress]);

  return (
    <PressableScale
      onPress={handlePress}
      scale={0.98}
      hapticStyle="light"
      className="mb-3 rounded-[26px]"
      accessibilityRole="button"
    >
      <View
        className={`rounded-[26px] border-2 border-b-4 bg-white p-4 ${cardBorderClassName}`}
      >
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-[18px] border border-sage-100 bg-sage-50">
            <HugeiconsIcon
              icon={presentation.icon}
              size={22}
              color={SAGE[600]}
            />
          </View>

          <View className="min-w-0 flex-1">
            <View className="mb-0.5 flex-row items-center justify-between">
              <Text className="happy-brand-eyebrow text-[10px]">
                {presentation.heading}
              </Text>
              <Text className="happy-font-body-medium text-xs text-ink-muted" size="xs">
                {format(new Date(item.date), "MMM d, h:mm a")}
              </Text>
            </View>

            <Text
              className="happy-font-body-bold mb-2 text-[16px] text-ink"
              numberOfLines={1}
            >
              {presentation.title}
            </Text>

            <View className="flex-row items-center gap-2">
              <View
                className={`flex-row items-center rounded-full px-2.5 py-1 ${badgeClassName}`}
              >
                <HugeiconsIcon
                  icon={isComplete ? CheckmarkBadge01Icon : Time02Icon}
                  size={12}
                  color={badgeIconColor}
                />
                <Text
                  className={`ml-1 text-[10px] font-extrabold uppercase tracking-wider ${badgeTextClassName}`}
                >
                  {label}
                </Text>
              </View>
              {isComplete && xpEarned > 0 ? (
                <View className="flex-row items-center rounded-full bg-gold/15 px-2 py-1">
                  <Text size="xs">⚡</Text>
                  <Text className="happy-font-body-bold ml-0.5 text-ink-soft" size="xs">
                    +{xpEarned} XP
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </PressableScale>
  );
});

function EmptyDiscoverState(): ReactElement {
  return (
    <View
      className="items-center justify-center px-8 py-16"
      accessibilityLiveRegion="polite"
    >
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-sage-50">
        <Text
          className="text-[40px]"
          accessibilityLabel="Exercise illustration"
          accessibilityRole="image"
        >
          🏋️
        </Text>
      </View>
      <Text className="happy-font-body-bold mb-2 text-center text-xl text-ink">
        No exercises yet
      </Text>
      <Text className="happy-font-body-medium text-center text-sm leading-relaxed text-ink-muted">
        Exercises will appear here as they become available.
      </Text>
    </View>
  );
}

function LoadingHistoryState(): ReactElement {
  return (
    <View className="items-center py-12">
      <Text className="happy-font-body-bold text-sm text-ink-muted">
        Loading history...
      </Text>
    </View>
  );
}

function EmptyExerciseLogState(): ReactElement {
  return (
    <View className="items-center justify-center px-8 py-16">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-sage-50">
        <Text className="text-[40px]">📚</Text>
      </View>
      <Text className="happy-font-body-bold mb-2 text-center text-xl text-ink">
        Your exercise journal
      </Text>
      <Text className="happy-font-body-medium text-center text-sm leading-relaxed text-ink-muted">
        Complete your first exercise to see it here.
      </Text>
    </View>
  );
}

interface ExerciseTabButtonProps {
  tab: TabKey;
  isActive: boolean;
  onPress: (tab: TabKey) => void;
}

const ExerciseTabButton = memo(function ExerciseTabButton({
  tab,
  isActive,
  onPress,
}: ExerciseTabButtonProps): ReactElement {
  const handlePress = useCallback((): void => {
    onPress(tab);
  }, [onPress, tab]);
  const label = tab === "discover" ? "Lessons" : "My Log";

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      className={`flex-1 items-center justify-center rounded-full py-3 ${
        isActive ? "bg-brand-surface" : ""
      }`}
    >
      <Text
        className={`happy-font-body-bold text-[15px] ${
          isActive ? "text-ink" : "text-ink-muted"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
});

export default function ExercisesScreen(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const params = useLocalSearchParams<{ tab?: string }>();
  const { data: history = [], isLoading: isLoadingHistory } = useCBTHistory();
  const exerciseGroups = useMemo(() => getExercisesGrouped(), []);

  useEffect(() => {
    if (isTabKey(params.tab)) {
      setActiveTab(params.tab);
    }
  }, [params.tab]);

  const completedCount = useMemo(
    () =>
      history.filter((item) => COMPLETE_HISTORY_STATUSES.has(item.status))
        .length,
    [history],
  );

  const handleExercisePress = useCallback((exercise: ExerciseConfig<any>) => {
    router.push(buildExerciseRoute(exercise.type) as never);
  }, []);

  const handleTabPress = useCallback((tab: TabKey): void => {
    setActiveTab(tab);
    router.setParams({ tab });
  }, []);

  const handleLogPress = useCallback((item: HistoryLogItem): void => {
    if (item.type === "unified" && item.exerciseType) {
      router.push(
        buildExerciseRoute(item.exerciseType, {
          entryId: item.id,
          readOnly: item.status === "completed",
        }) as never,
      );
      return;
    }

    if (item.type === "catcher") {
      router.push(`/tabs/screens/thought-checker?id=${item.id}` as never);
      return;
    }

    if (item.type === "reframing") {
      router.push(`/tabs/screens/thought-reframing?id=${item.id}` as never);
      return;
    }

    if (item.type === "gratitude") {
      router.push(`/tabs/screens/gratitude-reframe?id=${item.id}` as never);
    }
  }, []);
  return (
    <View className="flex-1 happy-brand-screen">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View className="px-5 pb-3 pt-3">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Mascot state="panda-love-hug-2" size={38} />
              <Text className="happy-font-heading-bold text-[40px] leading-[46px] text-ink">
                Exercises
              </Text>
            </View>
            {completedCount > 0 ? (
              <View className="flex-row items-center rounded-full bg-gold/15 px-3 py-1.5">
                <Text className="text-sm">🔥</Text>
                <Text className="happy-font-body-bold ml-1 text-xs text-ink-soft">
                  {completedCount} done
                </Text>
              </View>
            ) : null}
          </View>

          <View className="happy-brand-card flex-row rounded-full bg-sage-50 p-1">
            {TAB_KEYS.map((tab) => (
              <ExerciseTabButton
                key={tab}
                tab={tab}
                isActive={activeTab === tab}
                onPress={handleTabPress}
              />
            ))}
          </View>
        </View>

        <ScrollView
          className="flex-1"
          style={{ flex: 1 }}
          contentContainerClassName="px-5 pt-3 pb-[128px]"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "discover" ? (
            <>
              <SuggestedExerciseCard />
              {exerciseGroups.length === 0 ? (
                <EmptyDiscoverState />
              ) : (
                exerciseGroups.map((group) => (
                  <DiscoverSection
                    key={group.category}
                    label={group.label}
                    category={group.category}
                    exercises={group.exercises}
                    onPress={handleExercisePress}
                  />
                ))
              )}
            </>
          ) : isLoadingHistory ? (
            <LoadingHistoryState />
          ) : history.length === 0 ? (
            <EmptyExerciseLogState />
          ) : (
            history.map((item) => (
              <LogCard
                key={`${item.type}-${item.id}`}
                item={item}
                onPress={handleLogPress}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
