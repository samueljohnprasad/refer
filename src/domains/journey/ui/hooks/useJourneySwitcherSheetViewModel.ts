import { useMemo, useCallback, useRef, useEffect } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import type { JourneySwitcherItem } from "@/src/types/journey";

export interface JourneySwitcherSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: JourneySwitcherItem[];
  onSwitchJourney: (slug: string) => void;
  onDiscoverPress: () => void;
  onArchive?: (slug: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  blue: "#3B82F6",
  green: "#22C55E",
  purple: "#8B5CF6",
  red: "#EF4444",
  orange: "#F97316",
  teal: "#14B8A6",
  pink: "#EC4899",
  indigo: "#6366F1",
};

export function getSchemeColor(colorScheme: string): string {
  return COLOR_MAP[colorScheme] ?? "#7B61FF";
}

const ARCHIVE_THRESHOLD: number = -80;

export interface JourneyRowProps {
  item: JourneySwitcherItem;
  onPress: (slug: string) => void;
  onArchive?: (slug: string) => void;
}

export function useJourneyRowViewModel({
  item,
  onPress,
  onArchive,
}: JourneyRowProps) {
  const accentColor: string = getSchemeColor(item.colorScheme);
  const isCompleted: boolean = item.status === "completed";
  const translateX = useSharedValue<number>(0);

  const handlePress = useCallback((): void => {
    onPress(item.slug);
  }, [onPress, item.slug]);

  const triggerArchive = useCallback((): void => {
    onArchive?.(item.slug);
  }, [onArchive, item.slug]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd(() => {
      if (translateX.value < ARCHIVE_THRESHOLD) {
        translateX.value = withSpring(-200, {
          damping: 20,
          stiffness: 100,
          overshootClamping: true,
        });
        runOnJS(triggerArchive)();
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 100,
          overshootClamping: true,
        });
      }
    });

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const archiveRevealStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -20 ? 1 : 0,
  }));

  return {
    accentColor,
    isCompleted,
    handlePress,
    panGesture,
    rowAnimatedStyle,
    archiveRevealStyle,
    item,
  };
}

export function useJourneySwitcherSheetViewModel({
  isOpen,
  onClose,
  items,
  onSwitchJourney,
  onDiscoverPress,
  onArchive,
}: JourneySwitcherSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["90%"], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback(
    (index: number): void => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const handleSwitchAndClose = useCallback(
    (slug: string): void => {
      onSwitchJourney(slug);
      onClose();
    },
    [onSwitchJourney, onClose],
  );

  const activeItems: JourneySwitcherItem[] = items.filter(
    (i: JourneySwitcherItem) => i.status === "active",
  );
  const completedItems: JourneySwitcherItem[] = items.filter(
    (i: JourneySwitcherItem) => i.status === "completed",
  );

  return {
    bottomSheetRef,
    snapPoints,
    handleSheetChanges,
    handleSwitchAndClose,
    activeItems,
    completedItems,
    items,
    onDiscoverPress,
    onArchive,
  };
}
