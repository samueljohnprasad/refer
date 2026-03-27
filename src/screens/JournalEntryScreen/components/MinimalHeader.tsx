import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formattedDateTime } from "@/src/utils/date";

interface MinimalHeaderProps {
  isEditing: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDone: () => void;
  date?: string | null;
}

/**
 * Ultra-minimal header component with clean design
 * Features thin typography and professional spacing
 */
export const MinimalHeader = React.memo<MinimalHeaderProps>(
  ({ isEditing, onClose, onEdit, onDone, date }: MinimalHeaderProps) => {
    return (
      <View className="flex-row items-center justify-between px-4 py-4 mb-4">
        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close"
          accessibilityHint="Closes the journal entry"
        >
          <Feather name="x" size={24} className="text-theme-text-primary" />
        </TouchableOpacity>

        {/* Date/Time */}
        <View className="flex-1 items-center">
          <Text className="text-theme-text-primary text-base font-cormorantBold">Today</Text>
          <Text className="text-theme-text-secondary text-xs mt-0.5">
            {formattedDateTime(date)}
          </Text>
        </View>

        {/* Edit/Done button */}
        <TouchableOpacity
          onPress={isEditing ? onDone : onEdit}
          className="px-4 py-2 -mr-4"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? "Done editing" : "Edit journal"}
        >
          <Text className="text-theme-text-primary text-base font-medium">
            {isEditing ? "Done" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

MinimalHeader.displayName = "MinimalHeader";
