/**
 * ConfigDrivenNode
 * Config-driven node renderer using AnimatedButton + HugeiconsIcon.
 *
 * Architecture:
 * - Icons:     Resolved from HUGEICON_REGISTRY via NodeIconConfig.value
 * - Colors:    Button bg = section theme.pathActiveColor (active/completed)
 *              or colorConfig.fill (locked). Shadow auto-darkened by 25%.
 * - Animation: Resolved from variant.activeAnimation via ANIMATION_FACTORIES
 * - ProgressRing conditionally shown from variant.showProgressRing
 * - BouncingTooltip for active node label
 *
 * ZERO svg XML, ZERO if/else for node type/icon/color.
 */

import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { Text } from "@/components/ui/text";
import AnimatedButton from "@/src/components/AnimatedButton";
import type { AnimatedButtonProps } from "@/src/components/AnimatedButton";
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

import type {
    PathNodeData,
    NodePosition,
    NodeIconConfig,
    NodeVariantConfig,
    NodeColorConfig,
    ColorThemeConfig,
} from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { ANIMATION_TIMING } from "@/src/data/journey/constants";
import {
    useJourneySettings,
    useNodeVariant,
    useColorTheme,
} from "@/src/context/JourneyConfigContext";
import { darkenHex } from "@/src/utils/colorUtils";
import { getHugeicon } from "@/src/data/journey/hugeiconsRegistry";

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
// NodeShellContent — Hugeicons-driven node button
//
// - Icon:  resolved from HUGEICON_REGISTRY via iconConfig.value
// - Color: theme.pathActiveColor for active/completed, colorConfig.fill for locked
// - Shadow: auto-darkened 25% from the face color
// ---------------------------------------------------------------------------

/** Darken factor applied to button face color to generate the 3D shadow */
const NODE_SHADOW_DARKEN_FACTOR = 0.25;
/** Icon color: white on colored backgrounds, grey-500 on locked grey */
const ICON_COLOR_ACTIVE = '#FFFFFF';
const ICON_COLOR_LOCKED = '#FFFFFF';

interface NodeShellContentProps {
    iconConfig: NodeIconConfig;
    /** Full node size — sets button minHeight/width */
    size: number;
    /** Resolved background color for this status */
    backgroundColor: string;
    /** Shell border color (unused visually but kept for API compat) */
    borderColor: string;
    /** Whether this node is active */
    isActive: boolean;
    /** Whether this node is completed */
    isCompleted: boolean;
    /** Section color theme (for active/completed background) */
    theme: ColorThemeConfig;
    /** Accessibility label */
    accessibilityLabel: string;
    /** Whether press is enabled */
    isInteractive: boolean;
    /** Press callback */
    onPress: () => void;
    /**
     * Button shape: 'squircle' (Duolingo-style pill) or 'circle' (fully round).
     * Defaults to 'squircle' when omitted.
     */
    shape?: 'squircle' | 'circle';
}

function NodeShellContent({
    iconConfig,
    size,
    backgroundColor,
    isActive,
    isCompleted,
    theme,
    accessibilityLabel,
    isInteractive,
    onPress,
    shape = 'squircle',
}: NodeShellContentProps): React.JSX.Element {
    // Map shape → AnimatedButton type
    const buttonType = shape === 'circle' ? 'capsule' : 'squircle';

    // Resolve the Hugeicons icon object from the registry
    const iconObj = getHugeicon(iconConfig.value);

    // Button face color: section accent for active/completed, colorConfig.fill for locked
    const faceColor: string = (isActive || isCompleted)
        ? theme.pathActiveColor
        : backgroundColor;

    // Shadow is always 25% darker than the face
    const shadowColor: string = darkenHex(faceColor, NODE_SHADOW_DARKEN_FACTOR);

    // Icon color: white for all states (locked uses same grey fill bg, still white icon)
    const iconColor: string = (isActive || isCompleted)
        ? ICON_COLOR_ACTIVE
        : ICON_COLOR_LOCKED;

    // Memoised customIcon component so AnimatedButton's React.memo sees a stable ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const customIcon = useCallback(
        () => (
            <HugeiconsIcon
                icon={iconObj}
                size={size * 0.45}
                color={iconColor}
                strokeWidth={1.8}
            />
        ),
        // Intentionally wide dep set: icon, size, color may all change per status
        [iconObj, size, iconColor],
    ) as AnimatedButtonProps['customIcon'];

    return (
        <AnimatedButton
            title=""
            onPress={onPress}
            disabled={!isInteractive}
            backgroundColor={faceColor}
            shadowColor={shadowColor}
            hapticStyle="Medium"
            type={buttonType}
            fullWidth={false}
            minHeight={size}
            customIcon={customIcon}
            iconSize={size * 0.45}
            accessibilityLabel={accessibilityLabel}
            style={{ width: size, marginBottom: 0, height: size }}
            textStyle={{ display: 'none' }}
        />
    );
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
            accessibilityRole="text"
            accessibilityLabel={label ? `Current task: ${label}` : undefined}
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
    /** Theme key from the parent unit to adapt the node color */
    colorThemeKey: string;
    /** Press handler */
    onPress: (node: PathNodeData) => void;
}

