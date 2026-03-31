import React from "react";
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
import { JournalingGoal, GoalConfig } from "../types";
import { GOAL_OPTIONS } from "../constants";
import PremiumBadge from "../../../components/premium/PremiumBadge";

interface GoalsSelectionStepProps {
    selectedGoals: JournalingGoal[];
    onUpdateGoals: (goals: JournalingGoal[]) => void;
    maxGoals?: number;
}

interface GoalChipProps {
    goal: GoalConfig;
    isSelected: boolean;
    onToggle: () => void;
    index: number;
}

const MAX_GOALS_DEFAULT: number = 3;

const GoalChip: React.FC<GoalChipProps> = ({
    goal,
    isSelected,
    onToggle,
    index,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = (): void => {
        Haptics.selectionAsync();
        onToggle();
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(400)
                .delay(200 + index * 60)
                .springify()}
        >
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={() => {
                    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
                }}
                onPressOut={() => {
                    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
                }}
                activeOpacity={1}
                accessibilityLabel={`${isSelected ? "Deselect" : "Select"} goal: ${goal.label}${goal.premiumFeatureLabel ? `, unlocks ${goal.premiumFeatureLabel}` : ""}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
            >
                <Animated.View
                    style={animatedStyle}
                    className={`flex-row items-center rounded-2xl px-4 py-4 mb-3 border-2 ${isSelected
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-400"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        }`}
                >
                    <View
                        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${isSelected ? "bg-purple-100" : "bg-gray-100"
                            }`}
                    >
                        <Text style={{ fontSize: 20 }}>{goal.emoji}</Text>
                    </View>
                    <View className="flex-1">
                        <Text
                            className={`text-sm font-semibold ${isSelected
                                ? "text-purple-800 dark:text-purple-300"
                                : "text-gray-700 dark:text-gray-200"
                                }`}
                        >
                            {goal.label}
                        </Text>
                        {goal.premiumFeatureLabel && (
                            <View className="flex-row items-center mt-1">
                                <Text className="text-xs text-gray-400 font-medium mr-1">
                                    Unlocks:
                                </Text>
                                <Text className="text-xs text-purple-500 font-medium">
                                    {goal.premiumFeatureLabel}
                                </Text>
                            </View>
                        )}
                    </View>
                    {isSelected && (
                        <View className="w-6 h-6 rounded-full bg-purple-500 items-center justify-center">
                            <Text className="text-white text-xs font-bold">✓</Text>
                        </View>
                    )}
                    {!isSelected && goal.premiumFeature && <PremiumBadge size="small" />}
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const GoalsSelectionStep: React.FC<GoalsSelectionStepProps> = ({
    selectedGoals,
    onUpdateGoals,
    maxGoals = MAX_GOALS_DEFAULT,
}) => {
    const handleToggleGoal = (goalId: JournalingGoal): void => {
        const isAlreadySelected: boolean = selectedGoals.includes(goalId);

        if (isAlreadySelected) {
            onUpdateGoals(selectedGoals.filter((g: JournalingGoal) => g !== goalId));
        } else if (selectedGoals.length < maxGoals) {
            onUpdateGoals([...selectedGoals, goalId]);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            className="flex-1 px-6 pt-8"
        >
            <Animated.View
                entering={FadeInUp.duration(600).springify()}
                className="items-center mb-6"
            >
                <Text
                    className="text-center text-gray-900 dark:text-white mb-2"
                    style={{
                        fontFamily: "CormorantBold",
                        fontSize: 30,
                        lineHeight: 36,
                        letterSpacing: -0.5,
                    }}
                >
                    What brings you here?
                </Text>
                <Text className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium leading-5">
                    Select up to {maxGoals} goals to personalize your experience
                </Text>
            </Animated.View>

            <Animated.View
                entering={FadeIn.duration(300).delay(150)}
                className="mb-2"
            >
                <View className="flex-row items-center justify-between px-1">
                    <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Your goals
                    </Text>
                    <Text
                        className={`text-xs font-bold ${selectedGoals.length === maxGoals
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-400 dark:text-gray-500"
                            }`}
                        accessibilityLabel={`${selectedGoals.length} of ${maxGoals} goals selected${selectedGoals.length === maxGoals ? ", maximum reached" : ""}`}
                    >
                        {selectedGoals.length === maxGoals ? "✓ " : ""}
                        {selectedGoals.length}/{maxGoals} selected
                    </Text>
                </View>
            </Animated.View>

            {GOAL_OPTIONS.map((goal: GoalConfig, index: number) => (
                <GoalChip
                    key={goal.id}
                    goal={goal}
                    isSelected={selectedGoals.includes(goal.id)}
                    onToggle={() => handleToggleGoal(goal.id)}
                    index={index}
                />
            ))}
        </ScrollView>
    );
};

export default React.memo(GoalsSelectionStep);
