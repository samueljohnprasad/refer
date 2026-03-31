import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface EnhancedCelebrationStepProps {
    userName: string;
    trialStarted: boolean;
}

interface StatBadgeProps {
    emoji: string;
    value: string;
    label: string;
    bgColor: string;
    delay: number;
}

const StatBadge: React.FC<StatBadgeProps> = ({
    emoji,
    value,
    label,
    bgColor,
    delay,
}) => {
    const scale = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withDelay(
            delay,
            withSpring(1, { damping: 12, stiffness: 80 }),
        );
    }, [delay, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            style={animatedStyle}
            className="items-center flex-1"
        >
            <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                style={{ backgroundColor: bgColor }}
            >
                <Text style={{ fontSize: 28 }}>{emoji}</Text>
            </View>
            <Text
                className="text-gray-900 dark:text-white mb-0.5"
                style={{ fontSize: 20, fontWeight: "800" }}
            >
                {value}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium text-center">
                {label}
            </Text>
        </Animated.View>
    );
};

const EnhancedCelebrationStep: React.FC<EnhancedCelebrationStepProps> = ({
    userName,
    trialStarted,
}) => {
    useEffect(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, []);

    const displayName: string = userName || "there";

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}
            className="flex-1 px-6 pt-8"
        >
            <Animated.View
                entering={FadeInUp.duration(700).springify()}
                className="items-center mb-6"
            >
                <Text style={{ fontSize: 64, marginBottom: 16 }}>🎉</Text>
                <Text
                    className="text-center text-gray-900 dark:text-white mb-3"
                    style={{
                        fontFamily: "CormorantBold",
                        fontSize: 32,
                        lineHeight: 38,
                        letterSpacing: -0.5,
                    }}
                >
                    Welcome, {displayName}!
                </Text>
                <Text
                    className="text-center text-gray-900 dark:text-gray-100"
                    style={{
                        fontFamily: "CormorantSemiBold",
                        fontSize: 24,
                        lineHeight: 30,
                    }}
                >
                    You're all set ✨
                </Text>
            </Animated.View>

            {trialStarted && (
                <Animated.View
                    entering={FadeIn.duration(500).delay(300)}
                    className="bg-purple-50 rounded-2xl px-5 py-4 mb-6 w-full border border-purple-100"
                >
                    <View className="flex-row items-center">
                        <Text
                            style={{ fontSize: 20 }}
                            className="mr-3"
                        >
                            👑
                        </Text>
                        <View className="flex-1">
                            <Text className="text-purple-800 text-sm font-bold">
                                Premium Trial Active
                            </Text>
                            <Text className="text-purple-600 text-xs font-medium mt-0.5">
                                Your free trial is active — let's make the most of it!
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            )}

            <Animated.View
                entering={FadeIn.duration(500).delay(400)}
                className="w-full mb-8"
            >
                <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 ml-1">
                    Users who journal daily report
                </Text>
                <View className="flex-row gap-3">
                    <StatBadge
                        emoji="😊"
                        value="92%"
                        label="Better mood"
                        bgColor="#D1FAE5"
                        delay={500}
                    />
                    <StatBadge
                        emoji="😌"
                        value="78%"
                        label="Less stress"
                        bgColor="#FEE2E2"
                        delay={650}
                    />
                    <StatBadge
                        emoji="💪"
                        value="95%"
                        label="More aware"
                        bgColor="#DBEAFE"
                        delay={800}
                    />
                </View>
            </Animated.View>

            <Animated.View
                entering={FadeInDown.duration(500).delay(900)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                }}
            >
                <Text className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">
                    💡 Quick Tips to Get Started
                </Text>
                <View className="gap-3">
                    <View className="flex-row items-start">
                        <Text className="text-gray-400 text-sm mr-2 mt-0.5">1.</Text>
                        <Text className="flex-1 text-gray-600 dark:text-gray-300 text-sm font-medium leading-5">
                            Start your day with a quick mood check-in
                        </Text>
                    </View>
                    <View className="flex-row items-start">
                        <Text className="text-gray-400 dark:text-gray-500 text-sm mr-2 mt-0.5">
                            2.
                        </Text>
                        <Text className="flex-1 text-gray-600 dark:text-gray-300 text-sm font-medium leading-5">
                            Try voice journaling — just talk it out 🎙️
                        </Text>
                    </View>
                    <View className="flex-row items-start">
                        <Text className="text-gray-400 dark:text-gray-500 text-sm mr-2 mt-0.5">
                            3.
                        </Text>
                        <Text className="flex-1 text-gray-600 dark:text-gray-300 text-sm font-medium leading-5">
                            Build a streak — even 30 seconds counts!
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </ScrollView>
    );
};

export default React.memo(EnhancedCelebrationStep);
