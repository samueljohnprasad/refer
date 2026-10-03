import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import type { GlassMenuConfig } from "@/src/components/ui/ConfigurableGlassMenu";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { useTranslation } from "react-i18next";

type AnimatedTextStyle = React.ComponentProps<typeof Animated.Text>["style"];

interface UseRecordPromptSectionOptions {
  selectedDate: Date;
  onDatePress: () => void;
  onTodayPress: () => void;
  prompt: string;
  onShufflePrompt: () => void;
  onOpenOptions: () => void;
  headerRight?: React.ReactNode;
}

export interface RecordPromptSectionViewModel {
  menuConfig: GlassMenuConfig;
  displayedPrompt: string;
  promptAnimStyle: AnimatedTextStyle;
  onShufflePrompt: () => void;
  headerRight?: React.ReactNode;
}

// ponytail: prompt section hook with mount guard, fast ease-out exit (100ms), and subtle spring scale enter (0.98 -> 1)
export function useRecordPromptSectionViewModel({
  selectedDate,
  onDatePress,
  onTodayPress,
  prompt,
  onShufflePrompt,
  onOpenOptions,
  headerRight,
}: UseRecordPromptSectionOptions): RecordPromptSectionViewModel {
  const { i18n, t } = useTranslation("journal");
  const reducedMotion = useReducedMotion();
  const isFirstMount = useRef(true);
  const promptOpacity = useSharedValue<number>(1);
  const promptTranslateY = useSharedValue<number>(0);
  const promptScale = useSharedValue<number>(1);
  const [displayedPrompt, setDisplayedPrompt] = useState<string>(prompt);

  const updatePromptAndAnimateIn = useCallback(
    (newPrompt: string): void => {
      setDisplayedPrompt(newPrompt);
      promptOpacity.value = withTiming(1, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      });
      promptTranslateY.value = withSpring(0, {
        damping: 18,
        stiffness: 180,
        overshootClamping: true,
      });
      promptScale.value = withSpring(1, {
        damping: 18,
        stiffness: 180,
        overshootClamping: true,
      });
    },
    [promptOpacity, promptTranslateY, promptScale],
  );

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (reducedMotion) {
      setDisplayedPrompt(prompt);
      return;
    }
    // ponytail: fast ease-out exit with subtle scale(0.98), never animate from scale(0)
    promptOpacity.value = withTiming(0, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
    promptScale.value = withTiming(0.98, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    }, (finished) => {
      if (finished) {
        promptTranslateY.value = 6;
        runOnJS(updatePromptAndAnimateIn)(prompt);
      }
    });
  }, [
    prompt,
    reducedMotion,
    promptOpacity,
    promptTranslateY,
    promptScale,
    updatePromptAndAnimateIn,
  ]);

  const promptAnimStyle = useAnimatedStyle(() => ({
    opacity: promptOpacity.value,
    transform: [
      { translateY: promptTranslateY.value },
      { scale: promptScale.value },
    ],
  }));

  const formattedDate = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { month: "long", day: "numeric" }).format(selectedDate),
    [selectedDate, i18n.language],
  );

  // ponytail: quiet metadata styling with secondary neutral and medium weight
  const menuConfig: GlassMenuConfig = useMemo(() => {
    return {
      title: t("capture.menu.journal", { date: formattedDate }),
      showChevron: true,
      controlSize: "small",
      minHeight: 40,
      titleTextStyle: "subheadline",
      titleColor: "#616D5F",
      titleWeight: "medium",
      chevronSize: 10,
      chevronColor: "#808C7E",
      sections: [
        {
          items: [
            {
              type: "button",
              id: "change-date",
              label: t("capture.selectDate"),
              systemImage: "calendar",
              onPress: onDatePress,
            },
            {
              type: "button",
              id: "today",
              label: t("capture.menu.today"),
              systemImage: "calendar.badge.clock",
              onPress: onTodayPress,
            },
            {
              type: "button",
              id: "shuffle-prompt",
              label: t("capture.shufflePrompt"),
              systemImage: "arrow.triangle.2.circlepath",
              onPress: onShufflePrompt,
            },
            {
              type: "button",
              id: "browse-prompts",
              label: t("capture.menu.browse"),
              systemImage: "list.bullet",
              onPress: onOpenOptions,
            },
          ],
        },
      ],
    };
  }, [
    formattedDate,
    t,
    onDatePress,
    onTodayPress,
    onShufflePrompt,
    onOpenOptions,
  ]);

  return {
    menuConfig,
    displayedPrompt,
    promptAnimStyle,
    onShufflePrompt,
    headerRight,
  };
}
