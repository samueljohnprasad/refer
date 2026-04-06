/**
 * JourneyCatalogPresentation (P1.2.2)
 * Pure presentational component — receives all data and callbacks via props.
 *
 * Layout:
 * - Header: "Your Journeys" + streak banner + XP counter
 * - Active journey section (featured card with Continue CTA)
 * - Category filter pills (horizontal scroll)
 * - Browse section (scrollable list of JourneyCards)
 * - Empty / Loading / Error states
 * - Pull-to-refresh
 */

import React, { useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    RefreshControl,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    Fire03Icon,
    FlashIcon,
    BookOpen02Icon,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

import type { MentalHealthJourneyListItem, JourneyCategory } from '@/src/types/journey/mentalHealth';
import JourneyCard from '@/src/components/journey/JourneyCard';

// ============================================================================
// Types
// ============================================================================

export interface JourneyCatalogPresentationProps {
    /** All journey items (already filtered by category) */
    journeys: MentalHealthJourneyListItem[];
    /** The active (in-progress) journey, if any */
    activeJourney: MentalHealthJourneyListItem | null;
    /** Currently selected category filter */
    selectedCategory: JourneyCategory | 'all';
    /** Available categories for filter pills */
    categories: Array<{ key: JourneyCategory | 'all'; label: string }>;
    /** Current streak count */
    currentStreak: number;
    /** Today's Insight Points */
    todayIP: number;
    /** Whether data is loading */
    isLoading: boolean;
    /** Whether a refresh is in progress */
    isRefreshing: boolean;
    /** Error message */
    error: string | null;
    /** Handlers */
    onJourneyPress: (journey: MentalHealthJourneyListItem) => void;
    onContinuePress: (journey: MentalHealthJourneyListItem) => void;
    onCategoryChange: (category: JourneyCategory | 'all') => void;
    onRefresh: () => void;
}

// ============================================================================
// Sub-components
// ============================================================================

/** Header with title, streak, and IP */
function CatalogHeader({
    currentStreak,
    todayIP,
}: {
    currentStreak: number;
    todayIP: number;
}): React.JSX.Element {
    return (
        <View className="px-5 pt-4 pb-3">
            <Text className="text-2xl font-bold text-slate-900 mb-3">
                Your Journeys
            </Text>
            <View className="flex-row items-center gap-4">
                {/* Streak */}
                <View className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-full">
                    <HugeiconsIcon icon={Fire03Icon} size={16} color="#F97316" />
                    <Text className="text-sm font-bold text-orange-600 ml-1">
                        {currentStreak}
                    </Text>
                    <Text className="text-xs text-orange-400 ml-1">day streak</Text>
                </View>
                {/* IP */}
                <View className="flex-row items-center bg-purple-50 px-3 py-1.5 rounded-full">
                    <HugeiconsIcon icon={FlashIcon} size={16} color="#8B5CF6" />
                    <Text className="text-sm font-bold text-purple-600 ml-1">
                        {todayIP}
                    </Text>
                    <Text className="text-xs text-purple-400 ml-1">IP today</Text>
                </View>
            </View>
        </View>
    );
}

/** Featured active journey card */
function ActiveJourneyBanner({
    journey,
    onContinue,
}: {
    journey: MentalHealthJourneyListItem;
    onContinue: (journey: MentalHealthJourneyListItem) => void;
}): React.JSX.Element {
    const progressPercent: number =
        journey.totalNodes > 0
            ? Math.round((journey.completedNodes / journey.totalNodes) * 100)
            : 0;

    const handlePress = useCallback((): void => {
        onContinue(journey);
    }, [onContinue, journey]);

    return (
        <View className="mx-5 mb-4">
            <Text className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                Continue Where You Left Off
            </Text>
            <Pressable
                onPress={handlePress}
                className="bg-blue-50 border border-blue-100 rounded-2xl p-4"
                accessibilityLabel={`Continue ${journey.title}`}
                accessibilityRole="button"
            >
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3 flex-1">
                        <View className="w-10 h-10 rounded-xl bg-blue-500 items-center justify-center">
                            <HugeiconsIcon icon={BookOpen02Icon} size={20} color="#FFFFFF" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold text-slate-900" numberOfLines={1}>
                                {journey.title}
                            </Text>
                            <Text className="text-xs text-slate-400">
                                {journey.completedNodes}/{journey.totalNodes} activities
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center bg-blue-500 px-3 py-2 rounded-xl">
                        <Text className="text-sm font-bold text-white mr-1">Continue</Text>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="#FFFFFF" />
                    </View>
                </View>

                {/* Progress bar */}
                <View className="h-2 bg-blue-200 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </View>
                <Text className="text-xs text-blue-500 font-semibold mt-1 text-right">
                    {progressPercent}% complete
                </Text>
            </Pressable>
        </View>
    );
}

/** Horizontal category filter pills */
function CategoryFilters({
    categories,
    selectedCategory,
    onCategoryChange,
}: {
    categories: Array<{ key: JourneyCategory | 'all'; label: string }>;
    selectedCategory: JourneyCategory | 'all';
    onCategoryChange: (category: JourneyCategory | 'all') => void;
}): React.JSX.Element {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            className="mb-4"
        >
            {categories.map((cat) => {
                const isActive: boolean = selectedCategory === cat.key;
                return (
                    <Pressable
                        key={cat.key}
                        onPress={() => onCategoryChange(cat.key)}
                        className={`px-4 py-2 rounded-full ${isActive ? 'bg-slate-900' : 'bg-slate-100'
                            }`}
                        accessibilityLabel={`Filter by ${cat.label}`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isActive }}
                    >
                        <Text
                            className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-500'
                                }`}
                        >
                            {cat.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

/** Empty state */
function EmptyState(): React.JSX.Element {
    return (
        <View className="items-center justify-center py-16 px-8">
            <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center mb-4">
                <HugeiconsIcon icon={BookOpen02Icon} size={36} color="#94A3B8" />
            </View>
            <Text className="text-lg font-bold text-slate-700 mb-2 text-center">
                Start Your First Journey!
            </Text>
            <Text className="text-sm text-slate-400 text-center leading-5">
                Choose a guided path to learn mental health skills through
                interactive lessons, exercises, and quizzes.
            </Text>
        </View>
    );
}

/** Loading skeleton */
function LoadingSkeleton(): React.JSX.Element {
    return (
        <View className="px-5">
            {[1, 2, 3].map((i: number) => (
                <View key={i} className="bg-slate-50 rounded-2xl p-4 mb-3">
                    <View className="flex-row items-center gap-3 mb-3">
                        <View className="w-12 h-12 rounded-xl bg-slate-200" />
                        <View className="flex-1">
                            <View className="h-4 w-32 bg-slate-200 rounded-full mb-2" />
                            <View className="h-3 w-20 bg-slate-100 rounded-full" />
                        </View>
                    </View>
                    <View className="h-3 w-full bg-slate-100 rounded-full mb-2" />
                    <View className="h-3 w-3/4 bg-slate-100 rounded-full" />
                </View>
            ))}
        </View>
    );
}

/** Error state */
function ErrorState({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}): React.JSX.Element {
    return (
        <View className="items-center justify-center py-16 px-8">
            <Text className="text-base font-semibold text-red-500 mb-2 text-center">
                Something went wrong
            </Text>
            <Text className="text-sm text-slate-400 text-center mb-4">
                {message}
            </Text>
            <Pressable
                onPress={onRetry}
                className="bg-slate-900 px-6 py-3 rounded-xl"
                accessibilityLabel="Retry loading journeys"
                accessibilityRole="button"
            >
                <Text className="text-sm font-semibold text-white">Try Again</Text>
            </Pressable>
        </View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

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
    const renderJourneyCard = useCallback(
        ({ item }: { item: MentalHealthJourneyListItem }): React.JSX.Element => (
            <View className="px-5">
                <JourneyCard journey={item} onPress={onJourneyPress} />
            </View>
        ),
        [onJourneyPress],
    );

    const keyExtractor = useCallback(
        (item: MentalHealthJourneyListItem): string => item.id,
        [],
    );

    // Loading state (first load only)
    if (isLoading && journeys.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <CatalogHeader currentStreak={currentStreak} todayIP={todayIP} />
                <LoadingSkeleton />
            </SafeAreaView>
        );
    }

    // Error state
    if (error && journeys.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <CatalogHeader currentStreak={currentStreak} todayIP={todayIP} />
                <ErrorState message={error} onRetry={onRefresh} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <FlatList
                data={journeys}
                renderItem={renderJourneyCard}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={
                    <>
                        <CatalogHeader currentStreak={currentStreak} todayIP={todayIP} />

                        {/* Active journey banner */}
                        {activeJourney ? (
                            <ActiveJourneyBanner
                                journey={activeJourney}
                                onContinue={onContinuePress}
                            />
                        ) : null}

                        {/* Category filters */}
                        <CategoryFilters
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={onCategoryChange}
                        />

                        {/* Section title */}
                        <Text className="text-base font-bold text-slate-900 px-5 mb-3">
                            {selectedCategory === 'all' ? 'All Journeys' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Journeys`}
                        </Text>
                    </>
                }
                ListEmptyComponent={<EmptyState />}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </SafeAreaView>
    );
}
