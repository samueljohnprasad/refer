import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import { Image } from "@/components/ui/image";
import { terrible, bad, fine, good, great } from "@/assets/emojis";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Emotion configuration
const EMOTIONS = [
  { id: 1, name: "Terrible", emoji: terrible, color: "#FF6B6B", bgColor: "#FFE5E5" },
  { id: 2, name: "Bad", emoji: bad, color: "#FFA94D", bgColor: "#FFF3E5" },
  { id: 3, name: "Okay", emoji: fine, color: "#FFD43B", bgColor: "#FFF9E5" },
  { id: 4, name: "Good", emoji: good, color: "#69DB7C", bgColor: "#E5F9E5" },
  { id: 5, name: "Great", emoji: great, color: "#74C0FC", bgColor: "#E5F3FF" },
] as const;

interface EmotionLoggerProps {
  selectedDate?: Date;
  onEmotionLogged?: (emotionScore: number) => void;
}

interface DailyEmotionData {
  [date: string]: {
    [emotionId: string]: number;
  };
}

const EmotionItem: React.FC<{
  emotion: typeof EMOTIONS[number];
  count: number;
  onPress: () => void;
  isLoading: boolean;
}> = ({ emotion, count, onPress, isLoading }) => {
  const scale = useSharedValue(1);
  const countScale = useSharedValue(1);

  // Animate count changes
  useEffect(() => {
    if (count > 0) {
      countScale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
    }
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedCountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countScale.value }],
    opacity: interpolate(countScale.value, [1, 1.2], [0.9, 1]),
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handlePress = () => {
    if (!isLoading) {
      // Trigger animation
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 180 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
      onPress();
    }
  };

  return (
    <View className="flex-1 items-center">
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLoading}
        className="items-center"
      >
        <Animated.View style={animatedStyle}>
          <View
            className="items-center justify-center rounded-2xl p-2"
            style={{ backgroundColor: emotion.bgColor }}
          >
            <Image
              source={emotion.emoji}
              alt={emotion.name}
              className="w-11 h-11"
              width={44}
              height={44}
            />
            {count > 0 && (
              <Animated.View
                className="absolute -top-1 -right-1 bg-violet-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1"
                style={animatedCountStyle}
              >
                <Text className="text-white text-xs font-semibold">
                  {count > 99 ? "99+" : count}
                </Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </Pressable>
      <Text className="text-xs font-medium text-gray-700 mt-1.5">{emotion.name}</Text>
    </View>
  );
};

export const EmotionLogger: React.FC<EmotionLoggerProps> = ({
  selectedDate = new Date(),
  onEmotionLogged,
}) => {
  const [emotionCounts, setEmotionCounts] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  // Load emotion data from AsyncStorage
  const loadEmotionData = useCallback(async () => {
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const storageKey = `@emotion_logs`;
      const storedData = await AsyncStorage.getItem(storageKey);
      
      if (storedData) {
        const allData: DailyEmotionData = JSON.parse(storedData);
        const dayData = allData[dateStr] || {};
        
        const counts = new Map<number, number>();
        Object.entries(dayData).forEach(([emotionId, count]) => {
          counts.set(parseInt(emotionId), count as number);
        });
        
        setEmotionCounts(counts);
      } else {
        setEmotionCounts(new Map());
      }
    } catch (error) {
      console.error("Error loading emotion data:", error);
      setEmotionCounts(new Map());
    }
  }, [selectedDate]);

  useEffect(() => {
    loadEmotionData();
  }, [loadEmotionData]);

  // Log an emotion
  const logEmotion = useCallback(async (emotionScore: number) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const storageKey = `@emotion_logs`;
      
      // Load existing data
      const storedData = await AsyncStorage.getItem(storageKey);
      const allData: DailyEmotionData = storedData ? JSON.parse(storedData) : {};
      
      // Initialize day data if not exists
      if (!allData[dateStr]) {
        allData[dateStr] = {};
      }
      
      // Increment count for this emotion
      const currentCount = allData[dateStr][emotionScore] || 0;
      allData[dateStr][emotionScore] = currentCount + 1;
      
      // Save back to storage
      await AsyncStorage.setItem(storageKey, JSON.stringify(allData));
      
      // Update local state immediately
      setEmotionCounts(prev => {
        const newCounts = new Map(prev);
        newCounts.set(emotionScore, (newCounts.get(emotionScore) || 0) + 1);
        return newCounts;
      });

      // Call callback if provided
      onEmotionLogged?.(emotionScore);
    } catch (error) {
      console.error("Error logging emotion:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, isLoading, onEmotionLogged]);

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-semibold text-gray-900">Daily Mood Log</Text>
        <Text className="text-xs text-gray-500">
          {format(selectedDate, "MMM d, yyyy")}
        </Text>
      </View>
      
      <View className="flex-row justify-between">
        {EMOTIONS.map((emotion) => (
          <EmotionItem
            key={emotion.id}
            emotion={emotion}
            count={emotionCounts.get(emotion.id) || 0}
            onPress={() => logEmotion(emotion.id)}
            isLoading={isLoading}
          />
        ))}
      </View>
    </View>
  );
};

export default EmotionLogger;
