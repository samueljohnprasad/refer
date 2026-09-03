import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { SvgAppButton } from "@/src/domains/journey/ui/components/svg-app-button";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { useReducedMotion } from "react-native-reanimated";

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
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-brand-canvas" accessibilityViewIsModal={true} >
      <ConfettiExplosion
        isVisible={!reduceMotion}
        count={50}
        duration={1500}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#FEF3C7",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 4,
              borderColor: "#F59E0B",
              marginBottom: 24,
            }}
          >
            <Text className="text-5xl">👑</Text>
          </View>
          
          <Text
            className="text-3xl font-extrabold text-ink text-center mb-2"
            accessibilityRole="header"
          >
            Course Complete
          </Text>
          <Text className="text-lg font-bold text-brand-strong text-center mb-6">
            {courseTitle}
          </Text>
          
          <Text className="text-base text-ink text-center leading-6 mb-8">
            {acknowledgement}
          </Text>

          <View className="w-full bg-brand-soft p-6 rounded-2xl mb-8">
            <Text className="text-base text-ink font-bold mb-4">
              You now have the tools to:
            </Text>
            <View className="flex-col gap-3">
              {capabilitySummary.map((item, index) => (
                <View key={index} className="flex-row items-start pr-4">
                  <Text className="text-brand-strong mr-3 mt-1 font-extrabold">•</Text>
                  <Text className="text-base text-ink font-semibold leading-5">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-6 pt-2">
        <SvgAppButton
          width="100%"
          height={56}
          color="#45A802"
          backgroundColor="#58CC02"
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Done"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: APP_FONT_FAMILIES.semiBold,
              fontSize: 18,
            }}
          >
            Done
          </Text>
        </SvgAppButton>
      </View>
    </SafeAreaView>
  );
}
