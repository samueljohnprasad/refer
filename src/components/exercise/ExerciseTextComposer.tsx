import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEvent,
  View,
} from "react-native";
import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import { Feather } from "@expo/vector-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Add01Icon,
  AudioWave01Icon,
  Cancel01Icon,
  StopCircleIcon,
} from "@hugeicons/core-free-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import * as Haptics from "expo-haptics";

import useAudioRecording from "@/hooks/useAudioRecording";
import { useTranscribeAudio } from "@/hooks/useTranscribeAudio";
import { Text } from "@/src/components/ui/Text";
import { BRAND_SURFACE, INK, INK_MUTED, INK_SOFT, SAGE } from "@/lib/tokens";

const canvasPadding = 50;
const borderRadius = 20;
const glowHeightExpansion = 10;
const actionSize = 44;

const glowGradientColors = [SAGE[200], SAGE[50], SAGE[200]];
const glowPositions = [0, 0.5, 1];

const travelingColors = ["transparent", SAGE[400], SAGE[500], "transparent"];
const travelingPositions = [0.3, 0.75, 0.4, 1];

type BaseComposerProps = {
  minHeight?: number;
  maxLength?: number;
  helperText?: string;
  requirementText?: string;
  requirementVisible?: boolean;
  statusText?: string;
  statusVisible?: boolean;
  glow?: boolean;
  readOnly?: boolean;
};

type SingleComposerProps = BaseComposerProps & {
  mode?: "single";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  blurOnSubmit?: boolean;
  showVoice?: boolean;
  alwaysShowVoice?: boolean;
  onWavePress?: () => void;
  isRecording?: boolean;
  isTranscribing?: boolean;
};

type ListComposerProps = BaseComposerProps & {
  mode: "list";
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  addLabel?: string;
  maxItems?: number;
};

export type ExerciseTextComposerProps =
  | SingleComposerProps
  | ListComposerProps;

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
        true,
      ),
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

function ComposerShell({
  value,
  onChange,
  placeholder,
  minHeight,
  glow = false,
  readOnly = false,
  blurOnSubmit = false,
  onSubmitEditing,
  footer,
  isRecording = false,
  isTranscribing = false,
  maxLength,
  submitBehavior,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight: number;
  glow?: boolean;
  readOnly?: boolean;
  blurOnSubmit?: boolean;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  footer?: React.ReactNode;
  isRecording?: boolean;
  isTranscribing?: boolean;
  maxLength?: number;
  submitBehavior?: "submit" | "newline";
}) {
  const [isFocused, setIsFocused] = useState(false);
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
    if (!glow) return;

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
  }, [glow, rotation, rotationSlow]);

  const animatedRotation = useDerivedValue(() => {
    "worklet";
    return [{ rotate: rotation.value % (Math.PI * 2) }];
  });

  const animatedRotationSlow = useDerivedValue(() => {
    "worklet";
    return [{ rotate: rotationSlow.value % (Math.PI * 2) }];
  });

  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation();

  const strokeWidthTraveling = useDerivedValue(() => keyboardProgress.value * 1.8);
  const strokeWidthGlow = useDerivedValue(() => keyboardProgress.value * 8);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          isRecording && styles.inputWrapperRecording,
        ]}
        onLayout={onLayout}
      >
        {glow && dimensions ? (
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
                positions={glowPositions}
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
        ) : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { minHeight }]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={INK_SOFT}
            onSubmitEditing={onSubmitEditing}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="send"
            multiline
            editable={!readOnly && !isTranscribing}
            blurOnSubmit={blurOnSubmit}
            maxLength={maxLength}
            submitBehavior={submitBehavior}
          />
          {footer ? <View style={styles.footerContainer}>{footer}</View> : null}
        </View>
      </View>
    </View>
  );
}

