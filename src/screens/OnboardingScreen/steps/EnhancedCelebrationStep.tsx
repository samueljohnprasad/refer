import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, {
    FadeIn,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  SparklesIcon,
  StarIcon,
  HappyIcon,
  SmileIcon,
  Brain01Icon,
  Idea01Icon,
  Mic01Icon,
} from "@hugeicons/core-free-icons";
import { SAGE, OTTER_BLUE, MACAW_PURPLE } from "@/lib/tokens";
import type { HugeIconObject } from "@/src/data/journey/hugeiconsRegistry";

interface EnhancedCelebrationStepProps {
    userName: string;
    trialStarted: boolean;
};

interface StatBadgeProps {
    icon: HugeIconObject;
    value: string;
    label: string;
    bgColor: string;
    iconColor: string;
    delay: number;
}

const StatBadge: React.FC<StatBadgeProps> = ({
    icon,
    value,
    label,
    bgColor,
    iconColor,
    delay,
}) => {
    return (
        <Animated.View
            entering={FadeIn.duration(180).delay(delay)}
            className="items-center flex-1"
        >
            <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                style={{ backgroundColor: bgColor }}
            >
                <HugeiconsIcon icon={icon} size={28} color={iconColor} />
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
            contentInsetAdjustmentBehavior="automatic"
            className="flex-1 px-6 pt-8"
        >
            <Animated.View
                entering={FadeIn.duration(180).delay(80)}
                className="items-center mb-6"
            >
                <View className="mb-4">
                    <HugeiconsIcon icon={SparklesIcon} size={64} color="#D97706" />
                </View>
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
                    You're all set!
                </Text>
            </Animated.View>

            {trialStarted && (
                <Animated.View
                    entering={FadeIn.duration(180).delay(160)}
                    className="bg-purple-50 rounded-2xl px-5 py-4 mb-6 w-full border border-purple-100"
                >
                    <View className="flex-row items-center">
                        <View className="mr-3 bg-purple-200 p-2 rounded-xl">
                            <HugeiconsIcon icon={StarIcon} size={20} color={MACAW_PURPLE} />
                        </View>
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

            <View className="w-full mb-8">
                <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 ml-1">
                    Users who journal daily report
                </Text>
                <View className="flex-row gap-3">
                    <StatBadge
                        icon={HappyIcon}
                        value="92%"
                        label="Better mood"
                        bgColor="#D1FAE5"
                        iconColor="#059669"
                        delay={220}
                    />
                    <StatBadge
                        icon={SmileIcon}
                        value="78%"
                        label="Less stress"
                        bgColor="#FEF3C7"
                        iconColor="#D97706"
                        delay={280}
                    />
                    <StatBadge
                        icon={Brain01Icon}
                        value="95%"
                        label="More aware"
                        bgColor="#DBEAFE"
                        iconColor="#2563EB"
                        delay={340}
                    />
                </View>
            </View>

            <Animated.View
                entering={FadeIn.duration(180).delay(420)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full border border-sage-100"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                }}
            >
                <View className="flex-row items-center gap-2 mb-3">
                    <HugeiconsIcon icon={Idea01Icon} size={18} color="#D97706" />
                    <Text className="text-sm font-bold text-gray-800 dark:text-gray-100">
                        Quick Tips to Get Started
                    </Text>
                </View>
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
                        <View className="flex-1 flex-row items-center flex-wrap gap-1">
                            <Text className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-5">
                                Try voice journaling — just talk it out
                            </Text>
                            <HugeiconsIcon icon={Mic01Icon} size={14} color={SAGE[600]} />
                        </View>
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
