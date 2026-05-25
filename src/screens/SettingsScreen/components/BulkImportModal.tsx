import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
// FIX #26: Replaced @expo/vector-icons Feather with HugeiconsIcon (consistent icon system)
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Calendar01Icon,
  Download02Icon,
} from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { INK_MUTED, SAGE } from "@/lib/tokens";

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
  // FIX #27: Memoize import progress percentage
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
      // FIX #28: Accessibility for screen readers
      accessibilityViewIsModal={true}
    >
      <BlurView
        intensity={20}
        tint="dark"
        className="flex-1 justify-center items-center px-5"
      >
        <View className="happy-brand-raised-panel w-full max-w-[400px] overflow-hidden rounded-[28px]">
          {/* FIX #30: Header strip with violet background for visual hierarchy */}
          <View className="rounded-t-[28px] border-b border-sage-100 bg-sage-50 px-6 pb-4 pt-6">
            <View className="flex-row items-center gap-3 mb-1">
              <View className="h-10 w-10 items-center justify-center rounded-[16px] bg-sage-pill">
                <HugeiconsIcon
                  icon={Download02Icon}
                  size={18}
                  color={SAGE[600]}
                  strokeWidth={1.8}
                />
              </View>
              {/* FIX #31: Title uses font-black instead of font-extrabold */}
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
                {/* FIX #26: HugeiconsIcon instead of Feather */}
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={18}
                  color={SAGE[600]}
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
                // FIX #32: placeholder text color
                placeholderTextColor={INK_MUTED}
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

            {/* FIX #33: Progress bar instead of just ActivityIndicator + text */}
            {importing && (
              <View className="mb-4 items-center">
                <ActivityIndicator size="small" color={SAGE[600]} />
                <Text className="happy-font-body-medium text-[13px] text-ink-muted mt-2 mb-2">
                  Importing {progress.current} of {progress.total}...
                </Text>
                {/* Progress bar */}
                <View className="w-full h-1.5 bg-sage-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-sage-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </View>
                <Text className="happy-font-body-bold text-[11px] text-sage-600 mt-1">
                  {progressPercent}%
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-sage-pill rounded-2xl py-3.5 items-center justify-center"
                onPress={onClose}
                disabled={importing}
                style={{ opacity: importing ? 0.5 : 1 }}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text className="happy-font-body-bold text-base text-ink-soft">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="happy-brand-primary-cta flex-1 rounded-2xl overflow-hidden py-3.5 items-center justify-center"
                onPress={onImport}
                disabled={importing}
                accessibilityRole="button"
                accessibilityLabel={importing ? "Importing" : "Start import"}
                style={{ opacity: importing ? 0.65 : 1 }}
              >
                <Text className="happy-font-body-bold text-base text-brand-surface">
                  {importing ? "Importing…" : "Import"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};
