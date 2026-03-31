import React from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";
import { SOCIAL_PROOF_COUNT, BRAND_PURPLE } from "../constants";
import PremiumBadge from "../../../components/premium/PremiumBadge";

interface BenefitItemProps {
    emoji: string;
    title: string;
    isPremium: boolean;
    delay: number;
}

const BenefitItem: React.FC<BenefitItemProps> = ({
    emoji,
    title,
    isPremium,
    delay,
}) => (
    <Animated.View
        entering={FadeInDown.duration(500).delay(delay).springify()}
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
        <Text
            className="text-2xl mr-4"
            accessibilityElementsHidden
        >
            {emoji}
        </Text>
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
            className="flex-1 px-6 pt-8"
        >
            <Animated.View
                entering={FadeInUp.duration(600).springify()}
                className="items-center mb-8"
            >
                <Text className="text-5xl mb-4">🌿</Text>
                <Text
                    className="text-center text-gray-900 dark:text-white mb-3"
                    style={{
                        fontFamily: "CormorantBold",
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

            <Animated.View entering={FadeIn.duration(400).delay(300)}>
                <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1">
                    What you'll get
                </Text>
            </Animated.View>

            <BenefitItem
                emoji="📊"
                title="Track your mood patterns"
                isPremium={false}
                delay={400}
            />
            <BenefitItem
                emoji="✨"
                title="AI-powered insights"
                isPremium={true}
                delay={500}
            />
            <BenefitItem
                emoji="🧠"
                title="Science-backed CBT exercises"
                isPremium={true}
                delay={600}
            />
            <BenefitItem
                emoji="✅"
                title="Build positive daily habits"
                isPremium={false}
                delay={700}
            />

            <Animated.View
                entering={FadeIn.duration(400).delay(800)}
                className="items-center mt-6"
            >
                <View className="flex-row items-center bg-purple-50 rounded-full px-4 py-2">
                    <Text className="text-purple-600 text-sm font-semibold">
                        ⏱ Takes less than 2 minutes
                    </Text>
                </View>
            </Animated.View>
        </ScrollView>
    );
};

export default React.memo(WelcomeValueStep);