function ComposerMeta({
  helperText,
  requirementText,
  requirementVisible,
  statusText,
  statusVisible,
  count,
  maxLength,
}: {
  helperText?: string;
  requirementText?: string;
  requirementVisible?: boolean;
  statusText?: string;
  statusVisible?: boolean;
  count?: number;
  maxLength?: number;
}) {
  const showCount =
    typeof count === "number" &&
    typeof maxLength === "number" &&
    count > Math.floor(maxLength * 0.8);

  return (
    <>
      <View className="mt-2 min-h-[24px] flex-row items-start justify-between gap-3">
        {helperText ? (
          <Text className="flex-1 text-[12px] leading-[18px] text-ink-soft">
            {helperText}
          </Text>
        ) : (
          <View className="flex-1" />
        )}

        {showCount ? (
          <Text
            className={`text-right text-[13px] ${
              count > maxLength * 0.9 ? "text-amber-500" : "text-ink-soft"
            }`}
          >
            {count} / {maxLength}
          </Text>
        ) : null}
      </View>

      {requirementVisible && requirementText ? (
        <Text variant="caption" className="mt-1 mb-2 text-ink-soft leading-relaxed">
          {requirementText}
        </Text>
      ) : null}

      {statusVisible && statusText ? (
        <View className="mt-2 mb-4 flex-row items-start px-1">
          <View className="mr-3 mt-[1px] h-5 w-5 rounded-full bg-sage-100 items-center justify-center">
            <Text className="text-[12px] text-sage-700">✓</Text>
          </View>
          <Text
            variant="caption"
            className="flex-1 text-[13px] leading-[19px] text-sage-800"
          >
            {statusText}
          </Text>
        </View>
      ) : null}
    </>
  );
}

function SingleComposer(props: SingleComposerProps) {
  const {
    value,
    onChange,
    placeholder,
    minHeight = 118,
    maxLength,
    helperText,
    requirementText,
    requirementVisible,
    statusText,
    statusVisible,
    onWavePress,
    isRecording = false,
    isTranscribing = false,
    showVoice = false,
    alwaysShowVoice = false,
    onSubmitEditing,
    blurOnSubmit = true,
    glow = false,
    readOnly = false,
  } = props;

  const footer = useMemo(() => {
    const hasFooterActions = showVoice;

    if (!hasFooterActions) return null;

    if (alwaysShowVoice) {
      return (
        <View style={styles.footer}>
          <View style={styles.leftActions} />
          <View style={styles.rightActions}>
            {showVoice ? (
              <VoiceButton
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                onPress={onWavePress}
              />
            ) : null}
          </View>
        </View>
      );
    }

    return (
      <>
        {showVoice && !value.trim() ? (
          <View style={[styles.footer, styles.absoluteFooter]}>
            <View style={styles.leftActions} />
            <View style={styles.rightActions}>
              <VoiceButton
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                onPress={onWavePress}
              />
            </View>
          </View>
        ) : null}
      </>
    );
  }, [
    alwaysShowVoice,
    isRecording,
    isTranscribing,
    onWavePress,
    showVoice,
    value,
  ]);

  return (
    <View>
      <ComposerShell
        value={value}
        onChange={(nextValue) => {
          if (!maxLength || nextValue.length <= maxLength) {
            onChange(nextValue);
          }
        }}
        placeholder={placeholder}
        minHeight={minHeight}
        glow={glow}
        readOnly={readOnly}
        blurOnSubmit={blurOnSubmit}
        onSubmitEditing={onSubmitEditing}
        footer={footer}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
      />

      <ComposerMeta
        helperText={helperText}
        requirementText={requirementText}
        requirementVisible={requirementVisible}
        statusText={statusText}
        statusVisible={statusVisible}
        count={value.length}
        maxLength={maxLength}
      />
    </View>
  );
}

