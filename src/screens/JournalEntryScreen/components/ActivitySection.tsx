import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

interface ActivitySectionProps {
  activities: string[];
  isEditing: boolean;
  onAddActivity: (activity: string) => void;
  onRemoveActivity: (index: number) => void;
}

/**
 * Activity section with pills and add functionality
 * Clean design with minimal borders
 */
export const ActivitySection = React.memo<ActivitySectionProps>(({
  activities,
  isEditing,
  onAddActivity,
  onRemoveActivity,
}: ActivitySectionProps) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newActivity, setNewActivity] = useState<string>("");

  const handleAdd = (): void => {
    if (newActivity.trim()) {
      onAddActivity(newActivity.trim());
      setNewActivity("");
      setIsAdding(false);
    }
  };

  return (
    <View className="mb-6">
      <View className="flex-row flex-wrap gap-2">
        {activities.map((activity, index) => (
          <View
            key={index}
            className="flex-row items-center px-3 py-2 rounded-full bg-purple-100"
          >
            <Text className="text-purple-900 mr-2">🎮</Text>
            <Text className="text-gray-900 text-sm">{activity}</Text>
            {isEditing && (
              <TouchableOpacity
                onPress={() => onRemoveActivity(index)}
                className="ml-2 w-5 h-5 rounded-full bg-red-400 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-white text-xs font-bold">−</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isEditing && !isAdding && (
          <TouchableOpacity
            onPress={() => setIsAdding(true)}
            className="px-3 py-2 rounded-full border border-gray-300 border-dashed"
            activeOpacity={0.7}
          >
            <Text className="text-gray-500 text-sm">+ add activity</Text>
          </TouchableOpacity>
        )}

        {isEditing && isAdding && (
          <View className="flex-row items-center px-3 py-1 rounded-full border border-gray-400">
            <TextInput
              value={newActivity}
              onChangeText={setNewActivity}
              onSubmitEditing={handleAdd}
              onBlur={() => {
                if (!newActivity.trim()) {
                  setIsAdding(false);
                }
              }}
              placeholder="Enter activity"
              placeholderTextColor="#9CA3AF"
              className="text-gray-900 text-sm min-w-[100]"
              autoFocus
            />
          </View>
        )}
      </View>
    </View>
  );
});

ActivitySection.displayName = "ActivitySection";
