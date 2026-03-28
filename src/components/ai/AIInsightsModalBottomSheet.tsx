import React, { forwardRef, useMemo } from "react";
import { View, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Text } from "@/components/ui/text";
import SuspensLoader from "@/src/components/SuspensLoader";

// Lazy load heavy component
const WeekyScreenAIWrapper = React.lazy(
  () => import("@/src/screens/DailyNotesScreen/components/WeekyScreenAIWrapper")
);

interface AIInsightsModalBottomSheetProps {
  weekStart: string;
  weekEnd: string;
  onClose?: () => void;
}

/**
 * Presentational bottom sheet component for displaying AI weekly insights
 * Uses Gorhom BottomSheetModal to appear above bottom tabs
 */
export const AIInsightsModalBottomSheet = forwardRef<
  BottomSheetModal,
  AIInsightsModalBottomSheetProps
>(({ weekStart, weekEnd, onClose }, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onDismiss={onClose}
      backgroundStyle={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#D1D5DB",
        width: 40,
        height: 5,
      }}
      backdropComponent={renderBackdrop}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start px-5 pb-4 pt-2 border-b border-gray-100">
        <View className="flex-1 flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center">
            <HugeiconsIcon icon={SparklesIcon} size={20} color="#7B61FF" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-cormorantSemiBold text-theme-text-primary tracking-tight">
              AI Weekly Insights
            </Text>
            <Text className="text-sm text-gray-500 font-medium mt-0.5">
              {weekStart} - {weekEnd}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onClose}
          className="w-11 h-11 items-center justify-center rounded-full active:bg-gray-100"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={24} color="#6B7280" />
        </Pressable>
      </View>

      {/* Content */}
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 100,
          minHeight: 600,
        }}
      >
        <SuspensLoader>
          <WeekyScreenAIWrapper />
        </SuspensLoader>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

AIInsightsModalBottomSheet.displayName = "AIInsightsModalBottomSheet";
