/**
 * ConfigDrivenNode (Task 5)
 * Config-driven node renderer that replaces PathNode.
 *
 * ZERO if/else or switch statements for node type, icon, or color.
 * All visuals are resolved from JourneyConfig via context lookups.
 *
 * Architecture:
 * - NodeShell: size, background, border, glow, shadow from NodeColorConfig
 * - NodeIconRenderer: renders SVG/emoji/hugeicons from NodeIconConfig
 * - Animation resolved from variant.activeAnimation via ANIMATION_FACTORIES
 * - ProgressRing conditionally shown from variant.showProgressRing
 * - BouncingTooltip for active node label
 */

import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { Text } from "@/components/ui/text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    withSequence,
    Easing,
    interpolate,
    type SharedValue,
} from "react-native-reanimated";

import type { PathNodeData, NodePosition, NodeIconConfig, NodeVariantConfig, NodeColorConfig } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { ANIMATION_TIMING } from "@/src/data/journey/constants";
import { useJourneySettings, useNodeVariant } from "@/src/context/JourneyConfigContext";
import { getSvg } from "@/src/data/journey";

// ---------------------------------------------------------------------------
// Animation Factory Registry — maps animation key → setup function
// No if/else: looked up by string key from variant.activeAnimation
// ---------------------------------------------------------------------------

type AnimationSetup = (
    progress: SharedValue<number>,
    reducedMotion: boolean,
) => void;

