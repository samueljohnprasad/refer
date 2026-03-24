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
import { LinearGradient } from "expo-linear-gradient";
// FIX #26: Replaced @expo/vector-icons Feather with HugeiconsIcon (consistent icon system)
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Calendar01Icon,
  Cancel01Icon,
  Download02Icon,
} from "@hugeicons/core-free-icons";
import { format } from "date-fns";

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
        <View
          className="bg-white rounded-3xl w-full max-w-[400px]"
          style={{
            // FIX #29: Explicit shadow instead of Tailwind shadow-lg (inconsistent on RN)
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          {/* FIX #30: Header strip with violet background for visual hierarchy */}
          <View className="bg-violet-50 rounded-t-3xl px-6 pt-6 pb-4 border-b border-violet-100">
            <View className="flex-row items-center gap-3 mb-1">
              <View className="w-9 h-9 rounded-xl bg-violet-100 items-center justify-center">
                <HugeiconsIcon
                  icon={Download02Icon}
                  size={18}
                  color="#7C5CFF"
                  strokeWidth={1.8}
                />
              </View>
              {/* FIX #31: Title uses font-black instead of font-extrabold */}
              <Text className="text-xl font-black text-gray-900">
                Bulk Import
              </Text>
            </View>
            <Text className="text-[13px] text-gray-500 leading-4">
              Import sample journal entries for testing
            </Text>
          </View>

          <View className="px-6 py-5">
            {/* Start Date */}
            <View className="mb-4">
              <Text className="text-[13px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Start Date
              </Text>
              <View className="flex-row items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 gap-2.5">
                {/* FIX #26: HugeiconsIcon instead of Feather */}
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={18}
                  color="#7C5CFF"
                  strokeWidth={1.8}
                />
                <Text className="text-base text-gray-900 font-medium">
                  {format(importStartDate, "MMM dd, yyyy")}
                </Text>
              </View>
              <Text className="text-[12px] text-gray-400 mt-1.5">
                Entries will be created from this date forward
              </Text>
            </View>

            {/* Number of Days */}
            <View className="mb-4">
              <Text className="text-[13px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Number of Days
              </Text>
              <TextInput
                className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-base text-gray-900 font-medium"
                value={importDaysCount}
                onChangeText={setImportDaysCount}
                keyboardType="number-pad"
                placeholder="20"
                // FIX #32: placeholder text color
                placeholderTextColor="#9CA3AF"
                maxLength={2}
                editable={!importing}
                accessibilityLabel="Number of days to import"
              />
              <Text className="text-[12px] text-gray-400 mt-1.5">
                {importDaysCount}{" "}
                {parseInt(importDaysCount) === 1 ? "entry" : "entries"} will be
                imported
              </Text>
            </View>

            {/* FIX #33: Progress bar instead of just ActivityIndicator + text */}
            {importing && (
              <View className="mb-4 items-center">
                <ActivityIndicator size="small" color="#7C5CFF" />
                <Text className="text-[13px] text-gray-500 mt-2 mb-2">
                  Importing {progress.current} of {progress.total}...
                </Text>
                {/* Progress bar */}
                <View className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </View>
                <Text className="text-[11px] text-violet-500 font-bold mt-1">
                  {progressPercent}%
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-2xl py-3.5 items-center justify-center"
                onPress={onClose}
                disabled={importing}
                style={{ opacity: importing ? 0.5 : 1 }}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text className="text-base font-semibold text-gray-500">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-2xl overflow-hidden"
                onPress={onImport}
                disabled={importing}
                accessibilityRole="button"
                accessibilityLabel={importing ? "Importing" : "Start import"}
                style={{ opacity: importing ? 0.65 : 1 }}
              >
                <LinearGradient
                  colors={["#7C5CFF", "#9C7CFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="py-3.5 items-center justify-center"
                >
                  <Text className="text-base font-bold text-white">
                    {importing ? "Importing…" : "Import"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};
