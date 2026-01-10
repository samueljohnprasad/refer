import React from "react";
import { View, Text, TouchableOpacity, Share } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Share01Icon, StarIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { useReviewPrompt } from "@/src/hooks/useReviewPrompt";
import LottieView from "lottie-react-native";
import { fireryLove } from "@/assets/lottie";

interface StreakDisplayProps {
  onContinue?: () => void;
}

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ onContinue }) => {
  const { streakData, isLoading } = useStreakTracker();

  // Trigger review request at 1-day streak
  useReviewPrompt({
    currentStreak: streakData.currentStreak,
    enabled: true,
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🔥 I'm on a ${streakData.currentStreak} day streak! Keep journaling with me!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const completedDays = streakData.weeklyProgress.filter(Boolean).length;
  const isHalfwayToWeek = completedDays >= 3 && completedDays < 7;
  const isPerfectWeek = completedDays === 7;

  if (isLoading) {
    return null;
  }

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Fire Lottie with Streak Number */}
      <View className="items-center mb-8 justify-center">
        <View
          style={{
            width: 180,
            height: 180,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            source={fireryLove}
            autoPlay
            loop
            style={{ width: "100%", height: "100%", position: "absolute" }}
          />
          <Text
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "white",
              textShadowColor: "rgba(0, 0, 0, 0.5)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
              zIndex: 10,
              marginTop: 20, // Adjust based on lottie center visual
            }}
          >
            {streakData.currentStreak}
          </Text>
        </View>
        <Text className="text-2xl font-bold text-orange-500 mt-2">
          day streak!
        </Text>
      </View>

      {/* Weekly Calendar */}
      <View className="bg-gray-50 rounded-3xl p-6 w-full max-w-sm mb-6">
        {/* Days of Week */}
        <View className="flex-row justify-between mb-4">
          {DAYS_OF_WEEK.map((day, index) => (
            <Text
              key={day}
              className={`text-sm font-semibold ${
                streakData.weeklyProgress[index]
                  ? "text-orange-500"
                  : "text-gray-400"
              }`}
              style={{ width: 36, textAlign: "center" }}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Progress Circles */}
        <View className="flex-row justify-between items-center">
          {streakData.weeklyProgress.map((completed, index) => (
            <View
              key={index}
              className="items-center justify-center"
              style={{ width: 36, height: 36 }}
            >
              {index === 6 ? (
                // Star for Sunday (end of week)
                <View
                  className={`w-9 h-9 rounded-full items-center justify-center ${
                    completed ? "bg-orange-400" : "bg-gray-300"
                  }`}
                >
                  <HugeiconsIcon icon={StarIcon} size={20} color="white" />
                </View>
              ) : completed ? (
                // Checkmark for completed days
                <View className="w-9 h-9 rounded-full bg-orange-400 items-center justify-center">
                  <HugeiconsIcon icon={Tick02Icon} size={20} color="white" />
                </View>
              ) : (
                // Empty circle for incomplete days
                <View className="w-9 h-9 rounded-full bg-gray-300" />
              )}
            </View>
          ))}
        </View>

        {/* Progress Message */}
        {isHalfwayToWeek && !isPerfectWeek && (
          <Text className="text-center mt-4 text-sm text-gray-600">
            You're halfway to your{" "}
            <Text className="font-bold text-orange-500">perfect week!</Text>
          </Text>
        )}
        {isPerfectWeek && (
          <Text className="text-center mt-4 text-sm font-bold text-orange-500">
            🎉 Perfect week achieved!
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View className="w-full max-w-sm space-y-4">
        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          className="flex-row items-center justify-center py-3"
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={Share01Icon} size={20} color="#3B82F6" />
          <Text className="ml-2 text-blue-500 font-semibold">Share</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        {onContinue && (
          <TouchableOpacity
            onPress={onContinue}
            className="bg-purple-500 rounded-2xl py-4 items-center"
            activeOpacity={0.8}
            style={{
              shadowColor: "#8B5CFC",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white text-lg font-bold">CONTINUE</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
