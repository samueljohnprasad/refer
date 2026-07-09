import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { isToday, isYesterday, format } from "date-fns";
import { Text } from "@/src/components/ui/Text";

interface MinimalHeaderProps {
  isEditing: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDone: () => void;
  onSave?: () => void;
  saving?: boolean;
  onDelete?: () => void;
  date?: string | null;
}

const getRelativeDayTitle = (dateStr?: string | null): string => {
  if (!dateStr) return "Today";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Today";
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEEE, MMM d");
};

const getFormattedTime = (dateStr?: string | null): string => {
  if (!dateStr) return "Reflection";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Reflection";
  return format(d, "h:mm a");
};

/**
 * Ultra-minimal header component with clean design
 * Features dynamic date typography and contextual management actions
 */
export const MinimalHeader = React.memo<MinimalHeaderProps>(
  ({
    isEditing,
    onClose,
    onEdit,
    onDone,
    onSave,
    saving = false,
    onDelete,
    date,
  }: MinimalHeaderProps) => {
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
          <Feather name="x" size={24} className="text-ink" />
        </TouchableOpacity>

        {/* Date/Time */}
        <View className="flex-1 items-center">
          <Text variant="body-bold">{getRelativeDayTitle(date)}</Text>
          <Text variant="caption" className="mt-0.5 text-ink-muted">
            {getFormattedTime(date)}
          </Text>
        </View>

        {/* Action buttons */}
        <View className="flex-row items-center gap-2 -mr-1">
          {onDelete && isEditing && (
            <TouchableOpacity
              onPress={onDelete}
              className="w-9 h-9 items-center justify-center rounded-full bg-red-50"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Delete entry"
            >
              <Feather name="trash-2" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={isEditing ? (onSave ?? onDone) : onEdit}
            disabled={saving}
            className={
              isEditing
                ? "bg-sage-700 px-4 py-2 rounded-full shadow-sm"
                : "px-3 py-2"
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? "Save journal entry" : "Edit journal"}
          >
            <Text
              variant="body-bold"
              className={isEditing ? "text-white text-[14px]" : "text-sage-700"}
            >
              {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

MinimalHeader.displayName = "MinimalHeader";
