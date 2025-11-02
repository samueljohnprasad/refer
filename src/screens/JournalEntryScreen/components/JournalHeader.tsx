import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import Animated from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { AnimatedBlurView } from "@/src/components/AnimatedLinearGradient";
import { PALETTE } from "../../JournalCalendarScreen/JournalCalendarScreen";
import { JournalHeaderProps } from "../types";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * Presentational header component for journal entry screen
 * Displays date/time, back/close and edit/done buttons with animations
 */
export const JournalHeader = React.memo<JournalHeaderProps>(
  ({
    isEditing,
    formattedDateTime,
    colorScheme,
    onClose,
    onEdit,
    onDone,
    backIconStyle,
    closeIconStyle,
  }: JournalHeaderProps) => {
    const { height } = useWindowDimensions();

    return (
      <AnimatedBlurView
        intensity={50}
        tint={colorScheme === "dark" ? "dark" : "light"}
        style={{
          height: height * 0.14,
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingHorizontal: 16,
          backgroundColor: "transparent",
          paddingBottom: 16,
          flexDirection: "row",
        }}
      >
        <AnimatedTouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center bg-[#7B61FF]"
          activeOpacity={0.7}
          onPress={onClose}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              },
              backIconStyle,
            ]}
          >
            <Feather name="arrow-left" size={20} color={PALETTE.white} />
          </Animated.View>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              },
              closeIconStyle,
            ]}
          >
            <Feather name="x" size={22} color="#fff" />
          </Animated.View>
        </AnimatedTouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="text-base font-extrabold text-typography-900 dark:text-typography-50">
            {formattedDateTime}
          </Text>
        </View>

        <AnimatedTouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center bg-[#7B61FF]"
          activeOpacity={0.7}
          onPress={isEditing ? onDone : onEdit}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              },
              backIconStyle,
            ]}
          >
            <Feather name="edit-3" size={22} color="#fff" />
          </Animated.View>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              },
              closeIconStyle,
            ]}
          >
            <Feather name="check" size={22} color="#fff" />
          </Animated.View>
        </AnimatedTouchableOpacity>
      </AnimatedBlurView>
    );
  }
);

JournalHeader.displayName = "JournalHeader";
