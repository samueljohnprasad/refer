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
import { Feather } from "@expo/vector-icons";
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
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => !importing && onClose()}
    >
      <BlurView
        intensity={20}
        tint="dark"
        className="flex-1 justify-center items-center px-5"
      >
        <View className="bg-white rounded-3xl p-6 w-full max-w-[400px] shadow-lg shadow-black/30">
          <Text className="text-2xl font-extrabold text-[#0F172A] mb-2">
            Bulk Import Journals
          </Text>
          <Text className="text-[15px] text-[#6B7280] mb-6">
            Import sample journal entries for testing
          </Text>

          <View className="mb-5">
            <Text className="text-[15px] font-semibold text-[#0F172A] mb-2">
              Start Date
            </Text>
            <View className="flex-row items-center bg-[#F8F8FF] p-3.5 rounded-xl border border-[#E6E6E6] gap-2.5">
              <Feather name="calendar" size={18} color="#7C5CFF" />
              <Text className="text-base text-[#0F172A] font-medium">
                {format(importStartDate, "MMM dd, yyyy")}
              </Text>
            </View>
            <Text className="text-[13px] text-[#6B7280] mt-1.5">
              Entries will be created from this date forward
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-[15px] font-semibold text-[#0F172A] mb-2">
              Number of Days (1-20)
            </Text>
            <TextInput
              className="bg-[#F8F8FF] p-3.5 rounded-xl border border-[#E6E6E6] text-base text-[#0F172A]"
              value={importDaysCount}
              onChangeText={setImportDaysCount}
              keyboardType="number-pad"
              placeholder="20"
              maxLength={2}
              editable={!importing}
            />
            <Text className="text-[13px] text-[#6B7280] mt-1.5">
              {importDaysCount}{" "}
              {parseInt(importDaysCount) === 1 ? "entry" : "entries"} will be
              imported
            </Text>
          </View>

          {importing && (
            <View className="items-center py-5">
              <ActivityIndicator size="large" color="#7C5CFF" />
              <Text className="text-[15px] text-[#6B7280] mt-3">
                Importing {progress.current} of {progress.total}...
              </Text>
            </View>
          )}

          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity
              className="flex-1 rounded-2xl overflow-hidden bg-[#F3F4F6] py-3.5 items-center justify-center"
              onPress={onClose}
              disabled={importing}
            >
              <Text className="text-base font-semibold text-[#6B7280]">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-2xl overflow-hidden ${
                importing ? "opacity-60" : ""
              }`}
              onPress={onImport}
              disabled={importing}
            >
              <LinearGradient
                colors={importing ? ["#999", "#777"] : ["#7C5CFF", "#9C7CFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-3.5 items-center justify-center rounded-2xl"
              >
                <Text className="text-base font-bold text-white">
                  {importing ? "Importing..." : "Import"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};
