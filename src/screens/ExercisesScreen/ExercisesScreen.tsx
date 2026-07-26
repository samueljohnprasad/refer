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
  Dimensions,
  FlatList,
} from "react-native";
import {
  useRecentExercises,
  trackRecentExercise,
} from "@/src/hooks/useRecentExercises";
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
  FadeOutUp,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
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
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
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
import { useExerciseRecommendation } from "@/src/hooks/insights/useExerciseRecommendation";
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
import { useCircularRevealNavigate } from "@/src/hooks/useCircularRevealNavigate";
import { Href } from "expo-router";

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

// ─── NEW EDITORIAL LAYOUT COMPONENTS ───────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_GAP = 12;
const CAROUSEL_PEEK = 20;
// Fit ~1.85 cards across the screen so exercise titles wrap cleanly on 2 lines
const SHELF_CARD_WIDTH =
  (SCREEN_WIDTH - CAROUSEL_PEEK * 2 - CAROUSEL_GAP * 2) / 1.85;

interface LayoutCardProps {
  exercise: ExerciseConfig<any>;
  onPress: (exercise: ExerciseConfig<any>) => void;
  customSubtitle?: string;
}

const FeaturedExerciseHero = memo(function FeaturedExerciseHero({
  exercise,
  onPress,
  customSubtitle,
}: LayoutCardProps): ReactElement {
  const icon = getExerciseIcon(exercise.type);
  const badgeTheme = getCategoryBadgeTheme(exercise.category);

  return (
    <CircularRevealWrapper
      href={buildExerciseRoute(exercise.type)}
      color={badgeTheme.bg}
      duration={800}
    >
      <Pressable
        onPress={() => onPress(exercise)}
        style={({ pressed }) => [
          {
            backgroundColor: badgeTheme.bg,
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          },
          pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <ExerciseIcon
            type={exercise.type}
            size={28}
            color={badgeTheme.iconColor}
          />
          <View style={{ flex: 1 }} />
          <View
            style={[
              nutrieStyles.inlinePill,
              { backgroundColor: "transparent", borderWidth: 0 },
            ]}
          >
            {Platform.OS === "ios" ? (
              <SymbolView
                name={"clock" as any}
                size={11}
                tintColor={badgeTheme.iconColor}
              />
            ) : (
              <Feather name="clock" size={11} color={badgeTheme.iconColor} />
            )}
            <Text
              style={[
                nutrieStyles.inlinePillText,
                { color: badgeTheme.iconColor, fontWeight: "600" },
              ]}
            >
              {exercise.duration}
            </Text>
          </View>
        </View>

        <Text
          style={[
            nutrieStyles.exerciseTitle,
            { fontSize: 20, marginBottom: 4 },
          ]}
        >
          {exercise.title}
        </Text>
        <Text
          style={[nutrieStyles.exerciseSubtitle, { color: "rgba(0,0,0,0.6)" }]}
          numberOfLines={2}
        >
          {customSubtitle ?? exercise.subtitle}
        </Text>
      </Pressable>
    </CircularRevealWrapper>
  );
});

const ExerciseShelfCard = memo(function ExerciseShelfCard({
  exercise,
  onPress,
}: LayoutCardProps): ReactElement {
  const icon = getExerciseIcon(exercise.type);
  const badgeTheme = getCategoryBadgeTheme(exercise.category);

  return (
    <CircularRevealWrapper
      href={buildExerciseRoute(exercise.type)}
      color={badgeTheme.bg}
      duration={800}
    >
      <Pressable
        onPress={() => onPress(exercise)}
        style={({ pressed }) => [
          {
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 16,
            width: SHELF_CARD_WIDTH,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.04)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 1,
          },
          pressed && { opacity: 0.92, transform: [{ scale: 0.96 }] },
        ]}
      >
        <View
          style={{ marginBottom: 12, height: 40, justifyContent: "center" }}
        >
          <ExerciseIcon
            type={exercise.type}
            size={24}
            color={badgeTheme.iconColor}
          />
        </View>
        <Text style={nutrieStyles.exerciseTitle} numberOfLines={2}>
          {exercise.title}
        </Text>
        <Text
          style={[
            nutrieStyles.exerciseSubtitle,
            { fontSize: 13, lineHeight: 18 },
          ]}
          numberOfLines={2}
        >
          {exercise.subtitle}
        </Text>
      </Pressable>
    </CircularRevealWrapper>
  );
});

const CompactExerciseRow = memo(function CompactExerciseRow({
  exercise,
  onPress,
}: LayoutCardProps): ReactElement {
  const icon = getExerciseIcon(exercise.type);
  const badgeTheme = getCategoryBadgeTheme(exercise.category);

  return (
    <CircularRevealWrapper
      href={buildExerciseRoute(exercise.type)}
      color={badgeTheme.bg}
      duration={800}
    >
      <Pressable
        onPress={() => onPress(exercise)}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.04)",
          },
          pressed && { opacity: 0.7 },
        ]}
      >
        <View
          style={[
            nutrieStyles.exerciseIconWell,
            {
              backgroundColor: "transparent",
              width: 40,
              height: 40,
              borderRadius: 10,
              marginRight: 12,
            },
          ]}
        >
          <ExerciseIcon
            type={exercise.type}
            size={20}
            color={badgeTheme.iconColor}
          />
        </View>

        <View style={{ flex: 1, minWidth: 0, justifyContent: "center" }}>
          <Text
            style={[nutrieStyles.exerciseTitle, { marginBottom: 0 }]}
            numberOfLines={1}
          >
            {exercise.title}
          </Text>
          <Text
            style={[nutrieStyles.exerciseSubtitle, { fontSize: 13 }]}
            numberOfLines={1}
          >
            {exercise.duration} • +{exercise.xp} XP
          </Text>
        </View>

        <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#C4C4CC" />
      </Pressable>
    </CircularRevealWrapper>
  );
});

