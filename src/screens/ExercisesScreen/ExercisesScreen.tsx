import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import { Pressable, ScrollView, View, StyleSheet } from "react-native";
import { GlassView } from "expo-glass-effect";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/src/components/ui/Text";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  Brain01Icon,
  CheckmarkBadge01Icon,
  SparklesIcon,
  Time02Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

import {
  getCategoryMeta,
  getExerciseConfig,
  getExercisesGrouped,
} from "@/src/data/exerciseRegistry";
import {
  getCategoryIcon,
  getCategoryTint,
  getExerciseIcon,
} from "@/src/data/exerciseIconRegistry";
import type {
  ExerciseCategory,
  ExerciseConfig,
  ExerciseType,
} from "@/src/types/exerciseFlow";
import { useCBTHistory, type HistoryLogItem } from "./hooks/useCBTHistory";
import { SuggestedExerciseCard } from "@/src/components/insights/SuggestedExerciseCard";
import { Card } from "@/src/components/ui/Card";
import { GOLD, INK_MUTED, SAGE } from "@/lib/tokens";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";

type TabKey = "discover" | "log";
const TAB_KEYS = ["discover", "log"] as const;

const EXERCISE_TAB_OPTIONS = ["Lessons", "My Log"] as const;
type ExerciseTabLabel = (typeof EXERCISE_TAB_OPTIONS)[number];

const EXERCISE_TAB_BY_LABEL: Record<ExerciseTabLabel, TabKey> = {
  Lessons: "discover",
  "My Log": "log",
};

const EXERCISE_TAB_LABEL_BY_KEY: Record<TabKey, ExerciseTabLabel> = {
  discover: "Lessons",
  log: "My Log",
};

function isExerciseTabLabel(selection: unknown): selection is ExerciseTabLabel {
  return (
    typeof selection === "string" &&
    EXERCISE_TAB_OPTIONS.includes(selection as ExerciseTabLabel)
  );
}
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
  featured?: boolean;
}

const ExerciseCard = memo(function ExerciseCard({
  exercise,
  onPress,
  featured = false,
}: ExerciseCardProps): ReactElement {
  const icon = getExerciseIcon(exercise.type);
  const handlePress = useCallback((): void => {
    onPress(exercise);
  }, [exercise, onPress]);

  return (
    <Card
      variant="tile"
      radius="xl"
      onPress={handlePress}
      haptic="light"
      className="mb-4"
      contentClassName={featured ? "p-5" : "p-4"}
      accessibilityLabel={`${exercise.title}: ${exercise.subtitle}. Duration: ${exercise.duration}.`}
    >
      {featured && (
        <Text variant="eyebrow" className="mt-1 mb-4">
          Start here
        </Text>
      )}
      <View className="flex-row items-center gap-3">
        <View
          className={`items-center justify-center rounded-icon-well border border-sage-100 bg-sage-50 ${featured ? "h-14 w-14" : "h-12 w-12"}`}
          accessible={false}
        >
          <HugeiconsIcon icon={icon} size={featured ? 28 : 24} color={SAGE[600]} />
        </View>

        <View className="min-w-0 flex-1">
          <Text variant="body-bold" numberOfLines={1}>
            {exercise.title}
          </Text>
          <Text variant="label" color="soft" className="mt-1" numberOfLines={featured ? 3 : 2}>
            {exercise.subtitle}
          </Text>

          <View className="mt-3 flex-row items-center gap-2">
            <View className="flex-row items-center justify-center rounded-full bg-brand-surface-soft px-3 py-1.5">
              <HugeiconsIcon icon={Time02Icon} size={14} color={INK_MUTED} />
              <Text variant="chip" className="ml-1.5">
                {exercise.duration}
              </Text>
            </View>
            <View className="flex-row items-center justify-center rounded-full bg-[#FFF5D6] px-3 py-1.5">
              <HugeiconsIcon icon={ZapIcon} size={14} color="#C89400" />
              <Text variant="chip" className="ml-1.5 text-ink-soft">
                +{exercise.xp} XP
              </Text>
            </View>
          </View>
        </View>

        <View className="h-9 w-9 items-center justify-center rounded-full border border-sage-200 bg-sage-50">
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={SAGE[500]} />
        </View>
      </View>
    </Card>
  );
});

