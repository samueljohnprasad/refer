import React from "react";
import {
    RefreshControl,
    ScrollView,
    View,
    Pressable,
} from "react-native";

import { Text } from "@/components/ui/text";
import JourneyCard from "@/src/components/journey/JourneyCard";
import type {
    JourneyCategory,
    MentalHealthJourneyListItem,
} from "@/src/types/journey/mentalHealth";

export interface JourneyCatalogPresentationProps {
    journeys: MentalHealthJourneyListItem[];
    activeJourney: MentalHealthJourneyListItem | null;
    selectedCategory: JourneyCategory | "all";
    categories: Array<{ key: JourneyCategory | "all"; label: string }>;
    currentStreak: number;
    todayIP: number;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    onJourneyPress: (journey: MentalHealthJourneyListItem) => void;
    onContinuePress: (journey: MentalHealthJourneyListItem) => void;
    onCategoryChange: (category: JourneyCategory | "all") => void;
    onRefresh: () => void;
}

function EmptyState(): React.JSX.Element {
    return (
        <View className="rounded-3xl bg-slate-50 px-5 py-8 items-center">
            <Text className="text-lg font-semibold text-slate-900">
                No journeys yet
            </Text>
            <Text className="mt-2 text-center text-sm text-slate-500">
                Your recommended journey will show up here after the quiz.
            </Text>
        </View>
    );
}

export default function JourneyCatalogPresentation({
    journeys,
    activeJourney,
    selectedCategory,
    categories,
    currentStreak,
    todayIP,
    isLoading,
    isRefreshing,
    error,
    onJourneyPress,
    onContinuePress,
    onCategoryChange,
    onRefresh,
}: JourneyCatalogPresentationProps): React.JSX.Element {
    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        >
            <View className="mb-6">
                <Text className="text-3xl font-bold text-slate-900">
                    Journeys
                </Text>
                <Text className="mt-2 text-sm text-slate-500">
                    Pick a path that matches what you need right now.
                </Text>
            </View>

            <View className="mb-6 flex-row gap-3">
                <View className="flex-1 rounded-2xl bg-violet-50 px-4 py-4">
                    <Text className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                        Streak
                    </Text>
                    <Text className="mt-1 text-2xl font-bold text-slate-900">
                        {currentStreak}
                    </Text>
                </View>
                <View className="flex-1 rounded-2xl bg-blue-50 px-4 py-4">
                    <Text className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                        Today IP
                    </Text>
                    <Text className="mt-1 text-2xl font-bold text-slate-900">
                        {todayIP}
                    </Text>
                </View>
            </View>

            {activeJourney ? (
                <Pressable
                    onPress={() => onContinuePress(activeJourney)}
                    className="mb-6 rounded-3xl bg-slate-900 px-5 py-5"
                    accessibilityRole="button"
                    accessibilityLabel={`Continue ${activeJourney.title}`}
                >
                    <Text className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                        Continue Journey
                    </Text>
                    <Text className="mt-2 text-xl font-bold text-white">
                        {activeJourney.title}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-300">
                        {activeJourney.completedNodes} of {activeJourney.totalNodes} steps
                        completed
                    </Text>
                </Pressable>
            ) : null}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-6"
                contentContainerStyle={{ paddingRight: 20 }}
            >
                {categories.map((category) => {
                    const isSelected = category.key === selectedCategory;
                    return (
                        <Pressable
                            key={category.key}
                            onPress={() => onCategoryChange(category.key)}
                            className={`mr-3 rounded-full px-4 py-2 ${
                                isSelected ? "bg-violet-600" : "bg-slate-100"
                            }`}
                        >
                            <Text
                                className={`text-sm font-medium ${
                                    isSelected ? "text-white" : "text-slate-600"
                                }`}
                            >
                                {category.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {error ? (
                <View className="mb-6 rounded-2xl bg-red-50 px-4 py-4">
                    <Text className="text-sm font-medium text-red-700">{error}</Text>
                </View>
            ) : null}

            {isLoading ? (
                <View className="rounded-3xl bg-slate-50 px-5 py-8 items-center">
                    <Text className="text-sm text-slate-500">Loading journeys...</Text>
                </View>
            ) : journeys.length === 0 ? (
                <EmptyState />
            ) : (
                journeys.map((journey) => (
                    <JourneyCard
                        key={journey.id}
                        journey={journey}
                        onPress={onJourneyPress}
                    />
                ))
            )}
        </ScrollView>
    );
}
