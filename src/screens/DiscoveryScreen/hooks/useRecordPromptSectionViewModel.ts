import { useMemo, useCallback, useState, useEffect } from "react";
import { format } from "date-fns";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import type { GlassMenuConfig } from "@/src/components/ui/ConfigurableGlassMenu";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { SPRING_DEFAULT, TIMING_FADE } from "@/src/utils/motionTokens";

type AnimatedTextStyle = React.ComponentProps<typeof Animated.Text>["style"];

interface UseRecordPromptSectionOptions {
  selectedDate: Date;
  onDatePress: () => void;
  onTodayPress: () => void;
  prompt: string;
  onShufflePrompt: () => void;
  onOpenOptions: () => void;
}

export interface RecordPromptSectionViewModel {
  menuConfig: GlassMenuConfig;
  displayedPrompt: string;
  promptAnimStyle: AnimatedTextStyle;
}

// ponytail: prompt section hook encapsulating date formatting, menu creation, and text transition animation
export function useRecordPromptSectionViewModel({
  selectedDate,
  onDatePress,
  onTodayPress,
  prompt,
  onShufflePrompt,
  onOpenOptions,
}: UseRecordPromptSectionOptions): RecordPromptSectionViewModel {
  const reducedMotion = useReducedMotion();
  const promptOpacity = useSharedValue<number>(1);
  const promptTranslateY = useSharedValue<number>(0);
  const [displayedPrompt, setDisplayedPrompt] = useState<string>(prompt);

  const updatePromptAndAnimateIn = useCallback(
    (newPrompt: string): void => {
      setDisplayedPrompt(newPrompt);
      promptOpacity.value = withTiming(1, TIMING_FADE);
      promptTranslateY.value = withSpring(0, SPRING_DEFAULT);
    },
    [promptOpacity, promptTranslateY],
  );

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedPrompt(prompt);
      return;
    }
    promptOpacity.value = withTiming(0, TIMING_FADE, (finished) => {
      if (finished) {
        promptTranslateY.value = 8;
        runOnJS(updatePromptAndAnimateIn)(prompt);
      }
    });
  }, [
    prompt,
    reducedMotion,
    promptOpacity,
    promptTranslateY,
    updatePromptAndAnimateIn,
  ]);

  const promptAnimStyle = useAnimatedStyle(() => ({
    opacity: promptOpacity.value,
    transform: [{ translateY: promptTranslateY.value }],
  }));

  const formattedDate = useMemo(
    () => format(selectedDate, "MMMM d"),
    [selectedDate],
  );

  // ponytail: small control size with 44pt minHeight ensures comfortable tap target for full date row
  const menuConfig: GlassMenuConfig = useMemo(() => {
    return {
      title: `Journal · ${formattedDate}`,
      showChevron: true,
      controlSize: "small",
      minHeight: 44,
      titleTextStyle: "subheadline",
      sections: [
        {
          items: [
            {
              type: "button",
              id: "change-date",
              label: "Select Date",
              systemImage: "calendar",
              onPress: onDatePress,
            },
            {
              type: "button",
              id: "today",
              label: "Go to Today",
              systemImage: "calendar.badge.clock",
              onPress: onTodayPress,
            },
            {
              type: "button",
              id: "shuffle-prompt",
              label: "Shuffle Prompt",
              systemImage: "arrow.triangle.2.circlepath",
              onPress: onShufflePrompt,
            },
            {
              type: "button",
              id: "browse-prompts",
              label: "Browse All Prompts",
              systemImage: "list.bullet",
              onPress: onOpenOptions,
            },
          ],
        },
      ],
    };
  }, [
    formattedDate,
    onDatePress,
    onTodayPress,
    onShufflePrompt,
    onOpenOptions,
  ]);

  return {
    menuConfig,
    displayedPrompt,
    promptAnimStyle,
  };
}
