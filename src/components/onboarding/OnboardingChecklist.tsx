import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { OnboardingChecklistItem } from '@/src/screens/OnboardingScreen/types';
import { useOnboardingChecklist } from '@/hooks/data/useOnboardingChecklist';

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
                className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${item.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 bg-white'
                    }`}
            >
                {item.completed && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                )}
            </View>
            <Text
                className={`flex-1 text-sm font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
            >
                {item.label}
            </Text>
            <Text className="text-xs font-bold text-purple-500">+{item.xpReward} XP</Text>
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
        <Animated.View
            entering={FadeIn.duration(500)}
            className="bg-white rounded-2xl p-5 mx-4 mb-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
            }}
        >
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                    <Text style={{ fontSize: 16 }} className="mr-2">🚀</Text>
                    <Text className="text-base font-bold text-gray-800">Getting Started</Text>
                </View>
                <TouchableOpacity
                    onPress={handleDismiss}
                    className="p-1"
                    accessibilityLabel="Dismiss checklist"
                    accessibilityRole="button"
                >
                    <Text className="text-gray-400 text-xs font-medium">✕</Text>
                </TouchableOpacity>
            </View>

            <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-xs font-semibold text-gray-500">
                        {completedCount}/{totalCount} complete
                    </Text>
                    <Text className="text-xs font-bold text-purple-600">
                        Earn {totalXpReward} XP
                    </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </View>
            </View>

            <View className="border-t border-gray-100 pt-1">
                {items.map((item: OnboardingChecklistItem, index: number) => (
                    <ChecklistRow
                        key={item.id}
                        item={item}
                        index={index}
                        onPress={handleItemPress}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

export default React.memo(OnboardingChecklist);
