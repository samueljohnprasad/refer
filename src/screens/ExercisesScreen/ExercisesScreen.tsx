import React, { useCallback, useState } from "react";
import { View, ScrollView, Pressable, AccessibilityInfo } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";

import { CBTExercise } from "@/src/types/exercises";
import { CBT_EXERCISES } from "@/src/data/exercises";

// ---------------------------------------------------------------------------
// Route map — exercises without a route show a "coming soon" state
// ---------------------------------------------------------------------------
const ROUTE_MAP: Record<string, string> = {
  "thought-reframing": "/tabs/screens/thought-reframing",
  "gratitude-reframe": "/tabs/screens/gratitude-reframe",
  "thought-catcher": "/tabs/screens/thought-catcher",
};

// ---------------------------------------------------------------------------
// Constants — Duolingo-style gamification
// ---------------------------------------------------------------------------
const ACCENT = "#58CC02";

const XP_MAP: Record<string, number> = {
  "thought-catcher": 10,
  "thought-reframing": 15,
  "behavioral-activation": 12,
  "gratitude-reframe": 10,
};

// ---------------------------------------------------------------------------
// ExerciseCard — Duolingo lesson-card style
// ---------------------------------------------------------------------------
interface ExerciseCardProps {
  exercise: CBTExercise;
  onPress: (exercise: CBTExercise) => void;
}

