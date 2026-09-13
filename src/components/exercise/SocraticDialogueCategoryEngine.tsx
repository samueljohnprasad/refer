// ponytail: SocraticDialogueCategoryEngine with 2-stage guided discovery and 3-step compression
import React, { useEffect, useState, useRef } from "react";
import { AccessibilityInfo, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { readRecord, readString } from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import {
  CompressedStageCard,
  DialogueBubble,
  EyebrowLabel,
  FinalSummaryCard,
  HintButton,
  InlineHintCard,
  PedagogicalFeedback,
} from "./SocraticDialogueComponents";

const CONTENT = {
  title: "A 2am conversation",
  instruction: "Choose what you’d ask next.",
  hintTitle: "Why test the thought?",
  hintBody:
    "You’re not trying to force a positive answer.\n\nYou’re checking what the prediction is actually based on.",
  personInitial:
    "I woke up at 2am convinced tomorrow’s presentation will be a total disaster.\n\nMy mind says everyone will see I’m incompetent.",
  r1Pref: "What specific evidence makes you certain?",
  r1Alt: "Has a presentation ever gone okay before?",
  r1AltFeedback:
    "That checks past experience. First, let’s see what tonight’s prediction is based on.",
  r1PersonResponse:
    "I haven’t memorized slide 14, and I stumbled once during rehearsal.",
  prediction: "Tomorrow’s presentation will be a disaster.",
  evidence: ["One unfinished slide.", "One rehearsal stumble."],
  r2Pref: "Does stumbling in rehearsal guarantee disaster?",
  r2Alt: "What happens if you need to glance at your notes?",
  r2AltFeedback:
    "That checks how you could cope. Now test whether the stumble itself predicts disaster.",
  r2PersonResponse: "No. Rehearsal is where I catch the rough spots.",
  balancedThought:
    "A rough rehearsal doesn’t prove tomorrow will go badly.\n\nRehearsal showed me what still needs work. I can deal with that tomorrow.",
  skill:
    "A prediction can feel certain without being evidence.\n\nCheck the evidence before treating it as fact.",
} as const;

export function SocraticDialogueCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps): React.JSX.Element {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const initialDone = saved?.done === true;
  const initialStep = initialDone ? 6 : typeof saved?.step === "number" ? saved.step : 0;

  const [step, setStep] = useState<number>(initialStep);
  const [hintOpen, setHintOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Sync initial response on mount
  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse({ step: 0, done: false }), false);
    }
  }, [onInteraction, saved]);

  const advanceTo = (nextStep: number, delayMs: number = 0) => {
    if (locked) return;
    Haptics.selectionAsync();

    const applyStep = (s: number) => {
      setStep(s);
      const isDone = s === 6;
      onInteraction(
        createResponse({
          step: s,
          phase: s < 3 ? "round1" : s < 6 ? "round2" : "summary",
          done: isDone,
        }),
        isDone,
      );
    };

    if (delayMs > 0 && !reduceMotion) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => applyStep(nextStep), delayMs);
    } else {
      applyStep(nextStep);
    }
  };

  const title = readString(content.title) ?? CONTENT.title;
  const instruction =
    step === 6
      ? "Prediction vs. evidence."
      : readString(content.instruction) ?? CONTENT.instruction;

  // Hint is only visible during round 1
  const showHintButton = step < 3;

  return (
    <View className="-mt-7 px-2 pb-6">
      {/* Title block with horizontally aligned Hint pill // ponytail: standard rhythm */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between gap-3">
          <Text
            accessibilityRole="header"
            className="happy-font-heading flex-1 text-2xl leading-[30px] tracking-[-0.4px] text-[#201E1D]"
          >
            {title}
          </Text>
          {showHintButton ? (
            <HintButton
              isOpen={hintOpen}
              onToggle={() => {
                Haptics.selectionAsync();
                setHintOpen(!hintOpen);
              }}
            />
          ) : null}
        </View>
        <Text className="happy-font-body mt-1.5 text-[15px] leading-[21px] text-[#82796A]">
          {instruction}
        </Text>
      </View>

      {showHintButton && hintOpen ? (
        <InlineHintCard
          title={readString(content.hintTitle) ?? CONTENT.hintTitle}
          body={readString(content.hintBody) ?? CONTENT.hintBody}
          onClose={() => {
            Haptics.selectionAsync();
            setHintOpen(false);
          }}
        />
      ) : null}

      {/* Summary state */}
      {step === 6 ? (
        <View className="mt-3">
          <FinalSummaryCard
            prediction={readString(content.prediction) ?? CONTENT.prediction}
            evidence={readEvidence(content.evidence)}
            balancedThought={readString(content.balancedThought) ?? CONTENT.balancedThought}
            skill={readString(content.skill) ?? CONTENT.skill}
          />
        </View>
      ) : null}

      {/* Round 1 Active */}
      {step < 3 ? (
        <View className="mt-3 gap-3">
          <DialogueBubble speaker="person" text={CONTENT.personInitial} />

          {step === 1 ? (
            <>
              <View className="gap-1.5">
                <DialogueBubble speaker="you" text={CONTENT.r1Alt} />
                <PedagogicalFeedback text={CONTENT.r1AltFeedback} />
              </View>
              <View className="mt-2.5">
                <OptionCard
                  label={CONTENT.r1Pref}
                  onPress={() => {
                    setStep(2);
                    advanceTo(3, 750);
                  }}
                />
              </View>
            </>
          ) : step === 2 ? (
            <>
              <DialogueBubble speaker="you" text={CONTENT.r1Pref} />
              <DialogueBubble speaker="person" text={CONTENT.r1PersonResponse} />
            </>
          ) : (
            <View className="gap-2.5 pt-0.5">
              <OptionCard
                label={CONTENT.r1Pref}
                onPress={() => {
                  setStep(2);
                  advanceTo(3, 750);
                }}
              />
              <OptionCard
                label={CONTENT.r1Alt}
                onPress={() => advanceTo(1)}
              />
            </View>
          )}
        </View>
      ) : null}

      {/* Round 2 Active */}
      {step >= 3 && step < 6 ? (
        <View className="mt-3 gap-3">
          <CompressedStageCard
            prediction={CONTENT.prediction}
            evidence={CONTENT.evidence}
          />

          <EyebrowLabel className="mt-1">WHAT WOULD YOU ASK NEXT?</EyebrowLabel>

          {step === 4 ? (
            <>
              <View className="gap-1.5">
                <DialogueBubble speaker="you" text={CONTENT.r2Alt} />
                <PedagogicalFeedback text={CONTENT.r2AltFeedback} />
              </View>
              <View className="mt-2.5">
                <OptionCard
                  label={CONTENT.r2Pref}
                  onPress={() => {
                    setStep(5);
                    advanceTo(6, 850);
                  }}
                />
              </View>
            </>
          ) : step === 5 ? (
            <>
              <DialogueBubble speaker="you" text={CONTENT.r2Pref} />
              <DialogueBubble speaker="person" text={CONTENT.r2PersonResponse} />
            </>
          ) : (
            <View className="gap-2.5">
              <OptionCard
                label={CONTENT.r2Pref}
                onPress={() => {
                  setStep(5);
                  advanceTo(6, 850);
                }}
              />
              <OptionCard
                label={CONTENT.r2Alt}
                onPress={() => advanceTo(4)}
              />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

interface OptionCardProps {
  label: string;
  onPress: () => void;
}

function OptionCard({ label, onPress }: OptionCardProps): React.JSX.Element {
  return (
    <View className="relative w-full pb-[3px]">
      <View className="absolute inset-x-0 bottom-0 top-[3px] rounded-[16px] bg-[#D8CEBF]" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Question option: ${label}`}
        onPress={onPress}
        className="min-h-[52px] justify-center rounded-[16px] border border-[#E2DAD0] bg-white p-4 active:translate-y-[3px]"
      >
        <Text className="happy-font-body-bold text-[14px] leading-5 text-[#201E1D]">
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

function readEvidence(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    const list = value.map((v) => readString(v)).filter(Boolean) as string[];
    if (list.length) return list;
  }
  return CONTENT.evidence;
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SocraticDialogue,
    phase: "round1",
    step: 0,
    done: false,
    isCorrect: true,
    ...extra,
  };
}
