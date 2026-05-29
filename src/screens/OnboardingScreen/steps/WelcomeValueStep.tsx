import React from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, {
    FadeIn,
} from "react-native-reanimated";
import { SOCIAL_PROOF_COUNT } from "../constants";
import PremiumBadge from "../../../components/premium/PremiumBadge";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Leaf01Icon,
  SmileIcon,
  SparklesIcon,
  Brain01Icon,
  CheckmarkCircle01Icon,
  Timer01Icon,
} from "@hugeicons/core-free-icons";
import { SAGE } from "@/lib/tokens";
import type { HugeIconObject } from "@/src/data/journey/hugeiconsRegistry";

interface BenefitItemProps {
    icon: HugeIconObject;
    title: string;
    isPremium: boolean;
    delay: number;
}

const BenefitItem: React.FC<BenefitItemProps> = ({
    icon,
    title,
    isPremium,
    delay,
}) => (
    <Animated.View
        entering={FadeIn.duration(180).delay(delay)}
        className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 mb-3"
        style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
        }}
        accessible
        accessibilityLabel={`${title}${isPremium ? ", premium feature" : ""}`}
    >
        <View className="mr-4">
            <HugeiconsIcon icon={icon} size={24} color={isPremium ? "#CE82FF" : SAGE[600]} />
        </View>
        <Text className="flex-1 text-base font-semibold text-gray-800 dark:text-gray-100">
            {title}
        </Text>
        {isPremium && <PremiumBadge size="small" />}
    </Animated.View>
);

const WelcomeValueStep: React.FC = () => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            contentInsetAdjustmentBehavior="automatic"
            className="flex-1 px-6 pt-8"
        >
            <Animated.View
                entering={FadeIn.duration(180).delay(80)}
                className="items-center mb-8"
            >
                <View className="mb-4">
                    <HugeiconsIcon icon={Leaf01Icon} size={48} color={SAGE[500]} />
                </View>
                <Text
                    className="text-center text-gray-900 dark:text-white mb-3"
                    style={{
                        fontFamily: "FrauncesBold",
                        fontSize: 32,
                        lineHeight: 38,
                        letterSpacing: -0.5,
                    }}
                >
                    Your Safe Space for{"\n"}Self-Discovery
                </Text>
                <Text className="text-center text-gray-500 dark:text-gray-400 text-base font-medium leading-6 px-4">
                    Join {SOCIAL_PROOF_COUNT} people who journal daily to understand
                    themselves better
                </Text>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(180).delay(160)}>
                <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1">
                    What you'll get
                </Text>
            </Animated.View>

            <BenefitItem
                icon={SmileIcon}
                title="Track your mood patterns"
                isPremium={false}
                delay={220}
            />
            <BenefitItem
                icon={SparklesIcon}
                title="AI-powered insights"
                isPremium={true}
                delay={280}
            />
            <BenefitItem
                icon={Brain01Icon}
                title="Science-backed CBT exercises"
                isPremium={true}
                delay={340}
            />
            <BenefitItem
                icon={CheckmarkCircle01Icon}
                title="Build positive daily habits"
                isPremium={false}
                delay={400}
            />

            <Animated.View
                entering={FadeIn.duration(180).delay(460)}
                className="items-center mt-6"
            >
                <View className="flex-row items-center bg-purple-50 rounded-full px-4 py-2 gap-2">
                    <HugeiconsIcon icon={Timer01Icon} size={16} color="#9333ea" />
                    <Text className="text-purple-600 text-sm font-semibold">
                        Takes less than 2 minutes
                    </Text>
                </View>
            </Animated.View>
        </ScrollView>
    );
};

export default React.memo(WelcomeValueStep);
