import React from "react";
import { View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";
import { SafeAreaView } from "@/src/components/tw";
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
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#FEF3C7",
              alignItems: "center",
              justifyContent: "center",
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
          <Text className="text-lg font-semibold text-brand-strong text-center mb-6">
            {courseTitle}
          </Text>
          
          <Text className="text-base text-ink text-center leading-6 mb-8">
            {acknowledgement}
          </Text>

          <View className="w-full mb-8">
            <Text className="text-base text-ink font-bold mb-4">
              You now have the tools to:
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
