import React from "react";
import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Fire02Icon } from "@hugeicons/core-free-icons";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { CARD_SHADOW } from "@/constants/shadows";

interface WeeklyStreakWidgetProps {
  onPress?: () => void;
}

export const WeeklyStreakWidget: React.FC<WeeklyStreakWidgetProps> = ({ onPress }) => {
  const { streakData, isLoading } = useStreakTracker();
  
  const currentStreak = streakData.currentStreak || 0;
  
  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <PressableScale
      onPress={onPress}
      scale={0.97}
      hapticStyle="light"
      style={[CARD_SHADOW, { borderRadius: 24 }]}
      accessibilityRole="button"
      accessibilityLabel={`Current streak: ${currentStreak} days`}
    >
      <View className="bg-white rounded-3xl p-5 flex-row items-center justify-between w-full">
        {/* Left Streak Number Box */}
        <View className="items-center justify-center pr-5 min-w-[75px]">
          <Text className="text-[42px] font-bold text-gray-800 leading-tight tracking-tighter">
            {isLoading ? "-" : currentStreak}
          </Text>
          <Text className="text-[10px] font-bold text-gray-400 tracking-widest mt-[-2px]">
            STREAK
          </Text>
        </View>

        {/* Right Weekly Grid */}
        <View className="flex-1 flex-row items-center justify-between pl-4 pr-1">
          {streakData.weeklyProgress.map((isCompleted, i) => {
            const isPrevCompleted = i > 0 && streakData.weeklyProgress[i - 1];
            const isNextCompleted = i < 6 && streakData.weeklyProgress[i + 1];
            
            return (
              <View key={i} className="flex-1 items-center relative py-1">
                {/* Connection Pill BGs */}
                {isCompleted && (
                  <View className="absolute top-1 bottom-1 flex-row w-full z-0 h-8 mt-[2px]">
                    <View className={`flex-1 h-full ${isPrevCompleted ? 'bg-pink-100' : 'bg-transparent'}`} />
                    <View className={`flex-1 h-full ${isNextCompleted ? 'bg-pink-100' : 'bg-transparent'}`} />
                  </View>
                )}
                
                {/* Day Circle */}
                <View 
                  className={`w-8 h-8 rounded-full items-center justify-center z-10 border ${
                    isCompleted ? 'bg-pink-100 border-pink-100' : 'border-transparent bg-gray-50'
                  }`}
                >
                  <HugeiconsIcon 
                    icon={Fire02Icon} 
                    size={16} 
                    color={isCompleted ? '#F43F5E' : '#D1D5DB'} 
                    fill={isCompleted ? '#F43F5E' : 'none'}
                  />
                </View>
                
                <Text 
                  className={`text-[10px] mt-2 ${
                    isCompleted ? "font-bold text-gray-700" : "font-medium text-gray-400"
                  }`}
                >
                  {labels[i]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </PressableScale>
  );
};