// ---------------------------------------------------------------------------
// ConfigDrivenNode — Main Component
// ---------------------------------------------------------------------------

function ConfigDrivenNodeInner({
    node,
    position,
    variantKey,
    colorThemeKey,
    onPress,
}: ConfigDrivenNodeProps): React.JSX.Element {
    const variant: NodeVariantConfig = useNodeVariant(variantKey);
    const theme = useColorTheme(colorThemeKey);
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

    // Glow style synced to animation progress (only for active nodes)
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

    // Progress ring dimensions
    const ringSize: number =
        size + settings.progressRingGap * 2 + settings.progressRingStroke * 2;
    const progressPercent: number = (node.progress ?? 0) * 100;

    const a11yLabel: string = `${variant.label} ${node.index + 1}, ${node.status}${isActive && node.progress !== undefined
        ? `, ${Math.round(node.progress * 100)}% complete`
        : ""
        }`;

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
            {/* Bouncing tooltip — use theme color for active node, else config fill */}
            <BouncingTooltip
                label={node.label}
                accentColor={isActive ? theme.pathActiveColor : colorConfig.fill}
            />

            {/* Progress ring — use theme color for active node */}
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
                        tintColor={theme.pathActiveColor}
                        backgroundColor={`${theme.pathActiveColor}33`}
                        rotation={0}
                        lineCap="round"
                    />
                </View>
            )}

            {/* Node visual — animated wrapper */}
            <Animated.View
                style={[
                    isActive ? activeScaleStyle : undefined,
                    isCompleted ? popStyle : undefined,
                ]}
            >
                <Animated.View style={isActive ? glowStyle : undefined}>
                    <NodeShellContent
                        iconConfig={iconConfig}
                        size={size}
                        backgroundColor={
                            isCompleted || isActive ? theme.pathActiveColor : colorConfig.fill
                        }
                        borderColor={
                            isCompleted || isActive ? theme.dividerColor : colorConfig.border
                        }
                        isActive={isActive}
                        isCompleted={isCompleted}
                        theme={theme}
                        accessibilityLabel={a11yLabel}
                        isInteractive={isInteractive}
                        onPress={handlePress}
                        shape={variant.shape ?? 'squircle'}
                    />
                </Animated.View>
            </Animated.View>
        </View>
    );
}

// Highly aggressive memoization to preserve scroll performance
export const ConfigDrivenNode = React.memo(
    ConfigDrivenNodeInner,
    (prev, next) => {
        // Only re-render if the core status changes, progress ticks, or theme changes.
        // X,Y positions never change at runtime so we don't bother deep comparing them.
        return (
            prev.node.id === next.node.id &&
            prev.node.status === next.node.status &&
            prev.node.progress === next.node.progress &&
            prev.variantKey === next.variantKey &&
            prev.colorThemeKey === next.colorThemeKey &&
            prev.position.x === next.position.x &&
            prev.position.y === next.position.y
        );
    },
);

export default ConfigDrivenNode;
