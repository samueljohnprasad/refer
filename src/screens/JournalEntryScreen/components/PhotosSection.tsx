import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

interface PhotosSectionProps {
  photos: string[];
  isEditing: boolean;
  onAddPhoto: (photo: string) => void;
}

/**
 * Photos section with add button
 * Minimal design matching screenshot
 */
export const PhotosSection = React.memo<PhotosSectionProps>(
  ({ photos, isEditing, onAddPhoto }: PhotosSectionProps) => {
    return (
      <View className="mb-6">
        <Text className="text-theme-text-secondary text-xs uppercase font-semibold tracking-wider mb-2">
          PHOTOS TO REMEMBER
        </Text>

        <View className="flex-row flex-wrap gap-4">
          {photos.map((photo, index) => (
            <View
              key={index}
              className="w-20 h-20 rounded-lg overflow-hidden bg-theme-background-secondary border border-theme-border/50"
            >
              <Image source={{ uri: photo }} className="w-full h-full" />
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {}}
            className="w-20 h-20 rounded-lg bg-theme-background-secondary border border-theme-border/50 items-center justify-center"
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add photo"
          >
            <Feather name="plus" size={32} className="text-theme-text-secondary" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

PhotosSection.displayName = "PhotosSection";
