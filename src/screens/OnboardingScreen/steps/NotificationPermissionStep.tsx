import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OptionCard from "../components/OptionCard";
import NotificationPreview from "../components/NotificationPreview";
import { NotificationTime } from "../types";
import { NOTIFICATION_TIMES } from "../constants";

interface NotificationPermissionStepProps {
  selectedTime?: NotificationTime;
  onSelectTime: (time: NotificationTime) => void;
  stressTiming?: string;
}

const TIMING_TO_DEFAULT: Record<string, NotificationTime> = {
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "evening",
};

const NotificationPermissionStep: React.FC<NotificationPermissionStepProps> = ({
  selectedTime,
  onSelectTime,
  stressTiming,
}) => {
  const suggestedTime = stressTiming
    ? TIMING_TO_DEFAULT[stressTiming]
    : "evening";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-6"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="text-[26px] leading-[1.1] text-ink"
        >
          When should Mochi remind you?
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          A gentle nudge — never annoying.{" "}
          {stressTiming && (
            <Text className="italic">You picked {stressTiming}s earlier.</Text>
          )}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-5"
      >
        <NotificationPreview
          time={
            NOTIFICATION_TIMES.find((t) => t.id === suggestedTime)?.time ??
            "7:00 PM"
          }
        />
      </Animated.View>

      <View className="mt-5 gap-3">
        {NOTIFICATION_TIMES.map((option, index) => (
          <OptionCard
            key={option.id}
            option={{
              id: option.id,
              emoji:
                option.id === "morning"
                  ? "🌅"
                  : option.id === "afternoon"
                    ? "☀️"
                    : "🌆",
              title: option.label,
              subtitle: option.time,
            }}
            isSelected={selectedTime === option.id}
            onSelect={() => onSelectTime(option.id)}
            index={index}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default React.memo(NotificationPermissionStep);
