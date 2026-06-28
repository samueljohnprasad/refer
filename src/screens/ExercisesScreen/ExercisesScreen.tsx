import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  Suspense,
  type ReactElement,
} from "react";
import {
  Pressable,
  ScrollView,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  FadeInDown,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Text } from "@/src/components/ui/Text";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { LegendList } from "@legendapp/list";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  BookmarkAdd01Icon,
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
import {
  useCBTHistory,
  useCompletedExercisesCount,
  type HistoryLogItem,
} from "./hooks/useCBTHistory";
import { SuggestedExerciseCard } from "@/src/components/insights/SuggestedExerciseCard";
import { RecommendedForYouCard } from "@/src/components/insights/RecommendedForYouCard";
import { CBTHistoryTimeline } from "./components/CBTHistoryTimeline";
import { TimelineSkeleton } from "../../../src/components/ui/Timeline/TimelineSkeleton";
import { ExerciseTimeline } from "./components/ExerciseTimeline";
import { Card } from "@/src/components/ui/Card";
import { GOLD, INK_MUTED, SAGE, OTTER_BLUE, MACAW_PURPLE } from "@/lib/tokens";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { useXPOptional } from "@/src/context/XPContext";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { useHeaderHeight } from "expo-router/react-navigation";
import { CircularRevealWrapper } from "@/src/components/CircularRevealWrapper";

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

// ─── Nutrie-style category badge colors ─────────────────────────────────────
interface NutrieBadgeTheme {
  bg: string;
  text: string;
  iconColor: string;
  sf: string;
  feather: string;
}

const CATEGORY_BADGE_THEME: Record<ExerciseCategory, NutrieBadgeTheme> = {
  cbt_core: {
    bg: "#E8FBF0",
    text: "#22C55E",
    iconColor: "#22C55E",
    sf: "brain.head.profile",
    feather: "cpu",
  },
  mindfulness: {
    bg: "#E4F6FC",
    text: "#00A3D9",
    iconColor: "#00A3D9",
    sf: "leaf",
    feather: "feather",
  },
  anxiety: {
    bg: "#FFEDE8",
    text: "#FF6B4A",
    iconColor: "#FF6B4A",
    sf: "cloud",
    feather: "cloud",
  },
  overthinking: {
    bg: "#F0EDFF",
    text: "#6B5CE7",
    iconColor: "#6B5CE7",
    sf: "sparkles",
    feather: "zap",
  },
};