const ANIMATION_FACTORIES: Record<string, AnimationSetup> = {
    breathing: (progress: SharedValue<number>, reducedMotion: boolean): void => {
        if (reducedMotion) {
            progress.value = 0;
            return;
        }
        progress.value = withRepeat(
            withTiming(1, {
                duration: ANIMATION_TIMING.breathing,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true,
        );
    },
    shine: (progress: SharedValue<number>, reducedMotion: boolean): void => {
        if (reducedMotion) {
            progress.value = 0;
            return;
        }
        progress.value = withRepeat(
            withTiming(1, {
                duration: ANIMATION_TIMING.chestShine,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true,
        );
    },
    shake: (progress: SharedValue<number>, reducedMotion: boolean): void => {
        if (reducedMotion) {
            progress.value = 0;
            return;
        }
        progress.value = withRepeat(
            withSequence(
                withTiming(1, { duration: ANIMATION_TIMING.chestShake }),
                withTiming(-1, { duration: ANIMATION_TIMING.chestShake }),
                withTiming(0, { duration: ANIMATION_TIMING.chestShake }),
            ),
            -1,
            false,
        );
    },
    none: (): void => {
        // No animation
    },
};

// ---------------------------------------------------------------------------
// NodeIconRenderer — renders icon from config. No conditionals on node type.
// ---------------------------------------------------------------------------

interface NodeIconRendererProps {
    iconConfig: NodeIconConfig;
    size: number;
}

function NodeIconRenderer({
    iconConfig,
    size,
}: NodeIconRendererProps): React.JSX.Element {
    const iconSize: number = size * 0.55;

    /** Renderer map — looked up by iconConfig.type */
    const renderers: Record<string, () => React.JSX.Element> = {
        svg: (): React.JSX.Element => {
            const xml: string | undefined = getSvg(iconConfig.value);
            if (!xml) {
                return <Text className="text-lg">{"⭐"}</Text>;
            }
            return (
                <SvgXml
                    xml={xml}
                    width={iconSize}
                    height={iconSize}
                    accessibilityLabel={iconConfig.value}
                />
            );
        },
        emoji: (): React.JSX.Element => (
            <Text className="text-2xl">{iconConfig.value}</Text>
        ),
        hugeicons: (): React.JSX.Element => (
            // Fallback to emoji rendering — HugeIcons integration can be added later
            <Text className="text-2xl">{iconConfig.value}</Text>
        ),
    };

    const renderer = renderers[iconConfig.type] ?? renderers.emoji;
    return renderer();
}

// ---------------------------------------------------------------------------
// BouncingTooltip (reused from PathNode — identical behavior)
// ---------------------------------------------------------------------------

interface BouncingTooltipProps {
    label: string | undefined;
    accentColor: string;
}

function BouncingTooltip({
    label,
    accentColor,
}: BouncingTooltipProps): React.JSX.Element {
    const translateY = useSharedValue(0);
    const isVisible: boolean = Boolean(label);

    useEffect(() => {
        translateY.value = withRepeat(
            withTiming(-6, {
                duration: ANIMATION_TIMING.tooltipBounce,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true,
        );
    }, [translateY]);

    const bounceStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View
            className="absolute -top-10 bg-white rounded-lg px-3 py-1.5 z-10"
            style={[
                bounceStyle,
                {
                    opacity: isVisible ? 1 : 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                },
            ]}
            pointerEvents={isVisible ? "auto" : "none"}
        >
            <Text
                className="text-xs font-extrabold tracking-wider"
                style={{ color: accentColor }}
            >
                {label ?? ""}
            </Text>
            <View
                className="absolute -bottom-1.5 self-center w-3 h-3 bg-white"
                style={{ transform: [{ rotate: "45deg" }], left: "42%" }}
            />
        </Animated.View>
    );
}

// ---------------------------------------------------------------------------
// ConfigDrivenNode — Props
// ---------------------------------------------------------------------------

export interface ConfigDrivenNodeProps {
    /** Runtime node data (status, progress, label, etc.) */
    node: PathNodeData;
    /** Screen position for absolute placement */
    position: NodePosition;
    /** Variant key to look up from config */
    variantKey: string;
    /** Press handler */
    onPress: (node: PathNodeData) => void;
}

// ---------------------------------------------------------------------------
// ConfigDrivenNode — Component
// ---------------------------------------------------------------------------

function ConfigDrivenNode({
    node,
    position,
    variantKey,
    onPress,
}: ConfigDrivenNodeProps): React.JSX.Element {
    const variant: NodeVariantConfig = useNodeVariant(variantKey);
    const settings = useJourneySettings();
    const reducedMotion: boolean = useReducedMotion();

    // Resolve all visuals from config — ZERO hardcoded values
    const colorConfig: NodeColorConfig = variant.colors[node.status];
    const iconConfig: NodeIconConfig = variant.icons[node.status];
    const size: number = variant.size ?? settings.defaultNodeSize;
    const halfSize: number = size / 2;
    const isInteractive: boolean = node.status !== NodeStatus.LOCKED;
    const isActive: boolean = node.status === NodeStatus.ACTIVE;
    const isCompleted: boolean = node.status === NodeStatus.COMPLETED;

    // Track previous status for completion pop
    const prevStatusRef = useRef<string>(node.status);

    // ── Active animation (resolved from config key — no if/else) ──
    const animProgress = useSharedValue(0);

    useEffect(() => {
        if (isActive) {
            const factory: AnimationSetup =
                ANIMATION_FACTORIES[variant.activeAnimation] ??
                ANIMATION_FACTORIES.none;
            factory(animProgress, reducedMotion);
        } else {
            animProgress.value = 0;
        }
    }, [isActive, variant.activeAnimation, animProgress, reducedMotion]);

    // Breathing/shine scale style
    const activeScaleStyle = useAnimatedStyle(() => {
        const scale: number = interpolate(animProgress.value, [0, 1], [1, 1.08]);
        return { transform: [{ scale }] };
    });

    // Glow style synced to animation progress
    const glowStyle = useAnimatedStyle(() => {
        const shadowOpacity: number = interpolate(
            animProgress.value,
            [0, 1],
            [0.3, 0.7],
        );
        const shadowRadius: number = interpolate(
            animProgress.value,
            [0, 1],
            [8, 20],
        );
        return {
            shadowColor: colorConfig.glow ?? colorConfig.fill,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity,
            shadowRadius,
            elevation: 8,
        };
    });

    // ── Completion pop ──
    const popScale = useSharedValue(1);

    useEffect(() => {
        if (
            isCompleted &&
            prevStatusRef.current === NodeStatus.ACTIVE &&
            !reducedMotion
        ) {
            popScale.value = withSequence(
                withSpring(1.3, { damping: 8, stiffness: 200 }),
                withSpring(1, { damping: 12, stiffness: 180 }),
            );
        }
        prevStatusRef.current = node.status;
    }, [node.status, isCompleted, popScale, reducedMotion]);

    const popStyle = useAnimatedStyle(() => ({
        transform: [{ scale: popScale.value }],
    }));

    const handlePress = (): void => {
        if (!isInteractive) return;
        onPress(node);
    };

    // Progress ring
    const ringSize: number =
        size + settings.progressRingGap * 2 + settings.progressRingStroke * 2;
    const progressPercent: number = (node.progress ?? 0) * 100;

    return (
        <View
            className="absolute items-center justify-center"
            style={{
                left: position.x - halfSize,
                top: position.y - halfSize,
                width: size,
                height: size,
            }}
        >
            {/* Bouncing tooltip — accent color from config */}
            <BouncingTooltip
                label={node.label}
                accentColor={colorConfig.fill}
            />

            {/* Progress ring (only if variant config says to show it AND node is active) */}
            {variant.showProgressRing && isActive && (
                <View
                    className="absolute items-center justify-center"
                    style={{
                        width: ringSize,
                        height: ringSize,
                        left: -(ringSize - size) / 2,
                        top: -(ringSize - size) / 2,
                    }}
                >
                    <AnimatedCircularProgress
                        size={ringSize}
                        width={settings.progressRingStroke}
                        fill={progressPercent}
                        tintColor={colorConfig.fill}
                        backgroundColor={`${colorConfig.fill}33`}
                        rotation={0}
                        lineCap="round"
                    />
                </View>
            )}

            {/* Node circle — animations from config */}
            <Animated.View
                style={[
                    isActive ? activeScaleStyle : undefined,
                    isCompleted ? popStyle : undefined,
                ]}
            >
                <Animated.View style={isActive ? glowStyle : undefined}>
                    <PressableScale
                        onPress={handlePress}
                        disabled={!isInteractive}
                        scale={0.9}
                        hapticStyle="medium"
                        accessibilityRole="button"
                        accessibilityLabel={`${variant.label} ${node.index + 1}, ${node.status}${isActive && node.progress !== undefined ? `, ${Math.round(node.progress * 100)}% complete` : ""}`}
                        accessibilityState={{ disabled: !isInteractive }}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: colorConfig.fill,
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomWidth: 4,
                            borderBottomColor: colorConfig.border,
                            ...(isCompleted
                                ? {
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 8,
                                    elevation: 5,
                                }
                                : {}),
                        }}
                    >
                        <NodeIconRenderer
                            iconConfig={iconConfig}
                            size={size}
                        />
                    </PressableScale>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

export default React.memo(ConfigDrivenNode);
