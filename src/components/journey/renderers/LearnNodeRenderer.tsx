/**
 * LearnNodeRenderer (P1.3.1)
 * Full-screen swipeable card carousel for Learn nodes (2-4 min psychoeducation).
 *
 * Features:
 * - Horizontal swipe between cards with spring animation
 * - Illustration area (top 60%) + text content (bottom 40%)
 * - Max 40 words per card enforced in display
 * - Progress dots at bottom
 * - Last card = "Key Takeaway" with distinct styling
 * - "Continue" button on last card → triggers completion callback
 * - Cannot skip forward, but can swipe back
 * - Accessibility: screen reader announces card content
 *
 * Container/Presentation split:
 * This file is the Presentation layer. The container that provides
 * LearnContent and handles completion is the parent screen.
 */

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    type ViewToken,
    type NativeSyntheticEvent,
    type NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    useAnimatedScrollHandler,
    type SharedValue,
} from "react-native-reanimated";

import type { LearnContent, LearnCard } from "@/src/types/journey/mentalHealth";
import {
    RendererPrimaryCTA,
    RendererSectionCard,
    RendererTitleBlock,
    RendererTopProgress,
} from "./RendererFrame";

// ============================================================================
// Types
// ============================================================================

export interface LearnNodeRendererProps {
    /** Learn node content from the template JSONB */
    content: LearnContent;
    /** Node title (shown in header) */
    title: string;
    /** Estimated minutes */
    estimatedMinutes: number;
    /** XP reward displayed in the renderer header */
    xpReward?: number;
    /** Called when user taps "Continue" on the last card */
    onComplete: () => void;
    /** Called when user taps back button */
    onBack: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const MAX_WORD_COUNT: number = 40;

/** Visual key → icon/emoji mapping for illustration area */
const VISUAL_MAP: Record<string, { emoji: string }> = {
    brain: { emoji: "🧠" },
    heart: { emoji: "❤️" },
    calm: { emoji: "🧘" },
    storm: { emoji: "⛈️" },
    shield: { emoji: "🛡️" },
    magnifier: { emoji: "🔍" },
    lightbulb: { emoji: "💡" },
    thought: { emoji: "💭" },
    body: { emoji: "🧍" },
    breath: { emoji: "🌬️" },
    anchor: { emoji: "⚓" },
    wave: { emoji: "🌊" },
    sun: { emoji: "☀️" },
    star: { emoji: "⭐" },
    trophy: { emoji: "🏆" },
    key: { emoji: "🔑" },
    book: { emoji: "📖" },
    puzzle: { emoji: "🧩" },
    tree: { emoji: "🌳" },
    mountain: { emoji: "🏔️" },
    default: { emoji: "📚" },
};

// ============================================================================
// Helpers
// ============================================================================

/** Truncate text to MAX_WORD_COUNT words */
function truncateWords(
    text: string,
    maxWords: number = MAX_WORD_COUNT,
): string {
    const words: string[] = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "…";
}

/** Resolve visual_key to icon config */
function resolveVisual(visualKey: string): { emoji: string } {
    return VISUAL_MAP[visualKey] ?? VISUAL_MAP.default;
}

// ============================================================================
// Sub-components
// ============================================================================

/** A single learn card */
function CardItem({
    card,
    index,
    totalCards,
    width,
    scrollX,
}: {
    card: LearnCard;
    index: number;
    totalCards: number;
    width: number;
    scrollX: SharedValue<number>;
}): React.JSX.Element {
    const isLastCard: boolean = index === totalCards - 1;
    const visual = resolveVisual(card.visual_key);
    const displayText: string = truncateWords(card.text);

    const animatedStyle = useAnimatedStyle(() => {
        const inputRange: number[] = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        const scale: number = interpolate(
            scrollX.value,
            inputRange,
            [0.92, 1, 0.92],
            Extrapolation.CLAMP,
        );

        const opacity: number = interpolate(
            scrollX.value,
            inputRange,
            [0.6, 1, 0.6],
            Extrapolation.CLAMP,
        );

        return { transform: [{ scale }], opacity };
    });

    return (
        <Animated.View
            style={[animatedStyle, { width }]}
            className="px-7"
            accessibilityLabel={`Card ${index + 1} of ${totalCards}. ${card.text}`}
            accessibilityRole="text"
        >
            <RendererSectionCard
                eyebrow={isLastCard ? "Key takeaway" : "The concept"}
                className="min-h-[320px] p-5"
            >
                <Text className="happy-font-heading-medium text-[22px] leading-8 text-ink">
                    {displayText}
                </Text>

                <View className="mt-8 flex-row items-center justify-between">
                    <View className="items-center">
                        <View className="h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-sage-200 bg-sage-50">
                            <Text className="text-3xl">{visual.emoji}</Text>
                        </View>
                        <Text className="happy-brand-eyebrow mt-3 text-[10px]">
                            Feel it
                        </Text>
                    </View>
                    <Text className="happy-font-heading-bold text-3xl text-sage-300">{">"}</Text>
                    <View className="items-center">
                        <View className="h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-sage-200 bg-sage-50">
                            <Text className="text-3xl">📝</Text>
                        </View>
                        <Text className="happy-brand-eyebrow mt-3 text-[10px]">
                            Name it
                        </Text>
                    </View>
                    <Text className="happy-font-heading-bold text-3xl text-sage-300">{">"}</Text>
                    <View className="items-center">
                        <View className="h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-sage-200 bg-sage-50">
                            <Text className="text-3xl">❄️</Text>
                        </View>
                        <Text className="happy-brand-eyebrow mt-3 text-[10px]">
                            Cools
                        </Text>
                    </View>
                </View>
            </RendererSectionCard>
        </Animated.View>
    );
}

/** Progress dots */
function ProgressDots({
    total,
    current,
}: {
    total: number;
    current: number;
}): React.JSX.Element {
    return (
        <View className="flex-row items-center justify-center gap-2 py-2">
            {Array.from({ length: total }, (_, i: number) => (
                <View
                    key={i}
                    className={`rounded-full ${i === current
                        ? "h-2 w-6 bg-sage-500"
                        : i < current
                            ? "h-2 w-2 bg-sage-300"
                            : "h-2 w-2 bg-sage-100"
                        }`}
                />
            ))}
        </View>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function LearnNodeRenderer({
    content,
    title,
    estimatedMinutes,
    xpReward,
    onComplete,
    onBack,
}: LearnNodeRendererProps): React.JSX.Element {
    const { width: screenWidth } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [highestViewed, setHighestViewed] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useSharedValue<number>(0);

    const cards: LearnCard[] = content.cards;
    const totalCards: number = cards.length;
    const isOnLastCard: boolean = currentIndex === totalCards - 1;

    // Track scroll position for card animations
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    // Track visible card index
    const viewabilityConfig = useMemo(
        () => ({ viewAreaCoveragePercentThreshold: 50 }),
        [],
    );

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                const newIndex: number = viewableItems[0].index;
                setCurrentIndex(newIndex);
                setHighestViewed((prev: number) => Math.max(prev, newIndex));
            }
        },
        [],
    );

