import React from "react";
import { ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "@/src/components/tw";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import type { CourseRewardContent } from "@/src/types/journeyV5";

interface CourseFinaleScreenProps {
  courseTitle: string;
  content: CourseRewardContent;
  isDismissing: boolean;
  onReview: () => void;
  onDismiss: () => void;
}

export function CourseFinaleScreen({
  courseTitle,
  content,
  isDismissing,
  onReview,
  onDismiss,
}: CourseFinaleScreenProps): React.JSX.Element {
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      className="flex-1 bg-brand-canvas"
      accessibilityViewIsModal
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6 pb-8 pt-14"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <View className="mb-5 h-24 w-24 items-center justify-center rounded-full bg-brand-soft">
            <Feather
              name="award"
              size={44}
              color={SEMANTIC_COLORS.brand.primary as string}
              accessibilityElementsHidden
            />
          </View>
          <Text
            className="text-center text-3xl font-extrabold text-ink"
            accessibilityRole="header"
          >
            {content.title}
          </Text>
          <Text className="mt-1 text-center text-lg font-bold text-brand-strong">
            {courseTitle}
          </Text>
          <Text className="mt-8 text-center text-base leading-6 text-ink">
            {content.acknowledgement}
          </Text>
        </View>

        <View className="my-10 rounded-3xl bg-white p-6">
          <Text className="mb-5 text-sm font-extrabold uppercase tracking-wider text-ink-muted">
            {content.capabilityHeading}
          </Text>
          <View className="gap-5">
            {content.capabilitySummary.map((capability) => (
              <View key={capability} className="flex-row items-start">
                <View className="mr-3 mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-brand-soft">
                  <Feather
                    name="check"
                    size={14}
                    color={SEMANTIC_COLORS.brand.primary as string}
                    accessibilityElementsHidden
                  />
                </View>
                <Text className="flex-1 text-base leading-6 text-ink">
                  {capability}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="gap-3 px-6 pb-4">
        <Button
          label={content.reviewActionLabel}
          onPress={onReview}
          variant="secondary"
          disabled={isDismissing}
          fullWidth
        />
        <Button
          label={content.doneActionLabel}
          onPress={onDismiss}
          variant="primary"
          loading={isDismissing}
          disabled={isDismissing}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
