import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import {
  AudioWave01Icon,
  Tick01Icon,
  StopCircleIcon,
} from "@hugeicons/core-free-icons";
import {
  SAGE,
  BRAND_SURFACE,
  INK,
  INK_MUTED,
  BRAND_BORDER,
} from "../../lib/tokens";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEvent,
  View,
  ActivityIndicator,
} from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  withRepeat,
  withDelay,
} from "react-native-reanimated";

const canvasPadding = 50;
const borderRadius = 25;
const glowHeightExpansion = 10;

const glowColors = [
  SAGE[200],
  SAGE[50],
  SAGE[200],
];
const glowGradientColors = [...glowColors];
const positions = [0, 0.5, 1];

const travelingColors = ["transparent", SAGE[400], SAGE[500], "transparent"];
const travelingPositions = [0.3, 0.75, 0.4, 1];

export interface InputMessage {
  text?: string;
}

interface GlowyInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: ({ message }: { message: InputMessage }) => void;
  handleSubmitEditing: (e: TextInputSubmitEditingEvent) => void;
  placeholder?: string;
  onWavePress?: () => void;
  isRecording?: boolean;
  isTranscribing?: boolean;
}

const WaveBar = ({ delay }: { delay: number }) => {
  const height = useSharedValue(4);

  useEffect(() => {
    height.value = withDelay(
      delay,
      withRepeat(
        withTiming(12, {
          duration: 400 + Math.random() * 200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, [delay, height]);

  const style = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <Animated.View
      style={[
        {
          width: 2.5,
          backgroundColor: INK,
          borderRadius: 2,
          marginHorizontal: 1,
        },
        style,
      ]}
    />
  );
};

function GlowyInput({
  message,
  setMessage,
  handleSubmitEditing,
  handleSendMessage,
  placeholder,
  onWavePress,
  isRecording,
  isTranscribing,
}: GlowyInputProps) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const rotation = useSharedValue(0);
  const rotationSlow = useSharedValue(0);
  const blurIntensity = useSharedValue(20);

  useEffect(() => {
    const finalValue = 1e6;
    const durationFast = (finalValue / (Math.PI * 2)) * 4000;
    rotation.value = withTiming(finalValue, {
      duration: durationFast,
      easing: Easing.linear,
    });

    const durationSlow = (finalValue / (Math.PI * 2)) * 75000;
    rotationSlow.value = withTiming(finalValue, {
      duration: durationSlow,
      easing: Easing.linear,
    });
  }, [rotation, rotationSlow]);

  const animatedRotation = useDerivedValue(() => {
    "worklet";
    return [{ rotate: rotation.value % (Math.PI * 2) }];
  });

  const animatedRotationSlow = useDerivedValue(() => {
    "worklet";
    return [{ rotate: rotationSlow.value % (Math.PI * 2) }];
  });

  const onSend = () => {
    if (message.trim()) {
      handleSendMessage({ message: { text: message } });
      setMessage("");
    }
  };

  const { height: keyboardHeight, progress: keyboardProgress } =
    useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(() => ({
    // transform: [{ translateY: keyboardHeight.value }],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: keyboardProgress.value,
    transform: [{ translateY: (1 - keyboardProgress.value) * 10 }],
  }));

  const initialFooterStyle = useAnimatedStyle(() => ({
    opacity: 1 - keyboardProgress.value,
    transform: [{ translateY: keyboardProgress.value * -10 }],
  }));

  const strokeWidthTraveling = useDerivedValue(() => {
    return keyboardProgress.value * 1.8;
  });
  const strokeWidthGlow = useDerivedValue(() => {
    return keyboardProgress.value * 8;
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputWrapper,
          { opacity: dimensions ? 1 : 0 },
          animatedStyle,
        ]}
        onLayout={onLayout}
      >
        {dimensions && (
          <Canvas
            style={{
              position: "absolute",
              top: -canvasPadding,
              left: -canvasPadding,
              width: dimensions.width + canvasPadding * 2,
              height: dimensions.height + canvasPadding * 2,
            }}
          >
            <RoundedRect
              x={canvasPadding}
              y={canvasPadding - glowHeightExpansion / 2}
              width={dimensions.width}
              height={dimensions.height + glowHeightExpansion}
              r={borderRadius}
              opacity={keyboardProgress}
              strokeWidth={strokeWidthGlow}
            >
              <SweepGradient
                transform={animatedRotationSlow}
                origin={vec(
                  canvasPadding + dimensions.width / 2,
                  canvasPadding + dimensions.height / 2,
                )}
                c={vec(
                  canvasPadding + dimensions.width / 2,
                  canvasPadding + dimensions.height / 2,
                )}
                colors={glowGradientColors}
                positions={positions}
              />
              <BlurMask blur={blurIntensity} />
            </RoundedRect>

            <RoundedRect
              x={canvasPadding}
              y={canvasPadding}
              width={dimensions.width}
              height={dimensions.height}
              r={borderRadius}
              style="stroke"
              opacity={keyboardProgress}
              strokeWidth={strokeWidthTraveling}
            >
              <SweepGradient
                transform={animatedRotation}
                origin={vec(
                  canvasPadding + dimensions.width / 2,
                  canvasPadding + dimensions.height / 2,
                )}
                c={vec(
                  canvasPadding + dimensions.width / 2,
                  canvasPadding + dimensions.height / 2,
                )}
                colors={travelingColors}
                positions={travelingPositions}
              />
            </RoundedRect>
          </Canvas>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder || "Ask anything..."}
            placeholderTextColor={INK_MUTED}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="send"
            multiline
          />

          <View style={styles.footerContainer}>
            <Animated.View style={[styles.footer, footerStyle]}>
              <View style={{ flex: 1 }} />
              <Pressable
                disabled={!message?.trim()}
                onPress={onSend}
                style={({ pressed }) => [
                  styles.sendButton,
                  {
                    backgroundColor: message?.trim() ? SAGE[500] : BRAND_BORDER,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={18}
                  color={message?.trim() ? "#fff" : INK_MUTED}
                  strokeWidth={3}
                />
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[styles.footer, styles.absoluteFooter, initialFooterStyle]}
            >
              <View style={styles.leftActions}>
              </View>

              <View style={styles.rightActions}>
                <Pressable
                  style={styles.waveButton}
                  onPress={onWavePress}
                  disabled={isTranscribing}
                >
                  {isTranscribing ? (
                    <ActivityIndicator size="small" color={INK} />
                  ) : isRecording ? (
                    <View style={{ flexDirection: "row", alignItems: "center", height: 16 }}>
                      {[0, 150, 75, 200].map((delay, index) => (
                        <WaveBar key={index} delay={delay} />
                      ))}
                    </View>
                  ) : (
                    <HugeiconsIcon
                      icon={AudioWave01Icon}
                      size={18}
                      color={INK}
                    />
                  )}
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputContainer: {
    backgroundColor: BRAND_SURFACE,
    borderRadius: borderRadius,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 10,
    minHeight: 115,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: INK,
    textAlignVertical: "top",
    paddingTop: 0,
  },
  footerContainer: {
    height: 40,
    marginTop: 8,
    position: "relative",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  absoluteFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  leftActions: {
    flexDirection: "row",
    gap: 12,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  waveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SAGE[200],
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#333",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "500",
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

GlowyInput.displayName = "GlowyInput";
export default GlowyInput;
export type { GlowyInputProps };
