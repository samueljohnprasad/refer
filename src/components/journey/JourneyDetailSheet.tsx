/**
 * JourneyDetailSheet (P1.2.4)
 * Bottom sheet shown when user taps a journey card before starting.
 *
 * Features:
 * - Journey header: icon, title, category tag, difficulty
 * - Full description
 * - Section preview list
 * - "What you'll learn" bullet list
 * - Duration + node count summary
 * - Start / Continue / Restart CTA
 */

import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    BookOpen02Icon,
    Clock01Icon,
    Target01Icon,
    CheckmarkCircle02Icon,
    ArrowRight01Icon,
    Cancel01Icon,
} from '@hugeicons/core-free-icons';

import type { MentalHealthJourneyListItem } from '@/src/types/journey/mentalHealth';
import type { MHTemplateUnit } from '@/src/lib/api/mentalHealthJourneyApi';

// ============================================================================
// Types
// ============================================================================

export interface JourneyDetailSheetProps {
    journey: MentalHealthJourneyListItem | null;
    /** Sections from the template (fetched when sheet opens) */
    sections: MHTemplateUnit[];
    /** Whether sections are still loading */
    sectionsLoading: boolean;
    onStart: (journey: MentalHealthJourneyListItem) => void;
    onContinue: (journey: MentalHealthJourneyListItem) => void;
    onDismiss: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const THEME_ACCENT: Record<string, string> = {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    green: '#22C55E',
    orange: '#F97316',
    pink: '#EC4899',
};

const DIFFICULTY_LABEL: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
    beginner: { bg: 'bg-green-100', text: 'text-green-700' },
    intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    advanced: { bg: 'bg-red-100', text: 'text-red-700' },
};

// ============================================================================
// Component
// ============================================================================

