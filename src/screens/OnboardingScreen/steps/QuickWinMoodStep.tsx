import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { MoodValue, QuickWinMoodOption } from "../types";
import { QUICK_WIN_MOOD_OPTIONS } from "../constants";

interface QuickWinMoodStepProps {
    selectedMood?: MoodValue;
    onSelectMood: (mood: MoodValue) => void;
}

interface MoodButtonProps {
    option: QuickWinMoodOption;
    isSelected: boolean;
    onPress: () => void;
    index: number;
}

const MoodButton: React.FC<MoodButtonProps> = ({
    option,
    isSelected,
    onPress,
    index,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (): void => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    };

    const handlePressOut = (): void => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(400)
                .delay(300 + index * 100)
                .springify()}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                accessibilityLabel={`Select mood: ${option.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
            >
                <Animated.View
                    style={animatedStyle}
                    className={`items-center justify-center rounded-2xl py-3 px-2 ${isSelected
                        ? "border-2 border-purple-500"
                        : "border-2 border-transparent"
                        }`}
                >
                    <View
                        className="w-16 h-16 rounded-full items-center justify-center mb-2"
                        style={{ backgroundColor: option.color }}
                    >
                        <Text style={{ fontSize: 32 }}>{option.emoji}</Text>
                    </View>
                    <Text
                        className={`text-xs font-semibold ${isSelected
                            ? "text-purple-700 dark:text-purple-300"
                            : "text-gray-500 dark:text-gray-400"
                            }`}
                    >
                        {option.label}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const QuickWinMoodStep: React.FC<QuickWinMoodStepProps> = ({
    selectedMood,
    onSelectMood,
}) => {
    const [showInsight, setShowInsight] = useState<boolean>(false);

    const selectedOption: QuickWinMoodOption | undefined =
        QUICK_WIN_MOOD_OPTIONS.find(
            (o: QuickWinMoodOption) => o.value === selectedMood,
        );

    const handleMoodSelect = (mood: MoodValue): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelectMood(mood);
        setShowInsight(true);
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            className="flex-1 px-6 pt-8"
        >
            <Animated.View
                entering={FadeInUp.duration(600).springify()}
                className="items-center mb-8"
            >
                <Text
                    className="text-center text-gray-900 dark:text-white mb-3"
                    style={{
                        fontFamily: "CormorantBold",
                        fontSize: 30,
                        lineHeight: 36,
                        letterSpacing: -0.5,
                    }}
                >
                    How are you feeling{"\n"}right now?
                </Text>
                <Text className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium leading-5">
                    Your first mood check-in — this is where it all begins
                </Text>
            </Animated.View>

            <View className="flex-row justify-between px-2 mb-8">
                {QUICK_WIN_MOOD_OPTIONS.map(
                    (option: QuickWinMoodOption, index: number) => (
                        <MoodButton
                            key={option.value}
                            option={option}
                            isSelected={selectedMood === option.value}
                            onPress={() => handleMoodSelect(option.value)}
                            index={index}
                        />
                    ),
                )}
            </View>

            {showInsight && selectedOption && (
                <Animated.View
                    entering={FadeIn.duration(500).springify()}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 mx-1"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        elevation: 2,
                    }}
                    accessible
                    accessibilityLabel={`Quick insight: ${selectedOption.insightText}`}
                >
                    <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mr-3">
                            <Text style={{ fontSize: 16 }}>💡</Text>
                        </View>
                        <Text className="text-sm font-bold text-purple-700 dark:text-purple-300">
                            Quick Insight
                        </Text>
                    </View>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm leading-5 font-medium">
                        {selectedOption.insightText}
                    </Text>
                </Animated.View>
            )}
        </ScrollView>
    );
};

export default React.memo(QuickWinMoodStep);

