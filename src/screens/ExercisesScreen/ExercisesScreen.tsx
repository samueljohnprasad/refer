import React, { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Brain01Icon,
  CheckmarkBadge01Icon,
  SparklesIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons";

import { Text } from "@/components/ui/text";
import {
  getCategoryMeta,
  getExerciseConfig,
  getExercisesGrouped,
} from "@/src/data/exerciseRegistry";
import {
  getCategoryIcon,
  getExerciseIcon,
} from "@/src/data/exerciseIconRegistry";
import type {
  ExerciseCategory,
  ExerciseConfig,
  ExerciseType,
} from "@/src/types/exerciseFlow";
import { useCBTHistory, type HistoryLogItem } from "./hooks/useCBTHistory";

const ACCENT = "#58CC02";

type TabKey = "discover" | "log";

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

function ExerciseCard({
  exercise,
  onPress,
}: ExerciseCardProps): React.JSX.Element {
  const icon = getExerciseIcon(exercise.type);

  return (
    <Pressable
      onPress={() => onPress(exercise)}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.title}: ${exercise.subtitle}. Duration: ${exercise.duration}.`}
      className="rounded-2xl mb-4 active:opacity-90"
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#E2E8F0",
        borderBottomWidth: 4,
        borderBottomColor: "#CBD5E1",
        minHeight: 48,
      }}
    >
      <View className="p-4 flex-row items-center">
        <View
          style={{ backgroundColor: exercise.backgroundColor }}
          className="h-14 w-14 rounded-2xl items-center justify-center mr-4"
          accessible={false}
        >
          <HugeiconsIcon
            icon={icon}
            size={28}
            color="#1E293B"
          />
        </View>

        <View className="flex-1">
          <Text className="text-[17px] font-extrabold text-slate-800 mr-2 flex-shrink">
            {exercise.title}
          </Text>
          <Text className="text-[14px] text-slate-500 mb-2 font-medium">
            {exercise.subtitle}
          </Text>

          <View className="flex-row items-center gap-2">
            <View className="bg-slate-100 px-2.5 py-1 rounded-full flex-row items-center">
              <Text className="text-xs">⏱️</Text>
              <Text className="text-slate-600 text-xs font-bold ml-1">
                {exercise.duration}
              </Text>
            </View>
            <View
              className="px-2.5 py-1 rounded-full flex-row items-center"
              style={{ backgroundColor: "#FFF3CD" }}
            >
              <Text className="text-xs">⚡</Text>
              <Text className="text-xs font-extrabold text-amber-700 ml-1">
                +{exercise.xp} XP
              </Text>
            </View>
          </View>
        </View>

        <View
          className="h-8 w-8 rounded-full items-center justify-center"
          style={{ backgroundColor: ACCENT }}
        >
          <Text className="text-white text-sm font-extrabold">›</Text>
        </View>
      </View>
    </Pressable>
  );
}

function DiscoverSection({
  label,
  category,
  exercises,
  onPress,
}: {
  label: string;
  category: ExerciseCategory;
  exercises: ExerciseConfig<any>[];
  onPress: (exercise: ExerciseConfig<any>) => void;
}): React.JSX.Element {
  const categoryMeta = getCategoryMeta(category);
  const categoryIcon = getCategoryIcon(category);

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <View className="h-10 w-10 rounded-2xl bg-slate-100 items-center justify-center mr-3">
          <HugeiconsIcon
            icon={categoryIcon}
            size={20}
            color="#334155"
          />
        </View>
        <View className="flex-1">
          <Text className="text-[18px] font-extrabold text-slate-900">
            {label}
          </Text>
          <Text className="text-sm text-slate-500">
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
}

interface StatusInfo {
  label: string;
  isComplete: boolean;
  badgeColor: string;
  badgeBg: string;
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
      badgeColor: "#047857",
      badgeBg: "#D1FAE5",
      xpEarned: getHistoryXp(item),
    };
  }

  if (item.status === "catcher_completed") {
    return {
      label: "Ready to Reframe",
      isComplete: false,
      badgeColor: "#B45309",
      badgeBg: "#FEF3C7",
      xpEarned: 0,
    };
  }

  return {
    label: "Resume",
    isComplete: false,
    badgeColor: "#64748B",
    badgeBg: "#F1F5F9",
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

function LogCard({
  item,
  onPress,
}: {
  item: HistoryLogItem;
  onPress: (item: HistoryLogItem) => void;
}): React.JSX.Element {
  const { label, isComplete, badgeColor, badgeBg, xpEarned } =
    formatStatus(item);
  const presentation = getLogPresentation(item);

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="rounded-2xl mb-3 active:opacity-90"
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: isComplete ? "#BBF7D0" : "#E2E8F0",
        borderBottomWidth: 4,
        borderBottomColor: isComplete ? "#86EFAC" : "#CBD5E1",
      }}
    >
      <View className="p-4 flex-row items-center">
        <View
          className="h-12 w-12 rounded-2xl items-center justify-center mr-3"
          style={{ backgroundColor: presentation.iconBackgroundColor }}
        >
          <HugeiconsIcon
            icon={presentation.icon}
            size={22}
            color="#1E293B"
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-0.5">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {presentation.heading}
            </Text>
            <Text className="text-xs text-slate-400">
              {format(new Date(item.date), "MMM d, h:mm a")}
            </Text>
          </View>

          <Text
            className="text-[15px] font-extrabold text-slate-800 mb-1.5"
            numberOfLines={1}
          >
            {presentation.title}
          </Text>

          <View className="flex-row items-center gap-2">
            <View
              className="px-2.5 py-1 rounded-full flex-row items-center"
              style={{ backgroundColor: badgeBg }}
            >
              <HugeiconsIcon
                icon={isComplete ? CheckmarkBadge01Icon : Time02Icon}
                size={12}
                color={badgeColor}
              />
              <Text
                className="text-[10px] font-extrabold uppercase tracking-wider ml-1"
                style={{ color: badgeColor }}
              >
                {label}
              </Text>
            </View>
            {isComplete && xpEarned > 0 && (
              <View
                className="px-2 py-1 rounded-full flex-row items-center"
                style={{ backgroundColor: "#FFF3CD" }}
              >
                <Text className="text-[10px]">⚡</Text>
                <Text className="text-[10px] font-extrabold text-amber-700 ml-0.5">
                  +{xpEarned} XP
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function ExercisesScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const { data: history = [], isLoading: isLoadingHistory } = useCBTHistory();
  const exerciseGroups = useMemo(() => getExercisesGrouped(), []);

  const completedCount = history.filter(
    (item) =>
      item.status === "completed" ||
      item.status === "summary" ||
      item.status === "checker_completed",
  ).length;

  const handleExercisePress = useCallback((exercise: ExerciseConfig<any>) => {
    router.push(buildExerciseRoute(exercise.type) as never);
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
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top"]}
    >
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[28px] font-extrabold text-slate-900">
            Exercises
          </Text>
          {completedCount > 0 && (
            <View
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "#FFF3CD" }}
            >
              <Text className="text-sm">🔥</Text>
              <Text className="text-xs font-extrabold text-amber-700 ml-1">
                {completedCount} done
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row bg-slate-100 rounded-xl p-1">
          {(["discover", "log"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === "discover" ? "Lessons" : "My Log";

            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                className={`flex-1 py-2.5 rounded-lg items-center justify-center ${isActive ? "bg-white" : ""}`}
                style={
                  isActive
                    ? {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2,
                        elevation: 2,
                      }
                    : undefined
                }
              >
                <Text
                  className={`text-sm font-extrabold ${isActive ? "text-slate-800" : "text-slate-400"}`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "discover" ? (
          exerciseGroups.length > 0 ? (
            <View>
              {exerciseGroups.map((group) => (
                <DiscoverSection
                  key={group.category}
                  label={group.label}
                  category={group.category}
                  exercises={group.exercises}
                  onPress={handleExercisePress}
                />
              ))}
            </View>
          ) : (
            <View
              className="items-center justify-center py-16 px-8"
              accessibilityLiveRegion="polite"
            >
              <View className="h-20 w-20 rounded-3xl bg-slate-100 items-center justify-center mb-4">
                <Text
                  className="text-[40px]"
                  accessibilityLabel="Exercise illustration"
                  accessibilityRole="image"
                >
                  🏋️
                </Text>
              </View>
              <Text className="text-xl font-extrabold text-slate-700 mb-2 text-center">
                No exercises yet
              </Text>
              <Text className="text-sm text-slate-400 text-center leading-relaxed">
                Exercises will appear here as they become available.
              </Text>
            </View>
          )
        ) : (
          <View>
            {isLoadingHistory ? (
              <View className="py-12 items-center">
                <Text className="text-sm font-bold text-slate-400">
                  Loading history...
                </Text>
              </View>
            ) : history.length > 0 ? (
              history.map((item) => (
                <LogCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  onPress={handleLogPress}
                />
              ))
            ) : (
              <View className="items-center justify-center py-16 px-8">
                <View className="h-20 w-20 rounded-3xl bg-slate-100 items-center justify-center mb-4">
                  <Text className="text-[40px]">📚</Text>
                </View>
                <Text className="text-xl font-extrabold text-slate-700 mb-2 text-center">
                  Your exercise journal
                </Text>
                <Text className="text-sm text-slate-400 text-center leading-relaxed">
                  Complete your first exercise to see it here.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
