import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, Modal, SafeAreaView, ScrollView } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, ChartHistogramIcon } from "@hugeicons/core-free-icons";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import SuspensLoader from "@/src/components/SuspensLoader";

// Static imports to avoid Metro bundler React.lazy chunk resolution crashes
import WeekyScreenAIWrapper from "@/src/screens/DailyNotesScreen/components/WeekyScreenAIWrapper";

export interface AIInsightsModalRef {
  present: () => void;
  dismiss: () => void;
}

interface AIInsightsModalBottomSheetProps {
  weekStart: string;
  weekEnd: string;
  onClose?: () => void;
}

/**
 * Presentational full-screen modal component for displaying weekly insights
 * Refactored from BottomSheet to a dedicated native modal for better UX
 */
export const AIInsightsModalBottomSheet = forwardRef<
  AIInsightsModalRef,
  AIInsightsModalBottomSheetProps
>(({ weekStart, weekEnd, onClose }, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => setVisible(true),
    dismiss: () => {
      setVisible(false);
    },
  }));

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-brand-surface">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row justify-between items-start px-5 pb-4 pt-4 border-b border-brand-border/20">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-brand-surface-raised items-center justify-center border border-brand-border/30">
                <HugeiconsIcon icon={ChartHistogramIcon} size={20} color="#374151" className="text-brand-ink" />
              </View>
              <View className="flex-1">
                <Text variant="h2">
                  Weekly Insights
                </Text>
                <Text variant="caption-muted" className="mt-0.5">
                  {weekStart} - {weekEnd}
                </Text>
              </View>
            </View>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleClose}
              fullWidth={false}
              width={44}
              leftIcon={<HugeiconsIcon icon={Cancel01Icon} size={24} color="#6B7280" className="text-brand-ink-muted" />}
            />
          </View>

          {/* Content */}
          <ScrollView
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
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
});

AIInsightsModalBottomSheet.displayName = "AIInsightsModalBottomSheet";
