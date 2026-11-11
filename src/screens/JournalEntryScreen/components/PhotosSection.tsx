import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation("journal");
    return (
      <View className="mb-6">
        <Text className="text-happy-label-2 text-xs uppercase font-semibold tracking-wider mb-2">
          {t("entryDetail.photos")}
        </Text>

        <View className="flex-row flex-wrap gap-4">
          {photos.map((photo, index) => (
            <View
              key={index}
              className="w-20 h-20 rounded-lg overflow-hidden bg-happy-surface-2 border border-happy-sep"
            >
              <Image source={{ uri: photo }} className="w-full h-full" />
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {}}
            className="w-20 h-20 rounded-lg bg-happy-surface-2 border border-happy-sep items-center justify-center"
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t("entryDetail.addPhoto")}
          >
            <Feather name="plus" size={32} className="text-happy-label-2" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

PhotosSection.displayName = "PhotosSection";