function ExerciseCard({
  exercise,
  onPress,
}: ExerciseCardProps): React.JSX.Element {
  const isAvailable: boolean = Boolean(ROUTE_MAP[exercise.id]);
  const xp: number = XP_MAP[exercise.id] ?? 10;

  return (
    <Pressable
      onPress={() => onPress(exercise)}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.title}: ${exercise.subtitle}. Duration: ${exercise.duration}.${!isAvailable ? " Coming soon." : ""}`}
      accessibilityState={{ disabled: !isAvailable }}
      className={`rounded-2xl mb-4 active:opacity-90 ${!isAvailable ? "opacity-50" : ""
        }`}
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#E2E8F0",
        borderBottomWidth: 4,
        borderBottomColor: isAvailable ? "#CBD5E1" : "#E2E8F0",
        minHeight: 48,
      }}
    >
      <View className="p-4 flex-row items-center">
        {/* Icon tile — larger, bolder */}
        <View
          style={{ backgroundColor: exercise.backgroundColor }}
          className="h-14 w-14 rounded-2xl items-center justify-center mr-4"
          accessible={false}
        >
          <Text className="text-[32px]">{exercise.icon}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Title row */}
          <View className="flex-row items-center mb-0.5">
            <Text className="text-[17px] font-extrabold text-slate-800 mr-2 flex-shrink">
              {exercise.title}
            </Text>
            {!isAvailable && (
              <View className="bg-amber-100 px-2 py-0.5 rounded-full">
                <Text className="text-amber-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Soon
                </Text>
              </View>
            )}
          </View>

          {/* Subtitle */}
          <Text className="text-[14px] text-slate-500 mb-2 font-medium">
            {exercise.subtitle}
          </Text>

          {/* Meta row: Duration + XP */}
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
                +{xp} XP
              </Text>
            </View>
          </View>
        </View>

        {/* Arrow indicator */}
        <View
          className="h-8 w-8 rounded-full items-center justify-center"
          style={{ backgroundColor: isAvailable ? ACCENT : "#E2E8F0" }}
        >
          <Text className="text-white text-sm font-extrabold">›</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState(): React.JSX.Element {
  return (
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
        Exercises will appear here as they become available. Check back soon!
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// LogCard — displays a history entry with Duolingo completion style
// ---------------------------------------------------------------------------
import { useCBTHistory, HistoryLogItem } from "./hooks/useCBTHistory";
import { format } from "date-fns";
import { CheckmarkBadge01Icon, Time02Icon } from "@hugeicons/core-free-icons";

interface StatusInfo {
  label: string;
  isComplete: boolean;
  badgeColor: string;
  badgeBg: string;
  xpEarned: number;
}

function formatStatus(status: string, type: string): StatusInfo {
  const xp: number =
    XP_MAP[
    type === "catcher"
      ? "thought-catcher"
      : type === "reframing"
        ? "thought-reframing"
        : "gratitude-reframe"
    ] ?? 10;

  if (
    status === "checker_completed" ||
    status === "completed" ||
    status === "summary"
  ) {
    return {
      label: "Completed",
      isComplete: true,
      badgeColor: "#047857",
      badgeBg: "#D1FAE5",
      xpEarned: xp,
    };
  } else if (status === "catcher_completed") {
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

function LogCard({
  item,
  onPress,
}: {
  item: HistoryLogItem;
  onPress: (item: HistoryLogItem) => void;
}): React.JSX.Element {
  const { label, isComplete, badgeColor, badgeBg, xpEarned } = formatStatus(
    item.status,
    item.type,
  );
  const titleStr: string =
    item.title && item.title.trim().length > 0
      ? item.title
      : "Untitled Session";

  const typeLabels: Record<string, string> = {
    catcher: "Thought Catcher",
    reframing: "Thought Reframing",
    gratitude: "Gratitude Reframe",
  };
  const typeIcons: Record<string, string> = {
    catcher: "💡",
    reframing: "�",
    gratitude: "🌱",
  };

  const typeLabel: string = typeLabels[item.type] ?? item.type;
  const typeIcon: string = typeIcons[item.type] ?? "📝";

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
        {/* Icon tile */}
        <View
          className="h-12 w-12 rounded-2xl items-center justify-center mr-3"
          style={{ backgroundColor: badgeBg }}
        >
          <Text className="text-[24px]">{typeIcon}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-0.5">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {typeLabel}
            </Text>
            <Text className="text-xs text-slate-400">
              {format(new Date(item.date), "MMM d, h:mm a")}
            </Text>
          </View>

          <Text
            className="text-[15px] font-extrabold text-slate-800 mb-1.5"
            numberOfLines={1}
          >
            {titleStr}
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

// ---------------------------------------------------------------------------
// ExercisesScreen — container with Duolingo-style tabs
// ---------------------------------------------------------------------------
type TabKey = "discover" | "log";

export default function ExercisesScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const { data: history = [], isLoading: isLoadingHistory } = useCBTHistory();

  const completedCount: number = history.filter(
    (h: HistoryLogItem) =>
      h.status === "completed" ||
      h.status === "summary" ||
      h.status === "checker_completed",
  ).length;

  const handleExercisePress = useCallback((exercise: CBTExercise): void => {
    const route: string | undefined = ROUTE_MAP[exercise.id];
    if (route) {
      router.push(route as never);
    } else {
      AccessibilityInfo.announceForAccessibility(
        `${exercise.title} is coming soon.`,
      );
    }
  }, []);

  const hasExercises: boolean = CBT_EXERCISES.length > 0;

  const handleLogPress = useCallback((item: HistoryLogItem): void => {
    if (item.type === "catcher") {
      router.push(`/tabs/screens/thought-checker?id=${item.id}`);
    } else if (item.type === "reframing") {
      router.push(`/tabs/screens/thought-reframing?id=${item.id}`);
    } else if (item.type === "gratitude") {
      router.push(`/tabs/screens/gratitude-reframe?id=${item.id}`);
    }
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top"]}
    >
      {/* ── Header ── */}
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

        {/* Duolingo-style pill tabs */}
        <View className="flex-row bg-slate-100 rounded-xl p-1">
          {(["discover", "log"] as const).map((tab: TabKey) => {
            const isActive: boolean = activeTab === tab;
            const label: string = tab === "discover" ? "Lessons" : "My Log";
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                className={`flex-1 py-2.5 rounded-lg items-center justify-center ${isActive ? "bg-white" : ""
                  }`}
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
                  className={`text-sm font-extrabold ${isActive ? "text-slate-800" : "text-slate-400"
                    }`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "discover" ? (
          <>
            {hasExercises ? (
              <View>
                {CBT_EXERCISES.map((exercise: CBTExercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onPress={handleExercisePress}
                  />
                ))}
              </View>
            ) : (
              <EmptyState />
            )}
          </>
        ) : (
          <View>
            {isLoadingHistory ? (
              <View className="py-12 items-center">
                <Text className="text-sm font-bold text-slate-400">
                  Loading history…
                </Text>
              </View>
            ) : history.length > 0 ? (
              history.map((item: HistoryLogItem) => (
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
                  Your CBT journal
                </Text>
                <Text className="text-sm text-slate-400 text-center leading-relaxed">
                  Complete your first lesson to see it here!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