function getCategoryBadgeTheme(category: string): NutrieBadgeTheme {
  return (
    CATEGORY_BADGE_THEME[category as ExerciseCategory] ??
    CATEGORY_BADGE_THEME.cbt_core
  );
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
  const badgeTheme = getCategoryBadgeTheme(exercise.category);
  const handlePress = useCallback((): void => {
    onPress(exercise);
  }, [exercise, onPress]);

  return (
    <CircularRevealWrapper 
      href={buildExerciseRoute(exercise.type)} 
      color={badgeTheme.bg}
      duration={800}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
        nutrieStyles.exerciseCard,
        pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
      ]}
      accessibilityLabel={`${exercise.title}: ${exercise.subtitle}. Duration: ${exercise.duration}.`}
      accessibilityRole="button"
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View
          style={[
            nutrieStyles.exerciseIconWell,
            { backgroundColor: badgeTheme.bg },
            featured && { width: 56, height: 56 },
          ]}
        >
          <HugeiconsIcon
            icon={icon}
            size={featured ? 28 : 24}
            color={badgeTheme.iconColor}
          />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={nutrieStyles.exerciseTitle} numberOfLines={1}>
            {exercise.title}
          </Text>
          <Text
            style={nutrieStyles.exerciseSubtitle}
            numberOfLines={featured ? 3 : 2}
          >
            {exercise.subtitle}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
            }}
          >
            <View style={nutrieStyles.inlinePill}>
              {Platform.OS === "ios" ? (
                <SymbolView
                  name={"clock" as any}
                  size={11}
                  tintColor="#8E8E93"
                  weight="medium"
                  style={{ width: 13, height: 13 }}
                />
              ) : (
                <Feather name="clock" size={11} color="#8E8E93" />
              )}
              <Text style={nutrieStyles.inlinePillText}>
                {exercise.duration}
              </Text>
            </View>
            <View
              style={[
                nutrieStyles.inlinePill,
                { backgroundColor: "#FFF5D6", borderColor: "#F5E6B8" },
              ]}
            >
              {Platform.OS === "ios" ? (
                <SymbolView
                  name={"bolt.fill" as any}
                  size={11}
                  tintColor="#C89400"
                  weight="medium"
                  style={{ width: 13, height: 13 }}
                />
              ) : (
                <Feather name="zap" size={11} color="#C89400" />
              )}
              <Text style={[nutrieStyles.inlinePillText, { color: "#A67C00" }]}>
                +{exercise.xp} XP
              </Text>
            </View>
          </View>
        </View>

        <View style={nutrieStyles.arrowWell}>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="#C4C4CC" />
        </View>
      </View>
    </Pressable>
    </CircularRevealWrapper>
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
  const badgeTheme = getCategoryBadgeTheme(category);

  return (
    <View style={{ marginBottom: 32 }}>
      <View
        style={[nutrieStyles.sectionHeader, !isFirst && { paddingTop: 16 }]}
      >
        <View
          style={[
            nutrieStyles.categoryBadge,
            { backgroundColor: badgeTheme.bg },
          ]}
        >
          {Platform.OS === "ios" ? (
            <SymbolView
              name={badgeTheme.sf as any}
              size={12}
              tintColor={badgeTheme.text}
              weight="semibold"
              style={{ width: 14, height: 14 }}
            />
          ) : (
            <Feather
              name={badgeTheme.feather as any}
              size={12}
              color={badgeTheme.text}
            />
          )}
          <Text
            style={[nutrieStyles.categoryBadgeText, { color: badgeTheme.text }]}
          >
            {label}
          </Text>
        </View>
        <View
          style={[nutrieStyles.countBadge, { backgroundColor: badgeTheme.bg }]}
        >
          <Text
            style={[nutrieStyles.countBadgeText, { color: badgeTheme.text }]}
          >
            {exercises.length}
          </Text>
        </View>
      </View>

      <Text style={nutrieStyles.sectionDescription}>
        {categoryMeta.description}
      </Text>

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
  const { label, isComplete, xpEarned } = formatStatus(item);
  const presentation = getLogPresentation(item);
  const handlePress = useCallback((): void => {
    onPress(item);
  }, [item, onPress]);

  const statusColor = isComplete ? "#22C55E" : "#8E8E93";
  const statusBg = isComplete ? "#E8FBF0" : "#F4F4F5";

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        nutrieStyles.logCard,
        pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
      ]}
      accessibilityRole="button"
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View
          style={[
            nutrieStyles.logIconWell,
            { backgroundColor: isComplete ? "#E8FBF0" : "#F4F4F5" },
          ]}
        >
          <HugeiconsIcon
            icon={presentation.icon}
            size={22}
            color={isComplete ? "#22C55E" : "#8E8E93"}
          />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Text style={nutrieStyles.logHeading}>{presentation.heading}</Text>
            <Text style={nutrieStyles.logDate}>
              {format(new Date(item.date), "MMM d, h:mm a")}
            </Text>
          </View>

          <Text style={nutrieStyles.logTitle} numberOfLines={1}>
            {presentation.title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
            }}
          >
            <View
              style={[
                nutrieStyles.inlinePill,
                {
                  backgroundColor: statusBg,
                  borderColor: isComplete ? "#C5ECD3" : "#E0E0E2",
                },
              ]}
            >
              {Platform.OS === "ios" ? (
                <SymbolView
                  name={(isComplete ? "checkmark.circle.fill" : "clock") as any}
                  size={11}
                  tintColor={statusColor}
                  weight="medium"
                  style={{ width: 13, height: 13 }}
                />
              ) : (
                <Feather
                  name={isComplete ? "check-circle" : "clock"}
                  size={11}
                  color={statusColor}
                />
              )}
              <Text
                style={[
                  nutrieStyles.inlinePillText,
                  { color: statusColor, fontWeight: "700" },
                ]}
              >
                {label}
              </Text>
            </View>
            {isComplete && xpEarned > 0 ? (
              <View
                style={[
                  nutrieStyles.inlinePill,
                  { backgroundColor: "#FFF5D6", borderColor: "#F5E6B8" },
                ]}
              >
                {Platform.OS === "ios" ? (
                  <SymbolView
                    name={"bolt.fill" as any}
                    size={11}
                    tintColor="#C89400"
                    weight="medium"
                    style={{ width: 13, height: 13 }}
                  />
                ) : (
                  <Feather name="zap" size={11} color="#C89400" />
                )}
                <Text
                  style={[nutrieStyles.inlinePillText, { color: "#A67C00" }]}
                >
                  +{xpEarned} XP
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
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
      <Text variant="caption-muted">Loading history...</Text>
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

  const exerciseGroups = useMemo(() => getExercisesGrouped(), []);
  const reducedMotion = useReducedMotion();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  // Active tab pill — spring in on mount
  const tabScale = useSharedValue(reducedMotion ? 1 : 0.92);
  useEffect(() => {
    tabScale.value = withSpring(1, {
      damping: 20,
      stiffness: 100,
      overshootClamping: true,
    });
  }, []);
  const tabPillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tabScale.value }],
  }));

  useEffect(() => {
    if (isTabKey(params.tab)) {
      setActiveTab(params.tab);
    }
  }, [params.tab]);

  const { data: completedCount = 0 } = useCompletedExercisesCount();
  const xp = useXPOptional();

  const handleExercisePress = useCallback((exercise: ExerciseConfig<any>) => {
    // Analytics or other logic can go here.
    // Routing is handled by the CircularRevealWrapper in ExerciseCard.
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
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShown: true,
          // headerBlurEffect: "systemUltraThinMaterialLight",
          headerShadowVisible: false,
          header: () => (
            <GlassView
              glassEffectStyle="regular"
              style={{
                borderBottomWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowColor: "transparent", // IMPORTANT

                overflow: "hidden",
              }}
            >
              <SafeAreaView edges={["top"]}>
                <View className="px-5 pb-3 pt-3">
                  <View className="mb-5">
                    <Text variant="eyebrow" className="mb-1">
                      {getContextualEyebrow()}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text
                        variant="display"
                        className="text-[40px] leading-[46px]"
                      >
                        Exercises
                      </Text>
                      <View className="flex-row items-center gap-3">
                        {completedCount > 0 ? (
                          <View className="flex-row items-center justify-center rounded-full bg-[#FFF5D6] px-3 py-1.5">
                            <HugeiconsIcon
                              icon={ZapIcon}
                              size={16}
                              color="#C89400"
                            />
                            <Text
                              variant="chip"
                              className="ml-1.5 text-ink-soft"
                            >
                              {completedCount} done
                            </Text>
                          </View>
                        ) : null}
                        <Pressable
                          onPress={() =>
                            router.push("/tabs/screens/coping-cards" as never)
                          }
                          accessibilityRole="button"
                          accessibilityLabel="My Coping Cards"
                          hitSlop={8}
                          className="w-9 h-9 rounded-full bg-sage-pill items-center justify-center active:opacity-70"
                        >
                          <HugeiconsIcon
                            icon={BookmarkAdd01Icon}
                            size={18}
                            color={SAGE[600]}
                            strokeWidth={2}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  <Animated.View style={tabPillStyle} className="w-full">
                    <Host style={{ width: "100%", height: 36 }}>
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
          ),
        }}
      />
      {activeTab === "discover" ? (
        <ScrollView
          style={nutrieStyles.screenBg}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingTop: headerHeight - insets.top + 16,
            paddingBottom: 128,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <RecommendedForYouCard />
          <SuggestedExerciseCard />
          {exerciseGroups.length === 0 ? (
            <EmptyDiscoverState />
          ) : (
            exerciseGroups.map((group, i) => (
              <Animated.View
                key={group.category}
                entering={FadeInDown.duration(400).delay(200 + i * 100)}
              >
                <DiscoverSection
                  label={group.label}
                  category={group.category}
                  exercises={group.exercises}
                  onPress={handleExercisePress}
                  isFirst={i === 0}
                />
              </Animated.View>
            ))
          )}
        </ScrollView>
      ) : (
        <Suspense fallback={<TimelineSkeleton />}>
          <ExerciseTimeline onPressItem={handleLogPress} />
        </Suspense>
      )}
    </>
  );
}

// ─── Nutrie-style Stylesheet ──────────────────────────────────────────────────
const nutrieStyles = StyleSheet.create({
  screenBg: {
    flex: 1,
    // backgroundColor: "#F7F7F8",
    backgroundColor: "transparent",
  },
  // Stat Cards
  statRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    alignItems: "center",
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    letterSpacing: -0.5,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  // Section Headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
    gap: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  sectionDescription: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 16,
    paddingHorizontal: 8,
    lineHeight: 20,
  },
  // Exercise Card
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  exerciseIconWell: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: 48,
    height: 48,
  },
  exerciseTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
  exerciseSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
    lineHeight: 18,
  },
  inlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E0E0E2",
  },
  inlinePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
  },
  arrowWell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
  },
  // Log Card
  logCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  logIconWell: {
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  logDate: {
    fontSize: 12,
    color: "#C7C7CC",
    fontWeight: "500",
  },
  logTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
});
