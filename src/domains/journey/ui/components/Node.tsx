// ponytail: true
import React, { useCallback } from "react";
import { Pressable, AccessibilityInfo, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedProps,
  runOnJS,
  useReducedMotion,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { NodeType, NodeState } from "@/src/types/journey";
import { useNodeViewModel } from "../hooks/useNodeViewModel";
import { NodeSilhouette } from "./NodeShapes";

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeProps {
  type: NodeType;
  state: NodeState;
  id: string;
  index: number;
  position: NodePosition;
  size: number;
  label?: string;
  onPress: (node?: any) => void;
  accessibilityLabel: string;
}

const PRESS_SPRING = { damping: 14, stiffness: 400 };
const DEPTH = 6;

export const Node = React.memo(function Node({
  type,
  state,
  id,
  index,
  position,
  size,
  label,
  onPress,
  accessibilityLabel,
}: NodeProps) {
  const vm = useNodeViewModel(type, state, null);
  const yOffset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  const handlePressIn = useCallback(() => {
    if (!vm.isInteractive) return;
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    
    if (reduceMotion) {
      opacity.value = 0.6;
    } else {
      yOffset.value = withTiming(DEPTH, { duration: 80 });
    }
  }, [vm.isInteractive, yOffset, opacity, reduceMotion]);

  const handlePressOut = useCallback(() => {
    if (!vm.isInteractive) return;
    
    if (reduceMotion) {
      opacity.value = 1;
    } else {
      yOffset.value = withSpring(0, PRESS_SPRING);
    }
  }, [vm.isInteractive, yOffset, opacity, reduceMotion]);

  const handlePress = useCallback(() => {
    if (!vm.isInteractive) return;
    // We pass node object as requested by contract, though typically caller wraps it anyway.
    onPress({ id, index, type, state, position, size, label });
  }, [vm.isInteractive, onPress, id, index, type, state, position, size, label]);

  const hSize = size / 2;

  // Animate the face of the silhouette.
  // We use `cy` for lesson (ellipse) and `transform` for path shapes.
  const faceAnimatedProps = useAnimatedProps(() => {
    if (type === NodeType.LESSON) {
      return { transform: [{ translateY: yOffset.value }] };
    }
    // For NodeShapes paths, they are scaled relative to size via (100 / size).
    return { transform: [{ translateY: yOffset.value * (100 / size) }] };
  }, [type, hSize, size, yOffset]) as any;

  // Animate the icon overlay to follow the face.
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: yOffset.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const renderIcon = () => {
    if (vm.indicator === "lock") {
      return <Feather name="lock" size={24} color={vm.iconColor as string} />;
    }
    if (vm.indicator === "check") {
      return <FontAwesome5 name="check" size={24} color={vm.iconColor as string} />;
    }
    if (vm.indicator === "open-chest") {
      return <FontAwesome5 name="box-open" size={24} color={vm.iconColor as string} />;
    }
    
    if (vm.iconName) {
      if (vm.iconName === "shield" || vm.iconName === "shield-alt") {
        return <Ionicons name="shield" size={28} color={vm.iconColor as string} />;
      }
      if (vm.iconName === "award") {
        return <FontAwesome5 name="award" solid size={28} color={vm.iconColor as string} />;
      }
      return <Feather name={vm.iconName as any} size={28} color={vm.iconColor as string} />;
    }
    
    return null;
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: position.x - hSize,
          top: position.y - hSize,
          width: size,
          height: size + DEPTH,
          alignItems: "center",
          justifyContent: "center",
        },
        containerAnimatedStyle,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !vm.isInteractive }}
        accessibilityLabel={accessibilityLabel}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={{ width: size, height: size + DEPTH }}
      >
        <NodeSilhouette
          type={type}
          size={size}
          fill={vm.faceColor}
          rim={vm.rimColor}
          faceAnimatedProps={faceAnimatedProps}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: type === NodeType.LESSON ? "16%" : DEPTH, // Match the old 3D center precisely
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              elevation: 10,
            },
            iconAnimatedStyle,
          ]}
        >
          {renderIcon()}
        </Animated.View>

        {vm.indicator === "pulse" && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -8,
              left: -8,
              right: -8,
              bottom: DEPTH - 8,
              borderWidth: 2,
              borderColor: vm.faceColor,
              borderRadius: size,
              opacity: 0.5,
            }}
          />
        )}
      </Pressable>

      {label && state === NodeState.CURRENT && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: -40,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: "white",
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#E5E5E5",
              shadowColor: "#000",
              minWidth: 80,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            },
            iconAnimatedStyle,
          ]}
        >
          <Text style={{ fontFamily: "Nunito-Bold", fontSize: 14, color: "#4B4B4B" }}>
            {label}
          </Text>
          <View
            style={{
              position: "absolute",
              bottom: -6,
              alignSelf: "center",
              width: 10,
              height: 10,
              backgroundColor: "white",
              borderBottomWidth: 2,
              borderRightWidth: 2,
              borderColor: "#E5E5E5",
              transform: [{ rotate: "45deg" }],
            }}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
});
