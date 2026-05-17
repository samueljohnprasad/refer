import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { FlashList, type ListRenderItem } from "@shopify/flash-list";
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
    backgroundColor: "#F3E8FF",
  },
  reframing: {
    label: "Thought Reframing",
    icon: Brain01Icon,
    xp: 15,
    backgroundColor: "#E8F0FE",
  },
  gratitude: {
    label: "Gratitude Reframe",
    icon: SparklesIcon,
    xp: 10,
    backgroundColor: "#F0FDF4",
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
  const iconStyle = useMemo(
    () => [
      styles.exerciseIcon,
      { backgroundColor: exercise.backgroundColor },
    ],
    [exercise.backgroundColor],
  );
  const handlePress = useCallback((): void => {
    onPress(exercise);
  }, [exercise, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.title}: ${exercise.subtitle}. Duration: ${exercise.duration}.`}
      className="mb-4 min-h-12 rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 bg-white active:opacity-90"
      style={styles.roundedCard}
    >
      <View className="flex-row items-center p-4">
        <View
          className="mr-4 h-14 w-14 items-center justify-center rounded-2xl"
          style={iconStyle}
          accessible={false}
        >
          <HugeiconsIcon icon={icon} size={28} color="#1E293B" />
        </View>

        <View className="flex-1">
          <Text className="mr-2 flex-shrink text-[17px] font-extrabold text-slate-800">
            {exercise.title}
          </Text>
          <Text className="mb-2 mt-0.5 text-[14px] font-medium text-slate-500">
            {exercise.subtitle}
          </Text>

          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center rounded-full bg-slate-100 px-2.5 py-1">
              <Text className="text-xs">⏱️</Text>
              <Text className="ml-1 text-xs font-bold text-slate-600">
                {exercise.duration}
              </Text>
            </View>
            <View className="flex-row items-center rounded-full bg-[#FFF3CD] px-2.5 py-1">
              <Text className="text-xs">⚡</Text>
              <Text className="ml-1 text-xs font-extrabold text-amber-700">
                +{exercise.xp} XP
              </Text>
            </View>
          </View>
        </View>

        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#58CC02]">
          <Text className="text-sm font-extrabold text-white">›</Text>
        </View>
      </View>
    </Pressable>
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
    <View className="mb-6">
      <View className="mb-3 flex-row items-center">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
          <HugeiconsIcon icon={categoryIcon} size={20} color="#334155" />
        </View>
        <View className="flex-1">
          <Text className="text-[18px] font-extrabold text-slate-900">
            {label}
          </Text>
          <Text className="mt-0.5 text-sm text-slate-500">
            {categoryMeta.description}
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
      badgeIconColor: "#047857",
      badgeClassName: "bg-emerald-100",
      badgeTextClassName: "text-emerald-700",
      cardBorderClassName: "border-green-200 border-b-green-300",
      xpEarned: getHistoryXp(item),
    };
  }

  if (item.status === "catcher_completed") {
    return {
      label: "Ready to Reframe",
      isComplete: false,
      badgeIconColor: "#B45309",
      badgeClassName: "bg-amber-100",
      badgeTextClassName: "text-amber-700",
      cardBorderClassName: "border-slate-200 border-b-slate-300",
      xpEarned: 0,
    };
  }

  return {
    label: "Resume",
    isComplete: false,
    badgeIconColor: "#64748B",
    badgeClassName: "bg-slate-100",
    badgeTextClassName: "text-slate-500",
    cardBorderClassName: "border-slate-200 border-b-slate-300",
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
      iconBackgroundColor: config?.backgroundColor ?? "#F8FAFC",
    };
  }

  if (item.type === "catcher") {
    return {
      heading: LEGACY_LOG_META.catcher.label,
      title: item.title?.trim() || "Untitled Session",
      icon: LEGACY_LOG_META.catcher.icon,
      iconBackgroundColor: LEGACY_LOG_META.catcher.backgroundColor,
    };
  }

  if (item.type === "reframing") {
    return {
      heading: LEGACY_LOG_META.reframing.label,
      title: item.title?.trim() || "Untitled Session",
      icon: LEGACY_LOG_META.reframing.icon,
      iconBackgroundColor: LEGACY_LOG_META.reframing.backgroundColor,
    };
  }

  return {
    heading: LEGACY_LOG_META.gratitude.label,
    title: item.title?.trim() || "Untitled Session",
    icon: LEGACY_LOG_META.gratitude.icon,
    iconBackgroundColor: LEGACY_LOG_META.gratitude.backgroundColor,
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
  const iconStyle = useMemo(
    () => [
      styles.logIcon,
      { backgroundColor: presentation.iconBackgroundColor },
    ],
    [presentation.iconBackgroundColor],
  );
  const handlePress = useCallback((): void => {
    onPress(item);
  }, [item, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      className={`mb-3 rounded-2xl border-2 border-b-4 bg-white active:opacity-90 ${cardBorderClassName}`}
      style={styles.roundedCard}
    >
      <View className="flex-row items-center p-4">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-2xl"
          style={iconStyle}
        >
          <HugeiconsIcon icon={presentation.icon} size={22} color="#1E293B" />
        </View>

        <View className="flex-1">
          <View className="mb-0.5 flex-row items-center justify-between">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {presentation.heading}
            </Text>
            <Text className="text-xs text-slate-400">
              {format(new Date(item.date), "MMM d, h:mm a")}
            </Text>
          </View>

          <Text
            className="mb-1.5 text-[15px] font-extrabold text-slate-800"
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
              <View className="flex-row items-center rounded-full bg-[#FFF3CD] px-2 py-1">
                <Text className="text-[10px]">⚡</Text>
                <Text className="ml-0.5 text-[10px] font-extrabold text-amber-700">
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
      <View
        className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-slate-100"
        style={styles.emptyIcon}
      >
        <Text
          className="text-[40px]"
          accessibilityLabel="Exercise illustration"
          accessibilityRole="image"
        >
          🏋️
        </Text>
      </View>
      <Text className="mb-2 text-center text-xl font-extrabold text-slate-700">
        No exercises yet
      </Text>
      <Text className="text-center text-sm leading-relaxed text-slate-400">
        Exercises will appear here as they become available.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  list: {
    flex: 1,
  },
  roundedCard: {
    borderCurve: "continuous",
  },
  exerciseIcon: {
    borderCurve: "continuous",
  },
  logIcon: {
    borderCurve: "continuous",
  },
  emptyIcon: {
    borderCurve: "continuous",
  },
  tabButton: {
    borderCurve: "continuous",
  },
});

function LoadingHistoryState(): ReactElement {
  return (
    <View className="items-center py-12">
      <Text className="text-sm font-bold text-slate-400">
        Loading history...
      </Text>
    </View>
  );
}

function EmptyExerciseLogState(): ReactElement {
  return (
    <View className="items-center justify-center px-8 py-16">
      <View
        className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-slate-100"
        style={styles.emptyIcon}
      >
        <Text className="text-[40px]">📚</Text>
      </View>
      <Text className="mb-2 text-center text-xl font-extrabold text-slate-700">
        Your exercise journal
      </Text>
      <Text className="text-center text-sm leading-relaxed text-slate-400">
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
      className={`flex-1 items-center justify-center rounded-lg py-2.5 ${
        isActive ? "bg-white shadow-sm" : ""
      }`}
      style={styles.tabButton}
    >
      <Text
        className={`text-sm font-extrabold ${
          isActive ? "text-slate-800" : "text-slate-400"
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
  const renderDiscoverSection = useCallback<ListRenderItem<ExerciseGroup>>(
    ({ item }) => (
      <DiscoverSection
        label={item.label}
        category={item.category}
        exercises={item.exercises}
        onPress={handleExercisePress}
      />
    ),
    [handleExercisePress],
  );
  const renderLogCard = useCallback<ListRenderItem<HistoryLogItem>>(
    ({ item }) => <LogCard item={item} onPress={handleLogPress} />,
    [handleLogPress],
  );
  const exerciseGroupKeyExtractor = useCallback(
    (item: ExerciseGroup): string => item.category,
    [],
  );
  const historyKeyExtractor = useCallback(
    (item: HistoryLogItem): string => `${item.type}-${item.id}`,
    [],
  );

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View className="px-5 pb-3 pt-4">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Mascot state="panda-love-hug-2" size={40} />
            <Text className="text-[28px] font-extrabold text-slate-900">
              Exercises
            </Text>
          </View>
          {completedCount > 0 ? (
            <View className="flex-row items-center rounded-full bg-[#FFF3CD] px-3 py-1.5">
              <Text className="text-sm">🔥</Text>
              <Text className="ml-1 text-xs font-extrabold text-amber-700">
                {completedCount} done
              </Text>
            </View>
          ) : null}
        </View>

        <View className="flex-row rounded-xl bg-slate-100 p-1">
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

      {activeTab === "discover" ? (
        <FlashList
          style={styles.list}
          data={exerciseGroups}
          renderItem={renderDiscoverSection}
          keyExtractor={exerciseGroupKeyExtractor}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyDiscoverState}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlashList
          style={styles.list}
          data={isLoadingHistory ? [] : history}
          renderItem={renderLogCard}
          keyExtractor={historyKeyExtractor}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            isLoadingHistory ? LoadingHistoryState : EmptyExerciseLogState
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
