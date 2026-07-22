import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Feather } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import type { JourneySwitcherItem } from "@/src/types/journey";
import {
  useJourneyRowViewModel,
  useJourneySwitcherSheetViewModel,
  type JourneyRowProps,
  type JourneySwitcherSheetProps,
} from "../hooks/useJourneySwitcherSheetViewModel";

export interface JourneyRowViewProps
  extends ReturnType<typeof useJourneyRowViewModel> {}

/**
 * Presentational View component for JourneyRow.
 * Consists strictly of JSX code without internal hooks.
 */
export const JourneyRowView = React.memo(function JourneyRowView({
  accentColor,
  isCompleted,
  handlePress,
  panGesture,
  rowAnimatedStyle,
  archiveRevealStyle,
  item,
}: JourneyRowViewProps): React.JSX.Element {
  return (
    <View className="relative mb-3">
      <Animated.View
        className="absolute right-0 top-0 bottom-0 w-20 rounded-2xl bg-red-500 items-center justify-center"
        style={archiveRevealStyle}
      >
        <Feather name="archive" size={20} color="white" />
        <Text className="text-xs font-semibold text-white mt-1">Hide</Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={rowAnimatedStyle}>
          <Pressable
            onPress={handlePress}
            className={`flex-row items-center px-5 py-4 rounded-2xl bg-brand-surface ${
              item.isActive ? "border-2" : "border border-gray-100"
            }`}
            style={item.isActive ? { borderColor: accentColor } : undefined}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${
              item.progressPercent
            }% complete${
              item.isActive ? ". Currently active" : ""
            }. Swipe left to hide.`}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              {isCompleted ? (
                <Feather name="check-circle" size={20} color={accentColor} />
              ) : (
                <View
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </View>

            <View className="flex-1 mr-3">
              <View className="flex-row items-center gap-2">
                <Text
                  className={`text-base font-bold ${
                    item.isActive ? "text-ink" : "text-ink"
                  }`}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {item.isActive && (
                  <View
                    className="px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: accentColor }}
                    >
                      Active
                    </Text>
                  </View>
                )}
              </View>

              <Text
                className="text-sm text-ink-muted mt-0.5"
                numberOfLines={1}
              >
                {isCompleted
                  ? "Completed"
                  : item.currentUnitTitle ?? `${item.progressPercent}% complete`}
              </Text>

              {!isCompleted && (
                <View className="h-1.5 bg-sage-50 rounded-full mt-2">
                  <View
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${Math.max(item.progressPercent, 2)}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </View>
              )}
            </View>

            <Text
              className="text-sm font-semibold"
              style={{ color: isCompleted ? "#22C55E" : accentColor }}
            >
              {item.progressPercent}%
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

function JourneyRow(props: JourneyRowProps): React.JSX.Element {
  const viewModel = useJourneyRowViewModel(props);
  return <JourneyRowView {...viewModel} />;
}

function ModalBackdrop(props: BottomSheetBackdropProps): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior="close"
    />
  );
}

export interface JourneySwitcherSheetViewProps
  extends ReturnType<typeof useJourneySwitcherSheetViewModel> {}

/**
 * Presentational View for JourneySwitcherSheet.
 * Consists strictly of JSX code without internal hooks.
 */
export const JourneySwitcherSheetView = React.memo(
  function JourneySwitcherSheetView({
    bottomSheetRef,
    snapPoints,
    handleSheetChanges,
    handleSwitchAndClose,
    activeItems,
    completedItems,
    items,
    onDiscoverPress,
    onArchive,
  }: JourneySwitcherSheetViewProps): React.JSX.Element {
    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={ModalBackdrop}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{ backgroundColor: "#E2E8F0" }}
      >
        <View className="flex-row items-center justify-between px-6 py-6 border-b border-gray-100">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center">
              <Text className="text-lg">🏳️</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-ink">My Journeys</Text>
              <Text className="text-sm text-ink-soft">
                {items.length} {items.length === 1 ? "journey" : "journeys"}{" "}
                enrolled
              </Text>
            </View>
          </View>
        </View>

        <BottomSheetScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {activeItems.length > 0 && (
            <View className="pt-5">
              <Text className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3 px-1">
                In Progress
              </Text>
              {activeItems.map((item: JourneySwitcherItem) => (
                <JourneyRow
                  key={item.slug}
                  item={item}
                  onPress={handleSwitchAndClose}
                  onArchive={onArchive}
                />
              ))}
            </View>
          )}

          {completedItems.length > 0 && (
            <View className="pt-4">
              <Text className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3 px-1">
                Completed
              </Text>
              {completedItems.map((item: JourneySwitcherItem) => (
                <JourneyRow
                  key={item.slug}
                  item={item}
                  onPress={handleSwitchAndClose}
                  onArchive={onArchive}
                />
              ))}
            </View>
          )}

          {items.length === 0 && (
            <View className="items-center justify-center py-20">
              <View className="w-20 h-20 rounded-full bg-sage-50 items-center justify-center mb-4">
                <Feather name="map" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-semibold text-ink mb-2">
                No Journeys Yet
              </Text>
              <Text className="text-sm text-ink-soft text-center px-8">
                Start your first journey to begin tracking your progress
              </Text>
            </View>
          )}

          <Pressable
            onPress={onDiscoverPress}
            className="mt-6 mb-4 bg-purple-600 rounded-2xl py-4 px-6 flex-row items-center justify-center gap-2"
            accessibilityRole="button"
            accessibilityLabel="Discover new journeys"
          >
            <Feather name="compass" size={18} color="white" />
            <Text className="text-base font-bold text-white">
              Discover New Journeys
            </Text>
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

/**
 * Container component for JourneySwitcherSheet.
 */
export function JourneySwitcherSheet(
  props: JourneySwitcherSheetProps,
): React.JSX.Element {
  const viewModel = useJourneySwitcherSheetViewModel(props);
  return <JourneySwitcherSheetView {...viewModel} />;
}

export default React.memo(JourneySwitcherSheet);