interface DiscoverSectionProps {
  label: string;
  category: ExerciseCategory;
  exercises: ExerciseConfig<any>[];
  onPress: (exercise: ExerciseConfig<any>) => void;
  isFirst?: boolean;
}

const DiscoverSection = memo(function DiscoverSection({
  label,
  category,
  exercises,
  onPress,
  isFirst = false,
}: DiscoverSectionProps): ReactElement {
  const categoryMeta = getCategoryMeta(category);
  const categoryIcon = getCategoryIcon(category);
  const tint = getCategoryTint(category);

  return (
    <View className="mb-10">
      <View className={`mb-4 flex-row items-center px-1 ${isFirst ? "" : "pt-6"}`}>
        <View className={`mr-3 h-12 w-12 items-center justify-center rounded-2xl border border-sage-100 ${tint.iconBg}`}>
          <HugeiconsIcon icon={categoryIcon} size={22} color={tint.iconColor} />
        </View>
        <View className="min-w-0 flex-1">
          <Text variant="h2" className="text-[20px]">
            {label}
          </Text>
          <Text variant="label" color="soft" className="mt-0.5" numberOfLines={2}>
            {categoryMeta.description}
          </Text>
        </View>
        <View className="ml-3 rounded-full border border-sage-200 bg-sage-100 px-3 py-1">
          <Text variant="chip" className={tint.eyebrowColor}>
            {exercises.length}
          </Text>
        </View>
      </View>

      {exercises.map((exercise, i) => (
        <ExerciseCard
          key={exercise.type}
          exercise={exercise}
          onPress={onPress}
          featured={i === 0}
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
    <Card
      variant="answer"
      radius="xl"
      onPress={handlePress}
      haptic="light"
      className={`mb-3 ${cardBorderClassName}`}
    >
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-icon-well border border-sage-100 bg-sage-50">
          <HugeiconsIcon icon={presentation.icon} size={22} color={SAGE[600]} />
        </View>

        <View className="min-w-0 flex-1">
          <View className="mb-0.5 flex-row items-center justify-between">
            <Text variant="eyebrow">
              {presentation.heading}
            </Text>
            <Text variant="caption-muted">
              {format(new Date(item.date), "MMM d, h:mm a")}
            </Text>
          </View>

          <Text variant="body-bold" className="mb-2" numberOfLines={1}>
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
                variant="eyebrow"
                className={`ml-1 text-[10px] ${badgeTextClassName}`}
              >
                {label}
              </Text>
            </View>
            {isComplete && xpEarned > 0 ? (
              <View className="flex-row items-center justify-center rounded-full bg-[#FFF5D6] px-3 py-1.5">
                <HugeiconsIcon icon={ZapIcon} size={14} color="#C89400" />
                <Text variant="chip" className="ml-1.5 text-ink-soft">
                  +{xpEarned} XP
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
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
      <Text variant="h3" className="mb-2 text-center">
        No exercises yet
      </Text>
      <Text variant="body" className="text-center">
        Exercises will appear here as they become available.
      </Text>
    </View>
  );
}

function LoadingHistoryState(): ReactElement {
  return (
    <View className="items-center py-12">
      <Text variant="caption-muted">
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
      <Text variant="h3" className="mb-2 text-center">
        Your exercise journal
      </Text>
      <Text variant="body" className="text-center">
        Complete your first exercise to see it here.
      </Text>
    </View>
  );
}



function getContextualEyebrow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "MORNING PRACTICE";
  if (hour < 17) return "EXERCISES";
  return "EVENING SESSION";
}

export default function ExercisesScreen(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const params = useLocalSearchParams<{ tab?: string }>();
  const { data: history = [], isLoading: isLoadingHistory } = useCBTHistory();
  const exerciseGroups = useMemo(() => getExercisesGrouped(), []);
  const reducedMotion = useReducedMotion();
  const insets = useSafeAreaInsets();


  // Active tab pill — spring in on mount
  const tabScale = useSharedValue(reducedMotion ? 1 : 0.92);
  useEffect(() => {
    tabScale.value = withSpring(1, { damping: 18, stiffness: 260 });
  }, []);
  const tabPillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tabScale.value }],
  }));

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

  const handleFilterSelectionChange = useCallback(
    (selection: unknown): void => {
      if (isExerciseTabLabel(selection)) {
        const tab = EXERCISE_TAB_BY_LABEL[selection];
        setActiveTab(tab);
        router.setParams({ tab });
      }
    },
    [],
  );

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
    <>
      <Stack.Screen options={{
        headerTransparent: true,
        headerShown: true,
        headerBlurEffect: "systemUltraThinMaterialLight",
        headerLargeTitle: true,
        headerLargeTitleStyle: {
          fontFamily: "GeistBold",
        },
        headerTitle: "Exercises",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'transparent'
        },
        header: () => (
          <GlassView
            glassEffectStyle="regular"
          >
            <SafeAreaView edges={["top"]}>
              <View className="px-5 pb-3 pt-3">
                <View className="mb-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View>
                      <Text variant="eyebrow" className="mb-0.5">
                        {getContextualEyebrow()}
                      </Text>
                      <Text variant="display" className="text-[40px] leading-[46px]">
                        Exercises
                      </Text>
                    </View>
                  </View>
                  {completedCount > 0 ? (
                    <View className="flex-row items-center justify-center rounded-full bg-[#FFF5D6] px-3 py-1.5">
                      <HugeiconsIcon icon={ZapIcon} size={16} color="#C89400" />
                      <Text variant="chip" className="ml-1.5 text-ink-soft">
                        {completedCount} done
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Animated.View style={tabPillStyle} className="rounded-full border border-sage-100 bg-sage-50 p-1">
                  <Host style={{ width: "100%", height: 32 }}>
                    <Picker
                      modifiers={[pickerStyle("segmented"), tint(SAGE[600])]}
                      label="Exercises View"
                      selection={EXERCISE_TAB_LABEL_BY_KEY[activeTab]}
                      onSelectionChange={handleFilterSelectionChange}
                    >
                      {EXERCISE_TAB_OPTIONS.map((option) => (
                        <SwiftUIText key={option} modifiers={[tag(option)]}>
                          {option}
                        </SwiftUIText>
                      ))}
                    </Picker>
                  </Host>
                </Animated.View>
              </View>
            </SafeAreaView>
          </GlassView>
        )
      }} />

      <ScrollView
        className="flex-1 happy-brand-screen"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: insets.top + 120, paddingBottom: 128, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "discover" ? (
          <>
            <SuggestedExerciseCard />
            {exerciseGroups.length === 0 ? (
              <EmptyDiscoverState />
            ) : (
              exerciseGroups.map((group, i) => (
                <FadeInItem key={group.category} index={i}>
                  <DiscoverSection
                    label={group.label}
                    category={group.category}
                    exercises={group.exercises}
                    onPress={handleExercisePress}
                    isFirst={i === 0}
                  />
                </FadeInItem>
              ))
            )}
          </>
        ) : isLoadingHistory ? (
          <LoadingHistoryState />
        ) : history.length === 0 ? (
          <EmptyExerciseLogState />
        ) : (
          history.map((item, i) => (
            <FadeInItem key={`${item.type}-${item.id}`} index={i}>
              <LogCard
                item={item}
                onPress={handleLogPress}
              />
            </FadeInItem>
          ))
        )}
      </ScrollView>
    </>
  );
}
