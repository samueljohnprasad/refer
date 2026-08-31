import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Calendar01Icon,
  Download02Icon,
} from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import StageProgressBar from "@/src/components/ui/StageProgressBar";

interface BulkImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: () => void;
  importing: boolean;
  progress: { current: number; total: number };
  importStartDate: Date;
  importDaysCount: string;
  setImportDaysCount: (count: string) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  visible,
  onClose,
  onImport,
  importing,
  progress,
  importStartDate,
  importDaysCount,
  setImportDaysCount,
}) => {
  const progressPercent =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => !importing && onClose()}
      accessibilityViewIsModal={true}
    >
      <BlurView
        intensity={20}
        tint="dark"
        className="flex-1 justify-center items-center px-5"
      >
        <Card
          variant="tile"
          radius="xl"
          showDepth={true}
          className="w-full max-w-[400px]"
          contentClassName="overflow-hidden"
        >
          {/* Header strip with violet background for visual hierarchy */}
          <View className="rounded-t-[28px] border-b border-sage-100 bg-sage-50 px-6 pb-4 pt-6">
            <View className="flex-row items-center gap-3 mb-1">
              <View className="h-10 w-10 items-center justify-center rounded-[16px] bg-sage-pill">
                <HugeiconsIcon
                  icon={Download02Icon}
                  size={18}
                  color={SEMANTIC_COLORS.brand.pressed}
                  strokeWidth={1.8}
                />
              </View>
              <Text className="happy-font-body-bold text-xl text-ink">
                Bulk Import
              </Text>
            </View>
            <Text className="happy-font-body-medium text-[13px] text-ink-muted leading-4">
              Import sample journal entries for testing
            </Text>
          </View>

          <View className="px-6 py-5">
            {/* Start Date */}
            <View className="mb-4">
              <Text className="happy-brand-eyebrow mb-1.5">
                Start Date
              </Text>
              <View className="flex-row items-center bg-sage-50 p-3.5 rounded-xl border border-sage-100 gap-2.5">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={18}
                  color={SEMANTIC_COLORS.brand.pressed}
                  strokeWidth={1.8}
                />
                <Text className="happy-font-body-medium text-base text-ink">
                  {format(importStartDate, "MMM dd, yyyy")}
                </Text>
              </View>
              <Text className="happy-font-body text-[12px] text-ink-muted mt-1.5">
                Entries will be created from this date forward
              </Text>
            </View>

            {/* Number of Days */}
            <View className="mb-4">
              <Text className="happy-brand-eyebrow mb-1.5">
                Number of Days
              </Text>
              <TextInput
                className="happy-font-body-medium bg-sage-50 p-3.5 rounded-xl border border-sage-100 text-base text-ink"
                value={importDaysCount}
                onChangeText={setImportDaysCount}
                keyboardType="number-pad"
                placeholder="20"
                placeholderTextColor={SEMANTIC_COLORS.text.tertiary}
                maxLength={2}
                editable={!importing}
                accessibilityLabel="Number of days to import"
              />
              <Text className="happy-font-body text-[12px] text-ink-muted mt-1.5">
                {importDaysCount}{" "}
                {parseInt(importDaysCount) === 1 ? "entry" : "entries"} will be
                imported
              </Text>
            </View>

            {/* Progress bar instead of just ActivityIndicator + text */}
            {importing && (
              <View className="mb-4 items-center">
                <ActivityIndicator size="small" color={SEMANTIC_COLORS.brand.pressed} />
                <Text className="happy-font-body-medium text-[13px] text-ink-muted mt-2 mb-2">
                  Importing {progress.current} of {progress.total}...
                </Text>
                {/* Progress bar */}
                <StageProgressBar
                  progress={progressPercent}
                  height={8}
                  fillColor={SEMANTIC_COLORS.brand.primary}
                  className="w-full"
                />
                <Text className="happy-font-body-bold text-[11px] text-sage-600 mt-1">
                  {progressPercent}%
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Button
                label="Cancel"
                variant="secondary"
                onPress={onClose}
                disabled={importing}
                fullWidth={false}
                className="flex-1"
              />
              <Button
                label={importing ? "Importing…" : "Import"}
                variant="primary"
                onPress={onImport}
                loading={importing}
                fullWidth={false}
                className="flex-1"
              />
            </View>
          </View>
        </Card>
      </BlurView>
    </Modal>
  );
};
