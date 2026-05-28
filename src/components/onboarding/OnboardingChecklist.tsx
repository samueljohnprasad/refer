import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { OnboardingChecklistItem } from '@/src/screens/OnboardingScreen/types';
import { useOnboardingChecklist } from '@/hooks/data/useOnboardingChecklist';
import { Card } from '@/src/components/ui/Card';
import StageProgressBar from '@/src/components/ui/StageProgressBar';

interface ChecklistRowProps {
    item: OnboardingChecklistItem;
    index: number;
    onPress: (item: OnboardingChecklistItem) => void;
}

const ChecklistRow: React.FC<ChecklistRowProps> = ({ item, index, onPress }) => (
    <Animated.View entering={FadeInDown.duration(300).delay(100 + index * 60)}>
        <TouchableOpacity
            onPress={() => onPress(item)}
            activeOpacity={0.7}
            className="flex-row items-center py-3"
            accessibilityLabel={`${item.completed ? 'Completed' : 'Incomplete'}: ${item.label}`}
            accessibilityRole="button"
        >
            <View
                className={`w-7 h-7 rounded-full border-2 items-center justify-center mr-3 ${item.completed
                        ? 'bg-sage-500 border-sage-500'
                        : 'border-sage-200 bg-brand-surface'
                    }`}
            >
                {item.completed && (
                    <Text className="text-brand-surface text-xs font-bold">✓</Text>
                )}
            </View>
            <Text
                className={`happy-font-body-medium flex-1 text-[15px] ${item.completed ? 'text-ink-muted' : 'text-ink-soft'
                    }`}
                style={{ opacity: item.completed ? 0.45 : 1 }}
            >
                {item.label}
            </Text>
            <Text className="happy-font-body-bold text-xs text-sage-600">+{item.xpReward} XP</Text>
        </TouchableOpacity>
    </Animated.View>
);

const OnboardingChecklist: React.FC = () => {
    const {
        items,
        completedCount,
        totalCount,
        progressPercent,
        isVisible,
        totalXpReward,
        dismissChecklist,
    } = useOnboardingChecklist();

    if (!isVisible) {
        return null;
    }

    const handleItemPress = (item: OnboardingChecklistItem): void => {
        if (!item.completed) {
            Haptics.selectionAsync();
            router.push(item.route as never);
        }
    };

    const handleDismiss = (): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dismissChecklist();
    };

    return (
        <Animated.View entering={FadeIn.duration(500)}>
            <Card
                variant="tile"
                radius="xl"
                showDepth={true}
                className="mb-5"
                contentClassName="p-5"
            >
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <Text style={{ fontSize: 16 }} className="mr-2">🚀</Text>
                        <Text className="happy-font-body-bold text-[18px] text-ink">Getting Started</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleDismiss}
                        className="p-1"
                        accessibilityLabel="Dismiss checklist"
                        accessibilityRole="button"
                    >
                        <Text className="happy-font-body-bold text-ink-muted text-xs">✕</Text>
                    </TouchableOpacity>
                </View>

                <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="happy-font-body-semibold text-xs text-ink-muted">
                            {completedCount}/{totalCount} complete
                        </Text>
                        <Text className="happy-font-body-bold text-xs text-sage-600">
                            Earn {totalXpReward} XP
                        </Text>
                    </View>
                    <StageProgressBar
                        progress={progressPercent}
                        height={8}
                    />
                </View>

                <View className="border-t border-sage-100 pt-1">
                    {items.map((item: OnboardingChecklistItem, index: number) => (
                        <ChecklistRow
                            key={item.id}
                            item={item}
                            index={index}
                            onPress={handleItemPress}
                        />
                    ))}
                </View>
            </Card>
        </Animated.View>
    );
};

export default React.memo(OnboardingChecklist);