    // Prevent skipping forward (can only advance to highestViewed + 1)
    const handleScrollEnd = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
            const offsetX: number = e.nativeEvent.contentOffset.x;
            const newIndex: number = Math.round(offsetX / screenWidth);

            // If user tried to skip ahead, snap back
            if (newIndex > highestViewed + 1) {
                flatListRef.current?.scrollToIndex({
                    index: highestViewed,
                    animated: true,
                });
            }
        },
        [highestViewed, screenWidth],
    );

    // Render card
    const renderCard = useCallback(
        ({
            item,
            index,
        }: {
            item: LearnCard;
            index: number;
        }): React.JSX.Element => (
            <CardItem
                card={item}
                index={index}
                totalCards={totalCards}
                width={screenWidth}
                scrollX={scrollX}
            />
        ),
        [totalCards, screenWidth, scrollX],
    );

    const keyExtractor = useCallback(
        (_: LearnCard, index: number): string => `learn-card-${index}`,
        [],
    );

    const handleContinuePress = useCallback((): void => {
        if (isOnLastCard || totalCards <= 1) {
            onComplete();
            return;
        }

        const nextIndex = Math.min(currentIndex + 1, totalCards - 1);
        setHighestViewed((prev: number) => Math.max(prev, nextIndex));
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, [currentIndex, isOnLastCard, onComplete, totalCards]);

    // Swipe hint text
    const hintText: string = isOnLastCard
        ? ""
        : `Swipe left or tap continue · ${totalCards - currentIndex - 1} remaining`;

    return (
        <View className="happy-brand-screen flex-1">
            <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <RendererTopProgress
                progress={totalCards > 0 ? (currentIndex + 1) / totalCards : 0}
                xpReward={xpReward}
                onClose={onBack}
            />

            <RendererTitleBlock
                eyebrow={`Day 1 - Lesson ${currentIndex + 1} of ${totalCards}`}
                title={title}
                subtitle={`${estimatedMinutes}-minute lesson. Swipe through, then continue.`}
            />

            {/* Card carousel */}
            <View className="flex-1">
                <Animated.FlatList
                    ref={flatListRef as React.RefObject<FlatList>}
                    data={cards}
                    renderItem={renderCard}
                    keyExtractor={keyExtractor}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    onMomentumScrollEnd={handleScrollEnd}
                    bounces={false}
                    decelerationRate="fast"
                    getItemLayout={(_, index: number) => ({
                        length: screenWidth,
                        offset: screenWidth * index,
                        index,
                    })}
                />
            </View>

            {/* Bottom area: dots + hint/button */}
            <View className="px-7 pb-5">
                {/* Progress dots */}
                <ProgressDots
                    total={totalCards}
                    current={currentIndex}
                />

                {/* Swipe hint or Continue button */}
                {isOnLastCard ? null : (
                    <Text
                        className="happy-font-body-medium py-3 text-center text-xs text-ink-muted"
                        accessibilityHint="Swipe left to see the next card"
                    >
                        {hintText}
                    </Text>
                )}
                <RendererPrimaryCTA
                    label="Continue"
                    onPress={handleContinuePress}
                />
            </View>
            </SafeAreaView>
        </View>
    );
}