const JourneyDetailSheet = forwardRef<BottomSheetModal, JourneyDetailSheetProps>(
    function JourneyDetailSheet(
        { journey, sections, sectionsLoading, onStart, onContinue, onDismiss },
        ref,
    ): React.JSX.Element | null {
        const snapPoints = useMemo(() => ['70%', '90%'], []);

        const renderBackdrop = useCallback(
            (props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.5}
                />
            ),
            [],
        );

        if (!journey) return null;

        const accentColor: string =
            THEME_ACCENT[journey.colorThemeKey ?? journey.colorScheme] ?? '#3B82F6';
        const isEnrolled: boolean = journey.isEnrolled;
        const isCompleted: boolean = journey.enrollmentStatus === 'completed';
        const diffColors = DIFFICULTY_COLORS[journey.difficulty] ?? DIFFICULTY_COLORS.beginner;

        const handleCTA = (): void => {
            if (isEnrolled && !isCompleted) {
                onContinue(journey);
            } else {
                onStart(journey);
            }
        };

        const ctaLabel: string = isCompleted
            ? 'Restart Journey'
            : isEnrolled
                ? 'Continue Journey'
                : 'Start Journey';

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                onDismiss={onDismiss}
                handleIndicatorStyle={{ backgroundColor: '#CBD5E1', width: 40 }}
            >
                <BottomSheetView className="flex-1">
                    <ScrollView
                        className="flex-1 px-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    >
                        {/* Close button */}
                        <Pressable
                            onPress={onDismiss}
                            className="absolute right-0 top-0 p-2 z-10"
                            accessibilityLabel="Close detail sheet"
                            accessibilityRole="button"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#94A3B8" />
                        </Pressable>

                        {/* Header */}
                        <View className="flex-row items-center gap-3 mb-4 mt-2">
                            <View
                                className="w-14 h-14 rounded-xl items-center justify-center"
                                style={{ backgroundColor: accentColor }}
                            >
                                <HugeiconsIcon icon={BookOpen02Icon} size={28} color="#FFFFFF" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-bold text-slate-900" numberOfLines={2}>
                                    {journey.title}
                                </Text>
                                <View className="flex-row items-center gap-2 mt-1">
                                    <View className="bg-slate-100 px-2 py-0.5 rounded-full">
                                        <Text className="text-xs font-medium text-slate-500 capitalize">
                                            {journey.category}
                                        </Text>
                                    </View>
                                    <View className={`px-2 py-0.5 rounded-full ${diffColors.bg}`}>
                                        <Text className={`text-xs font-medium ${diffColors.text}`}>
                                            {DIFFICULTY_LABEL[journey.difficulty] ?? journey.difficulty}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Completed badge */}
                        {isCompleted ? (
                            <View className="flex-row items-center bg-green-50 p-3 rounded-xl mb-4">
                                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color="#16A34A" />
                                <Text className="text-sm font-semibold text-green-700 ml-2">
                                    Journey Completed!
                                </Text>
                            </View>
                        ) : null}

                        {/* Stats row */}
                        <View className="flex-row items-center gap-4 mb-5 py-3 border-y border-slate-100">
                            {journey.estimatedDays ? (
                                <View className="flex-row items-center gap-1.5">
                                    <HugeiconsIcon icon={Clock01Icon} size={16} color="#64748B" />
                                    <Text className="text-sm text-slate-600">
                                        {journey.estimatedDays} days
                                    </Text>
                                </View>
                            ) : null}
                            <View className="flex-row items-center gap-1.5">
                                <HugeiconsIcon icon={Target01Icon} size={16} color="#64748B" />
                                <Text className="text-sm text-slate-600">
                                    {journey.totalNodes} activities
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-1.5">
                                <HugeiconsIcon icon={BookOpen02Icon} size={16} color="#64748B" />
                                <Text className="text-sm text-slate-600">
                                    {sections.length} sections
                                </Text>
                            </View>
                        </View>

                        {/* Description */}
                        <Text className="text-base text-slate-700 leading-6 mb-5">
                            {journey.description}
                        </Text>

                        {/* Section preview */}
                        {sections.length > 0 ? (
                            <View className="mb-5">
                                <Text className="text-base font-bold text-slate-900 mb-3">
                                    What you'll learn
                                </Text>
                                {sections.map((section: MHTemplateUnit, index: number) => (
                                    <View
                                        key={section.id}
                                        className="flex-row items-start gap-3 mb-3"
                                    >
                                        <View
                                            className="w-7 h-7 rounded-full items-center justify-center mt-0.5"
                                            style={{ backgroundColor: `${accentColor}20` }}
                                        >
                                            <Text
                                                className="text-xs font-bold"
                                                style={{ color: accentColor }}
                                            >
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-semibold text-slate-800">
                                                {section.title}
                                            </Text>
                                            <Text className="text-xs text-slate-400 mt-0.5">
                                                {section.nodes.length} activities
                                            </Text>
                                            {section.description ? (
                                                <Text className="text-xs text-slate-500 mt-1" numberOfLines={2}>
                                                    {section.description}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : sectionsLoading ? (
                            <View className="mb-5">
                                <View className="h-4 w-32 bg-slate-100 rounded-full mb-3" />
                                <View className="h-12 bg-slate-50 rounded-xl mb-2" />
                                <View className="h-12 bg-slate-50 rounded-xl mb-2" />
                                <View className="h-12 bg-slate-50 rounded-xl" />
                            </View>
                        ) : null}

                        {/* Progress (if enrolled) */}
                        {isEnrolled && !isCompleted ? (
                            <View className="bg-slate-50 p-4 rounded-xl mb-5">
                                <Text className="text-sm font-semibold text-slate-700 mb-2">
                                    Your Progress
                                </Text>
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className="text-xs text-slate-400">
                                        {journey.completedNodes} of {journey.totalNodes} complete
                                    </Text>
                                    <Text className="text-xs font-semibold text-blue-600">
                                        {journey.totalNodes > 0
                                            ? Math.round((journey.completedNodes / journey.totalNodes) * 100)
                                            : 0}
                                        %
                                    </Text>
                                </View>
                                <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor: accentColor,
                                            width: `${journey.totalNodes > 0 ? Math.round((journey.completedNodes / journey.totalNodes) * 100) : 0}%`,
                                        }}
                                    />
                                </View>
                            </View>
                        ) : null}
                    </ScrollView>

                    {/* CTA Button — fixed at bottom */}
                    <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white border-t border-slate-100">
                        <Pressable
                            onPress={handleCTA}
                            className="py-4 rounded-2xl flex-row items-center justify-center"
                            style={{ backgroundColor: accentColor }}
                            accessibilityLabel={ctaLabel}
                            accessibilityRole="button"
                        >
                            <Text className="text-base font-bold text-white mr-2">{ctaLabel}</Text>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={18} color="#FFFFFF" />
                        </Pressable>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        );
    },
);

export default JourneyDetailSheet;