// ─── END NEW LAYOUT COMPONENTS ──────────────────────────────────────────────

// ponytail: recent exercises shelf replacing pinned favorites
function JumpBackInShelf({
  exercises,
  onPress,
}: {
  exercises: ExerciseConfig<any>[];
  onPress: (exercise: ExerciseConfig<any>) => void;
}) {
  const { recentIds } = useRecentExercises();

  // Map IDs to actual exercise config objects
  // Pad with defaults if fewer than 2 recent exercises
  const defaultIds = ["thought_catcher", "thought_reframing"];
  const displayIds = Array.from(new Set([...recentIds, ...defaultIds])).slice(
    0,
    2,
  );

  const items = displayIds
    .map((id) => exercises.find((ex) => ex.type === id))
    .filter(Boolean) as ExerciseConfig<any>[];

  return (
    <View style={{ marginBottom: 40 }}>
      <View style={[nutrieStyles.sectionHeader, { paddingTop: 16 }]}>
        <View
          style={[
            nutrieStyles.categoryBadge,
            { backgroundColor: "transparent", paddingHorizontal: 0 },
          ]}
        >
          <Text style={[nutrieStyles.categoryBadgeText, { color: INK_MUTED }]}>
            Jump Back In
          </Text>
        </View>
      </View>

      <View style={{ marginHorizontal: -CAROUSEL_PEEK, marginTop: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: CAROUSEL_GAP,
            paddingHorizontal: CAROUSEL_PEEK,
          }}
          snapToInterval={SHELF_CARD_WIDTH + CAROUSEL_GAP}
          decelerationRate="fast"
        >
          {items.map((item) => (
            <View key={item.type} style={{ width: SHELF_CARD_WIDTH }}>
              <ExerciseShelfCard exercise={item} onPress={onPress} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

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

  // Slice the exercises to create the varied layout
  const featuredExercise = exercises[0];
  const shelfExercises = exercises.slice(1, 4);
  const catalogExercises = exercises.slice(4);

  return (
    <View style={{ marginBottom: 32 }}>
      <View
        style={[nutrieStyles.sectionHeader, !isFirst && { paddingTop: 16 }]}
      >
        <View
          style={[
            nutrieStyles.categoryBadge,
            { backgroundColor: "transparent", paddingHorizontal: 0 },
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
            {label} • {exercises.length}
          </Text>
        </View>
      </View>

      <Text style={nutrieStyles.sectionDescription}>
        {categoryMeta.description}
      </Text>

      {/* 1. The Hero */}
      {featuredExercise && (
        <FeaturedExerciseHero exercise={featuredExercise} onPress={onPress} />
      )}

      {/* 2. The Horizontal Shelf */}
      {shelfExercises.length > 0 && (
        <View style={{ marginHorizontal: -CAROUSEL_PEEK, marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: CAROUSEL_GAP,
              paddingHorizontal: CAROUSEL_PEEK,
            }}
            snapToInterval={SHELF_CARD_WIDTH + CAROUSEL_GAP}
            decelerationRate="fast"
          >
            {shelfExercises.map((exercise) => (
              <ExerciseShelfCard
                key={exercise.type}
                exercise={exercise}
                onPress={onPress}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 3. The Dense List */}
      {catalogExercises.length > 0 && (
        <View style={{ marginTop: 8 }}>
          {catalogExercises.map((exercise) => (
            <CompactExerciseRow
              key={exercise.type}
              exercise={exercise}
              onPress={onPress}
            />
          ))}
        </View>
      )}
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
    const badgeTheme = config
      ? getCategoryBadgeTheme(config.category)
      : { iconColor: "#8E8E93" };

    return {
      heading: categoryMeta?.label ?? "Exercise",
      title: config?.title ?? item.title ?? "Exercise",
      icon: config ? (
        <ExerciseIcon
          type={config.type}
          size={22}
          color={badgeTheme.iconColor}
        />
      ) : (
        <HugeiconsIcon
          icon={Brain01Icon}
          size={22}
          color={badgeTheme.iconColor}
        />
      ),
    };
  }

  if (item.type === "catcher") {
    return {
      heading: LEGACY_LOG_META.catcher.label,
      title: item.title?.trim() || "Untitled Session",
      icon: (
        <HugeiconsIcon
          icon={LEGACY_LOG_META.catcher.icon}
          size={22}
          color="#8E8E93"
        />
      ),
    };
  }

  if (item.type === "reframing") {
    return {
      heading: LEGACY_LOG_META.reframing.label,
      title: item.title?.trim() || "Untitled Session",
      icon: (
        <HugeiconsIcon
          icon={LEGACY_LOG_META.reframing.icon}
          size={22}
          color="#8E8E93"
        />
      ),
    };
  }

  return {
    heading: LEGACY_LOG_META.gratitude.label,
    title: item.title?.trim() || "Untitled Session",
    icon: (
      <HugeiconsIcon
        icon={LEGACY_LOG_META.gratitude.icon}
        size={22}
        color="#8E8E93"
      />
    ),
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
          {presentation.icon}
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
          className="text-[36px]"
          accessibilityLabel="Guided reflection icon"
          accessibilityRole="image"
        >
          🌱
        </Text>
      </View>
      <Text variant="h3" className="mb-2 text-center">
        Start your first guided reflection
      </Text>
      <Text variant="body" className="text-center">
        Choose a CBT exercise above to catch negative thoughts, reframe anxiety,
        or practice mindfulness.
      </Text>
    </View>
  );
}

function LoadingHistoryState(): ReactElement {
  return (
    <View className="items-center py-12">
      <Text variant="caption-muted">Retrieving your reflection history...</Text>
    </View>
  );
}

function EmptyExerciseLogState(): ReactElement {
  return (
    <View className="items-center justify-center px-8 py-16">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-sage-50">
        <Text className="text-[36px]">📖</Text>
      </View>
      <Text variant="h3" className="mb-2 text-center">
        No reflections logged yet
      </Text>
      <Text variant="body" className="text-center">
        Your CBT timeline tracks shifts in distress, mood, and anxiety over
        time. Complete an exercise from Discover to record your first entry.
      </Text>
    </View>
  );
}

export default function ExercisesScreen(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const [showMilestoneToast, setShowMilestoneToast] = useState(false);
  const params = useLocalSearchParams<{ tab?: string }>();
  const recommendation = useExerciseRecommendation();

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
    trackRecentExercise(exercise.type);
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

  const navigateWithReveal = useCircularRevealNavigate();

  const handleLogPress = useCallback(
    (item: HistoryLogItem, e?: any): void => {
      if (item.type === "unified" && item.exerciseType) {
        const config = getExerciseConfig(item.exerciseType);
        const color = config
          ? getCategoryBadgeTheme(config.category).bg
          : "#E8FBF0";
        const route = buildExerciseRoute(item.exerciseType, {
          entryId: item.id,
          readOnly: item.status === "completed",
        });
        if (e) {
          navigateWithReveal(e, route as any, color);
        } else {
          router.push(route as never);
        }
        return;
      }

      if (item.type === "catcher") {
        const route = `/tabs/screens/thought-checker?id=${item.id}`;
        if (e) navigateWithReveal(e, route as any, "#E8FBF0");
        else router.push(route as never);
        return;
      }

      if (item.type === "reframing") {
        const route = buildExerciseRoute("thought_reframing", {
          entryId: item.id,
          readOnly: item.status === "completed",
        });
        if (e) navigateWithReveal(e, route as any, "#E8FBF0");
        else router.push(route as never);
        return;
      }

      if (item.type === "gratitude") {
        const route = `/tabs/screens/gratitude-reframe?id=${item.id}`;
        if (e) navigateWithReveal(e, route as any, "#E8FBF0");
        else router.push(route as never);
      }
    },
    [navigateWithReveal],
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShown: true,
          headerShadowVisible: false,
          // headerStyle: { backgroundColor: "#FFFFFF" },
          header: () => (
            <GlassView
              glassEffectStyle="regular"
              // tintColor="#FFFFFF"
              style={{
                // backgroundColor: "#FFFFFF",
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
                    <View className="flex-row items-center justify-between pt-2">
                      <Text
                        variant="body-bold"
                        className="text-[32px] leading-[38px] tracking-tight"
                      >
                        Exercises
                      </Text>
                      <View className="flex-row items-center gap-3">
                        {completedCount > 0 ? (
                          <View
                            accessibilityLabel={`${completedCount} exercises completed.`}
                            className="flex-row items-center justify-center rounded-full bg-sage-50/80 px-3 py-1.5"
                          >
                            <HugeiconsIcon
                              icon={ZapIcon}
                              size={16}
                              color={SAGE[600]}
                            />
                            <Text
                              variant="chip"
                              className="ml-1.5 font-nunito-bold text-sage-700"
                            >
                              {completedCount}
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
                          className="w-9 h-9 rounded-full bg-transparent items-center justify-center active:opacity-70"
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
      {showMilestoneToast && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          exiting={FadeOutUp.duration(250)}
          style={{
            position: "absolute",
            top: headerHeight + 8,
            left: 20,
            right: 20,
            zIndex: 100,
            backgroundColor: "#EAF0EA",
            borderColor: "#C5D8C5",
            borderWidth: 1,
            borderRadius: 14,
            paddingVertical: 10,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>✨</Text>
          <Text
            style={{
              fontFamily: "Nunito-SemiBold",
              fontSize: 13,
              color: "#2C4A2E",
              flex: 1,
            }}
          >
            {completedCount} mindful exercises logged! Consistency compounds
            over time.
          </Text>
        </Animated.View>
      )}
      {activeTab === "discover" ? (
        <ScrollView
          style={nutrieStyles.screenBg}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingTop: headerHeight - insets.top + 16,
            paddingBottom: 160,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {recommendation && getExerciseConfig(recommendation.exerciseType) ? (
            <FeaturedExerciseHero
              exercise={getExerciseConfig(recommendation.exerciseType)!}
              onPress={handleExercisePress}
              customSubtitle={recommendation.reason}
            />
          ) : null}
          {exerciseGroups.length === 0 ? (
            <EmptyDiscoverState />
          ) : (
            <>
              {/* Insert Jump Back In shelf at the very top */}
              <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                <JumpBackInShelf
                  exercises={exerciseGroups.flatMap((g) => g.exercises)}
                  onPress={handleExercisePress}
                />
              </Animated.View>

              {exerciseGroups.map((group, i) => (
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
              ))}
            </>
          )}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <Suspense fallback={<TimelineSkeleton />}>
            <ExerciseTimeline onPressItem={handleLogPress} />
          </Suspense>
        </View>
      )}
    </View>
  );
}

// ─── Nutrie-style Stylesheet ──────────────────────────────────────────────────
const nutrieStyles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    marginBottom: 10,
    paddingHorizontal: 0,
    gap: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  sectionDescription: {
    fontSize: 15,
    color: "#636366",
    marginBottom: 16,
    paddingHorizontal: 0,
    lineHeight: 22,
  },
  // Exercise Card
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    // Removed ghost card shadow
  },
  exerciseIconWell: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    width: 48,
    height: 48,
  },
  exerciseTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1C1C1E",
    letterSpacing: -0.4,
    lineHeight: 22,
    marginBottom: 4,
  },
  exerciseSubtitle: {
    fontSize: 14,
    color: "#636366",
    lineHeight: 20,
  },
  inlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F4F4F5",
  },
  inlinePillText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#636366",
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    // Removed ghost card shadow
  },
  logIconWell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#636366",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  logDate: {
    fontSize: 12,
    color: "#636366",
    fontWeight: "500",
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
});
