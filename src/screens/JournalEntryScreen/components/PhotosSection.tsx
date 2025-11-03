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
export const PhotosSection = React.memo<PhotosSectionProps>(({
  photos,
  isEditing,
  onAddPhoto,
}: PhotosSectionProps) => {
  return (
    <View className="mb-6">
      <Text className="text-gray-400 text-xs uppercase tracking-wider mb-3">
        PHOTOS TO REMEMBER
      </Text>
      
      <View className="flex-row flex-wrap gap-3">
        {photos.map((photo, index) => (
          <View key={index} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <Image source={{ uri: photo }} className="w-full h-full" />
          </View>
        ))}
        
        <TouchableOpacity
          onPress={() => {
            // This would trigger photo picker
            console.log("Add photo");
          }}
          className="w-20 h-20 rounded-lg bg-gray-100 items-center justify-center"
          activeOpacity={0.7}
        >
          <Feather name="plus" size={32} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

PhotosSection.displayName = "PhotosSection";
