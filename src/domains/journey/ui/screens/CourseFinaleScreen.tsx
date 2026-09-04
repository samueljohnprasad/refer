import React from "react";
import { View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";
import { SafeAreaView } from "@/src/components/tw";
import { Button } from "@/src/components/ui/Button";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { useReducedMotion } from "react-native-reanimated";
import { MotiView } from 'moti';

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
  
  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-brand-canvas" accessibilityViewIsModal={true} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ConfettiExplosion
        isVisible={!reduceMotion}
        count={50}
        duration={1500}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 100 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: SEMANTIC_COLORS.brand.soft as string,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Feather name="award" size={36} color={SEMANTIC_COLORS.brand.primary as string} />
          </MotiView>
          
          <Text
            className="text-3xl font-extrabold text-ink text-center mb-2"
            accessibilityRole="header"
          >
            Course Complete
          </Text>
          <Text className="text-base font-medium text-brand-strong text-center mb-6">
            {courseTitle}
          </Text>
          
          <Text className="text-base text-ink text-center leading-6 mb-8">
            {acknowledgement}
          </Text>

          <View className="w-full mb-8">
            <Text className="text-xs text-ink-muted font-bold tracking-widest uppercase mb-4">
              WHAT YOU'RE TAKING WITH YOU
            </Text>
            <View className="flex-col gap-4">
              {capabilitySummary.map((item, index) => (
                <View key={index} className="flex-row items-start">
                  <View className="mt-1 mr-3 h-4 w-4 items-center justify-center rounded-full bg-brand-soft">
                    <Feather name="check" size={10} color={SEMANTIC_COLORS.brand.primary as string} />
                  </View>
                  <Text className="text-base text-ink flex-1 leading-6">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-6 pt-2">
        <Button
          label="BACK TO JOURNEY"
          onPress={onDismiss}
          variant="primary"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
