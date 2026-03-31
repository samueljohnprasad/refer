import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    useWindowDimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    AccessibilityInfo,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";
import { FeatureDiscoverySlide } from "../types";
import PremiumBadge from "../../../components/premium/PremiumBadge";

interface FeatureDiscoveryStepProps {
    slides: FeatureDiscoverySlide[];
}

interface SlideCardProps {
    slide: FeatureDiscoverySlide;
    cardWidth: number;
}

const SlideCard: React.FC<SlideCardProps> = ({ slide, cardWidth }) => (
    <View
        className="rounded-3xl p-6 mx-2 justify-between"
        style={{
            width: cardWidth,
            backgroundColor: slide.backgroundColor,
            minHeight: 260,
        }}
    >
        <View>
            <View className="flex-row items-center justify-between mb-4">
                <Text style={{ fontSize: 48 }}>{slide.emoji}</Text>
                {slide.isPremium && <PremiumBadge size="medium" />}
            </View>

            <Text
                className="text-gray-900 mb-2"
                style={{ fontSize: 22, fontWeight: "800", letterSpacing: -0.3 }}
            >
                {slide.title}
            </Text>

            <Text className="text-gray-600 text-sm font-medium leading-5">
                {slide.description}
            </Text>
        </View>

        <View className="bg-white/70 rounded-xl px-4 py-3 mt-5">
            <Text className="text-gray-700 text-xs font-semibold leading-4">
                📈 {slide.statLabel}
            </Text>
        </View>
    </View>
);

interface PageIndicatorProps {
    total: number;
    activeIndex: number;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({
    total,
    activeIndex,
}) => (
    <View className="flex-row items-center justify-center mt-6 gap-2">
        {Array.from({ length: total }).map((_: unknown, index: number) => (
            <View
                key={index}
                className={`rounded-full ${index === activeIndex
                    ? "w-6 h-2 bg-purple-600"
                    : "w-2 h-2 bg-gray-300"
                    }`}
            />
        ))}
    </View>
);

const FeatureDiscoveryStep: React.FC<FeatureDiscoveryStepProps> = ({
    slides,
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const cardWidth: number = screenWidth - 80;
    const scrollViewRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [reduceMotion, setReduceMotion] = useState<boolean>(false);
    const userInteractedRef = useRef<boolean>(false);

    useEffect(() => {
        const checkReduceMotion = async (): Promise<void> => {
            const isEnabled: boolean =
                await AccessibilityInfo.isReduceMotionEnabled();
            setReduceMotion(isEnabled);
        };
        checkReduceMotion();
        const subscription = AccessibilityInfo.addEventListener(
            "reduceMotionChanged",
            (isEnabled: boolean) => setReduceMotion(isEnabled),
        );
        return () => subscription.remove();
    }, []);

    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
            const contentOffsetX: number = event.nativeEvent.contentOffset.x;
            const newIndex: number = Math.round(contentOffsetX / (cardWidth + 16));
            if (
                newIndex !== activeIndex &&
                newIndex >= 0 &&
                newIndex < slides.length
            ) {
                setActiveIndex(newIndex);
            }
        },
        [activeIndex, cardWidth, slides.length],
    );

    const handleScrollBeginDrag = useCallback((): void => {
        userInteractedRef.current = true;
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
            autoScrollRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (reduceMotion || userInteractedRef.current) return;

        autoScrollRef.current = setInterval(() => {
            setActiveIndex((prev: number) => {
                const nextIndex: number = (prev + 1) % slides.length;
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * (cardWidth + 16),
                    animated: true,
                });
                return nextIndex;
            });
        }, 4000);

        return () => {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
            }
        };
    }, [cardWidth, slides.length, reduceMotion]);

    return (
        <View className="flex-1 pt-8">
            <Animated.View
                entering={FadeInUp.duration(600).springify()}
                className="items-center mb-6 px-6"
            >
                <Text
                    className="text-center text-gray-900 mb-2"
                    style={{
                        fontFamily: "CormorantBold",
                        fontSize: 28,
                        lineHeight: 34,
                        letterSpacing: -0.5,
                    }}
                >
                    Features built for you
                </Text>
                <Text className="text-center text-gray-500 text-sm font-medium">
                    Based on your goals, here's what'll help most
                </Text>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(500).delay(300)}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled={false}
                    snapToInterval={cardWidth + 16}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    onScrollBeginDrag={handleScrollBeginDrag}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingHorizontal: 32 }}
                    accessible
                    accessibilityLabel={`Feature carousel, ${slides.length} features. Swipe to browse.`}
                >
                    {slides.map((slide: FeatureDiscoverySlide) => (
                        <SlideCard
                            key={slide.id}
                            slide={slide}
                            cardWidth={cardWidth}
                        />
                    ))}
                </ScrollView>

                <PageIndicator
                    total={slides.length}
                    activeIndex={activeIndex}
                />
            </Animated.View>
        </View>
    );
};

export default React.memo(FeatureDiscoveryStep);


