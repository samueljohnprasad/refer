import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextInputSubmitEditingEvent,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { AudioWave01Icon } from "@hugeicons/core-free-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import {
  ComposerMeta,
  ComposerShell,
  composerStyles,
} from "@/src/components/exercise/ExerciseComposerParts";
import { ExerciseTextListComposer } from "@/src/components/exercise/ExerciseTextListComposer";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";

type BaseComposerProps = {
  minHeight?: number;
  maxLength?: number;
  helperText?: string;
  requirementText?: string;
  requirementVisible?: boolean;
  statusText?: string;
  statusVisible?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  glow?: boolean;
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

export type ExerciseTextComposerProps = SingleComposerProps | ListComposerProps;

function WaveBar({ delay }: { delay: number }) {
  const height = useSharedValue(4);
  React.useEffect(() => {
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
          backgroundColor: SEMANTIC_COLORS.text.primary,
          borderRadius: 2,
          marginHorizontal: 1,
        },
        style,
      ]}
    />
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
  const { t } = useTranslation("exercises");
  return (
    <Pressable
      style={({ pressed }) => [
        composerStyles.waveButton,
        isRecording && composerStyles.waveButtonRecording,
        pressed && composerStyles.pressed,
      ]}
      onPress={onPress}
      disabled={isTranscribing || !onPress}
      accessibilityRole="button"
      accessibilityLabel={t(
        isRecording
          ? "flow.ui.copy.text_composer_stop_voice_input"
          : "flow.ui.copy.text_composer_start_voice_input",
      )}
    >
      {isTranscribing ? (
        <ActivityIndicator
          size="small"
          color={SEMANTIC_COLORS.text.secondary}
        />
      ) : isRecording ? (
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 16 }}
        >
          {[0, 150, 75, 200].map((delay) => (
            <WaveBar key={delay} delay={delay} />
          ))}
        </View>
      ) : (
        <HugeiconsIcon
          icon={AudioWave01Icon}
          size={16}
          color={SEMANTIC_COLORS.text.secondary}
        />
      )}
    </Pressable>
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
    readOnly = false,
    autoFocus = true,
  } = props;
  const { isVoiceEnabled } = useVoiceFeature();
  const footer = useMemo(() => {
    if (!showVoice || !isVoiceEnabled) return null;
    const voiceAction = (
      <VoiceButton
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        onPress={onWavePress}
      />
    );
    if (alwaysShowVoice)
      return (
        <View style={composerStyles.footer}>
          <View style={composerStyles.leftActions} />
          <View style={composerStyles.rightActions}>{voiceAction}</View>
        </View>
      );
    return showVoice && !value.trim() ? (
      <View style={[composerStyles.footer, composerStyles.absoluteFooter]}>
        <View style={composerStyles.leftActions} />
        <View style={composerStyles.rightActions}>{voiceAction}</View>
      </View>
    ) : null;
  }, [
    alwaysShowVoice,
    isRecording,
    isTranscribing,
    isVoiceEnabled,
    onWavePress,
    showVoice,
    value,
  ]);

  return (
    <View>
      <ComposerShell
        value={value}
        onChange={(nextValue) => {
          if (!maxLength || nextValue.length <= maxLength) onChange(nextValue);
        }}
        placeholder={placeholder}
        minHeight={minHeight}
        readOnly={readOnly}
        autoFocus={autoFocus}
        blurOnSubmit={blurOnSubmit}
        onSubmitEditing={onSubmitEditing}
        footer={footer}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        maxLength={maxLength}
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

export function ExerciseTextComposer(props: ExerciseTextComposerProps) {
  return props.mode === "list" ? (
    <ExerciseTextListComposer {...props} />
  ) : (
    <SingleComposer {...props} />
  );
}

export default ExerciseTextComposer;
