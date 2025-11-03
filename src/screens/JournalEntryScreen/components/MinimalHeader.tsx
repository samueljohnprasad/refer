import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface MinimalHeaderProps {
  isEditing: boolean;
  formattedDateTime: string;
  onClose: () => void;
  onEdit: () => void;
  onDone: () => void;
}

/**
 * Ultra-minimal header component with clean design
 * Features thin typography and professional spacing
 */
export const MinimalHeader = React.memo<MinimalHeaderProps>(({
  isEditing,
  formattedDateTime,
  onClose,
  onEdit,
  onDone,
}: MinimalHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between px-5 py-4 mb-4">
      {/* Close button */}
      <TouchableOpacity
        onPress={onClose}
        className="w-10 h-10 items-center justify-center"
        activeOpacity={0.7}
      >
        <Feather name="x" size={24} color="#1F2937" />
      </TouchableOpacity>

      {/* Date/Time */}
      <View className="flex-1 items-center">
        <Text className="text-gray-900 text-base font-semibold">Today</Text>
        <Text className="text-gray-400 text-xs mt-0.5">{formattedDateTime}</Text>
      </View>

      {/* Edit/Done button */}
      <TouchableOpacity
        onPress={isEditing ? onDone : onEdit}
        className="px-4 py-2"
        activeOpacity={0.7}
      >
        <Text className="text-gray-900 text-base font-medium">
          {isEditing ? "Done" : "Edit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

MinimalHeader.displayName = "MinimalHeader";
