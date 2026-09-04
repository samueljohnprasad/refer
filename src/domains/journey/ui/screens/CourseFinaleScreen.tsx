import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";
import { SafeAreaView } from "@/src/components/tw";
import { Button } from "@/src/components/ui/Button";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { useReducedMotion } from "react-native-reanimated";
import { MotiView } from 'moti';
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES } from "@/lib/haptics/hapticConfig";

export interface CourseFinaleScreenProps {
  courseTitle: string;
  acknowledgement: string;
  capabilitySummary: string[];
  onDismiss: () => void;
}

export function CourseFinaleScreen({
  courseTitle,
  acknowledgement,
  capabilitySummary,
  onDismiss,
}: CourseFinaleScreenProps): React.JSX.Element {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => {
      triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM);
    }, 450); // Matches the badge settling moment (delay 150 + duration ~300)
    return () => clearTimeout(timer);
  }, [reduceMotion]);
  
  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-brand-canvas" accessibilityViewIsModal={true} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 64, justifyContent: "flex-start" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8 mt-4">
          <MotiView
            from={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 150 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: SEMANTIC_COLORS.brand.soft as string,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16, // Proximity: groups with Course Complete
            }}
          >
            <Feather name="award" size={36} color={SEMANTIC_COLORS.brand.primary as string} />
          </MotiView>
          
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300, delay: 350 }}
          >
            <Text
              className="text-3xl font-extrabold text-ink text-center mb-1"
              accessibilityRole="header"
            >
              Course Complete
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300, delay: 500 }}
          >
            <Text className="text-base font-medium text-brand-strong text-center mb-8">
              {courseTitle}
            </Text>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 650 }}
          >
            <Text className="text-base text-ink text-center leading-6 mb-12">
              {acknowledgement}
            </Text>
          </MotiView>

          <View className="w-full mb-8">
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 800 }}
            >
              <Text className="text-xs text-ink-muted font-bold tracking-wider uppercase mb-5">
                WHAT YOU'RE TAKING WITH YOU
              </Text>
            </MotiView>
            <View className="flex-col gap-5">
              {capabilitySummary.map((item, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateY: 4 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: 860 + (index * 60) }}
                  className="flex-row items-start"
                >
                  <View className="mt-1 mr-3 h-5 w-5 items-center justify-center rounded-full bg-[#d3e0cd]">
                    <Feather name="check" size={12} color={SEMANTIC_COLORS.brand.primary as string} />
                  </View>
                  <Text className="text-base text-ink flex-1 leading-6">{item}</Text>
                </MotiView>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300, delay: 1100 }}
        className="px-6 pb-6 pt-2"
      >
        <Button
          label="Back to Journey"
          onPress={onDismiss}
          variant="primary"
          fullWidth
        />
      </MotiView>
    </SafeAreaView>
  );
}