function VoiceButton({
  isRecording,
  isTranscribing,
  onPress,
}: {
  isRecording?: boolean;
  isTranscribing?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.waveButton,
        isRecording && styles.waveButtonRecording,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={isTranscribing || !onPress}
      accessibilityRole="button"
      accessibilityLabel={isRecording ? "Stop voice input" : "Start voice input"}
    >
      {isTranscribing ? (
        <ActivityIndicator size="small" color={SAGE[600]} />
      ) : isRecording ? (
        <View style={{ flexDirection: "row", alignItems: "center", height: 16 }}>
          {[0, 150, 75, 200].map((delay, index) => (
            <WaveBar key={index} delay={delay} />
          ))}
        </View>
      ) : (
        <HugeiconsIcon icon={AudioWave01Icon} size={16} color={SAGE[600]} />
      )}
    </Pressable>
  );
}

function ListComposer(props: ListComposerProps) {
  const {
    items,
    onAdd,
    onRemove,
    maxItems,
    maxLength,
    placeholder = "Type or use voice...",
    readOnly = false,
    addLabel = "Add",
    minHeight = 118,
    helperText,
    requirementText,
    requirementVisible,
    statusText,
    statusVisible,
    glow = false,
  } = props;
  const [value, setValue] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const { recordedStatus, recordingCurrentState, record, stopRecording } =
    useAudioRecording();
  const { transcribeAudio, isTranscribing } = useTranscribeAudio();
  const processedRecordingUrlRef = useRef<string | null>(null);

  const isRecording = recordingCurrentState === "recording";
  const hasReachedMaxItems = maxItems !== undefined && items.length >= maxItems;
  const canAdd = value.trim().length > 0 && !hasReachedMaxItems;

  const commitValue = (nextValue: string) => {
    const normalized = nextValue.trim();
    const boundedValue =
      typeof maxLength === "number" ? normalized.slice(0, maxLength) : normalized;
    if (!boundedValue || hasReachedMaxItems) return;
    onAdd(boundedValue);
    setValue("");
    setVoiceError(null);
  };

  useEffect(() => {
    const uri = recordedStatus?.url;
    if (
      !recordedStatus?.isFinished ||
      !uri ||
      processedRecordingUrlRef.current === uri
    ) {
      return;
    }

    processedRecordingUrlRef.current = uri;
    let cancelled = false;

    const transcribeFinishedRecording = async () => {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const result = await transcribeAudio(uri);
        if (!cancelled && result?.transcript) {
          commitValue(result.transcript);
        }
      } catch {
        if (!cancelled) {
          setVoiceError("Voice note unavailable. You can type this item instead.");
        }
      }
    };

    void transcribeFinishedRecording();

    return () => {
      cancelled = true;
    };
  }, [recordedStatus, transcribeAudio]);

  const handleToggleRecording = async () => {
    setVoiceError(null);

    if (isRecording) {
      try {
        const recorderState = await stopRecording();
        const uri = recorderState?.url;
        if (uri) {
          processedRecordingUrlRef.current = uri;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const result = await transcribeAudio(uri);
          if (result?.transcript) {
            commitValue(result.transcript);
          }
        }
      } catch {
        setVoiceError("Voice note unavailable. You can type this item instead.");
      }
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await record();
    } catch {
      setVoiceError("Could not start recording. You can type this item instead.");
    }
  };

  return (
    <View>
      {items.length > 0 ? (
        <View className="mb-3 border-t border-sage-100/70">
          {items.map((item, index) => (
            <View
              key={`${item}-${index}`}
              className="min-h-[52px] flex-row items-start border-b border-sage-100/70 py-3"
            >
              <View
                className="mr-3 mt-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: SAGE[400] }}
              />
              <Text className="flex-1 pr-2 text-[15px] leading-[21px] text-ink">
                {item}
              </Text>
              {!readOnly ? (
                <Pressable
                  onPress={() => onRemove(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove item ${index + 1}: ${item}`}
                  className="h-11 w-11 items-center justify-center active:opacity-60"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={16}
                    color={SAGE[500]}
                  />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {!readOnly && (!hasReachedMaxItems || isRecording || isTranscribing) ? (
        <>
          <ComposerShell
            value={value}
            onChange={(nextValue) => {
              if (!maxLength || nextValue.length <= maxLength) {
                setValue(nextValue);
              }
            }}
            placeholder={isRecording ? "Listening..." : placeholder}
            minHeight={minHeight}
            glow={glow}
            onSubmitEditing={() => commitValue(value)}
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            maxLength={maxLength}
            submitBehavior="submit"
            footer={
              <View style={styles.footer}>
                <Pressable
                  onPress={handleToggleRecording}
                  disabled={isTranscribing || (hasReachedMaxItems && !isRecording)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isRecording ? "Stop recording item" : "Start voice input"
                  }
                  accessibilityState={{
                    busy: isTranscribing,
                    selected: isRecording,
                  }}
                  style={({ pressed }) => [
                    styles.waveButton,
                    isRecording && styles.waveButtonRecording,
                    pressed && styles.pressed,
                  ]}
                >
                  {isTranscribing ? (
                    <ActivityIndicator size="small" color={SAGE[600]} />
                  ) : (
                    <HugeiconsIcon
                      icon={isRecording ? StopCircleIcon : AudioWave01Icon}
                      size={20}
                      color={isRecording ? BRAND_SURFACE : SAGE[600]}
                      strokeWidth={2}
                    />
                  )}
                </Pressable>

                <Pressable
                  onPress={() => commitValue(value)}
                  disabled={!canAdd || isRecording}
                  accessibilityRole="button"
                  accessibilityLabel="Add item"
                  accessibilityState={{ disabled: !canAdd || isRecording }}
                  style={({ pressed }) => [
                    styles.inlineActionButton,
                    {
                      backgroundColor: canAdd && !isRecording ? SAGE[500] : SAGE[50],
                      borderColor: canAdd && !isRecording ? SAGE[500] : SAGE[100],
                      opacity: canAdd && !isRecording ? 1 : 0.62,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={18}
                    color={canAdd && !isRecording ? BRAND_SURFACE : SAGE[500]}
                    strokeWidth={2}
                  />
                  <Text
                    className="ml-2 text-[14px] font-bold"
                    style={{
                      color: canAdd && !isRecording ? BRAND_SURFACE : SAGE[500],
                    }}
                  >
                    {addLabel}
                  </Text>
                </Pressable>
              </View>
            }
          />

          {voiceError ? (
            <Text className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              {voiceError}
            </Text>
          ) : null}
        </>
      ) : null}

      <ComposerMeta
        helperText={helperText}
        requirementText={requirementText}
        requirementVisible={requirementVisible}
        statusText={statusText}
        statusVisible={statusVisible}
      />
    </View>
  );
}

export function ExerciseTextComposer(props: ExerciseTextComposerProps) {
  if (props.mode === "list") {
    return <ListComposer {...props} />;
  }

  return <SingleComposer {...props} />;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    borderRadius,
    borderWidth: 1,
    borderColor: SAGE[200],
    backgroundColor: BRAND_SURFACE,
  },
  inputWrapperFocused: {
    borderColor: SAGE[500],
  },
  inputWrapperRecording: {
    borderColor: SAGE[600],
    backgroundColor: SAGE[50],
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderRadius,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  input: {
    fontSize: 16,
    lineHeight: 23,
    color: INK,
    textAlignVertical: "top",
    paddingTop: 0,
    paddingBottom: 0,
  },
  footerContainer: {
    minHeight: actionSize,
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
  waveButton: {
    width: actionSize,
    height: actionSize,
    borderRadius: actionSize / 2,
    backgroundColor: SAGE[50],
    borderWidth: 1,
    borderColor: SAGE[100],
    justifyContent: "center",
    alignItems: "center",
  },
  waveButtonRecording: {
    backgroundColor: SAGE[100],
    borderColor: SAGE[300],
  },
  inlineActionButton: {
    height: actionSize,
    borderRadius: actionSize / 2,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});

export default ExerciseTextComposer;
