import React, { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { Button } from "@/src/components/ui/Button";

interface RecordActionClusterProps {
  onScanJournal: () => void;
  onOpenRecorder: () => void;
  onOpenKeyboard: () => void;
}

// ponytail: unified capture selector where both 3D tactile Button and labels respond to press
export const RecordActionCluster = React.memo<RecordActionClusterProps>(
  ({ onScanJournal, onOpenRecorder, onOpenKeyboard }) => {
    const handlePhotoPress = useCallback(() => {
      Haptics.selectionAsync();
      onScanJournal();
    }, [onScanJournal]);

    const handleVoicePress = useCallback(() => {
      Haptics.selectionAsync();
      onOpenRecorder();
    }, [onOpenRecorder]);

    const handleTextPress = useCallback(() => {
      Haptics.selectionAsync();
      onOpenKeyboard();
    }, [onOpenKeyboard]);

    return (
      <View className="flex-row items-start justify-center gap-8 pt-0 pb-1">
        {/* Photo Action Column */}
        <View className="items-center">
          <View className="h-[76px] items-center justify-center">
            <Button
              label=""
              variant="secondary"
              width={52}
              round
              fullWidth={false}
              accessibilityLabel="Add photo"
              leftIcon={
                <SymbolView
                  name="camera"
                  size={22}
                  weight="medium"
                  tintColor="#142414"
                />
              }
              onPress={handlePhotoPress}
            />
          </View>
          <Pressable
            onPress={handlePhotoPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Add photo"
            className="active:opacity-60"
          >
            <Text className="mt-2 text-[12px] text-[#736B63] happy-font-body-bold">
              Photo
            </Text>
          </Pressable>
        </View>

        {/* Primary Voice Action Column */}
        <View className="items-center">
          <View className="h-[76px] items-center justify-center">
            <Button
              label=""
              variant="primary"
              width={68}
              round
              fullWidth={false}
              accessibilityLabel="Record voice"
              haptic="light"
              leftIcon={
                <SymbolView
                  name="mic.fill"
                  size={30}
                  weight="medium"
                  tintColor="#ffffff"
                />
              }
              onPress={handleVoicePress}
            />
          </View>
          <Pressable
            onPress={handleVoicePress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Record voice"
            className="active:opacity-60"
          >
            <Text className="mt-2 text-[12px] text-[#2D4D28] happy-font-body-bold">
              Voice
            </Text>
          </Pressable>
        </View>

        {/* Text Action Column */}
        <View className="items-center">
          <View className="h-[76px] items-center justify-center">
            <Button
              label=""
              variant="secondary"
              width={52}
              round
              fullWidth={false}
              accessibilityLabel="Write text"
              leftIcon={
                <SymbolView
                  name="square.and.pencil"
                  size={22}
                  weight="medium"
                  tintColor="#142414"
                />
              }
              onPress={handleTextPress}
            />
          </View>
          <Pressable
            onPress={handleTextPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Write text"
            className="active:opacity-60"
          >
            <Text className="mt-2 text-[12px] text-[#736B63] happy-font-body-bold">
              Text
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

RecordActionCluster.displayName = "RecordActionCluster";


