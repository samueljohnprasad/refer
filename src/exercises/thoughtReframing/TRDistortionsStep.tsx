import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";
import { Feather } from "@expo/vector-icons";
import { DistortionCard } from "@/src/screens/ThoughtReframingScreen/components/DistortionCard";
import { COGNITIVE_DISTORTIONS } from "@/src/screens/ThoughtReframingScreen/data/cognitiveDistortions";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import type { ThoughtReframingResponse, StepProps, CognitiveDistortionKey } from "@/src/types/exerciseFlow";
import { COLLAPSED_DISTORTION_COUNT, MAX_DISTORTIONS, StepShell, StepTitle, LoadingRow, MoreOptionsButton } from "./customStepShared";
import { ExerciseCopyText } from "@/src/components/exercise/ExerciseCopyText";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
export function TRDistortionsStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  aiSuggestions,
  isAiLoading,
  aiError,
  readOnly,
  progress,
  onClose,
}: StepProps<ThoughtReframingResponse>) {
  const translateCopy = useExerciseCopy();
  const [showAllDistortions, setShowAllDistortions] = useState(false);
  const [showPatternHelp, setShowPatternHelp] = useState(false);
  const [expandedExplanationKey, setExpandedExplanationKey] = useState<
    string | null
  >(null);

  const selectedSet = useMemo(
    () => new Set(response.selectedDistortions),
    [response.selectedDistortions],
  );

  const aiSuggestedKeys = useMemo(() => {
    const suggestions = (aiSuggestions ?? []) as Array<{
      key?: string;
      explanation?: string;
    }>;
    return new Map(suggestions.map((s) => [s.key, s.explanation]));
  }, [aiSuggestions]);

  const atLimit = response.selectedDistortions.length >= MAX_DISTORTIONS;
  const aiSuggestedDistortions = useMemo(() => {
    if (aiSuggestedKeys.size === 0) return [];

    return COGNITIVE_DISTORTIONS.filter((d) => aiSuggestedKeys.has(d.key))
      .slice(0, 2)
      .map((d) => ({
        ...d,
        explanation: aiSuggestedKeys.get(d.key) ?? "",
      }));
  }, [aiSuggestedKeys]);
  const visibleDistortions = useMemo(() => {
    if (showAllDistortions) return COGNITIVE_DISTORTIONS;

    const selected = COGNITIVE_DISTORTIONS.filter((distortion) =>
      selectedSet.has(distortion.key as CognitiveDistortionKey),
    );
    const remainingSlots = Math.max(
      COLLAPSED_DISTORTION_COUNT - selected.length,
      0,
    );
    const collapsed = COGNITIVE_DISTORTIONS
      .filter(
        (distortion) =>
          !selectedSet.has(distortion.key as CognitiveDistortionKey),
      )
      .slice(0, remainingSlots);

    return [...selected, ...collapsed];
  }, [selectedSet, showAllDistortions]);

  const hiddenDistortionCount = Math.max(
    COGNITIVE_DISTORTIONS.length - visibleDistortions.length,
    0,
  );

  const handleToggle = (key: CognitiveDistortionKey) => {
    if (selectedSet.has(key)) {
      onUpdate({
        selectedDistortions: response.selectedDistortions.filter(
          (k) => k !== key,
        ),
      });
    } else if (!atLimit) {
      onUpdate({
        selectedDistortions: [...response.selectedDistortions, key],
      });
    }
  };

  const handleTogglePatternHelp = () => {
    triggerSelectionHaptic();
    if (showPatternHelp) {
      setExpandedExplanationKey(null);
    }
    setShowPatternHelp((current) => !current);
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="Notice the thought pattern"
        subtitle={`Pick 1-${MAX_DISTORTIONS}.`}
      />

      <View className="mb-1 border-t border-sage-100/70">
        {visibleDistortions.map((distortion) => {
          return (
            <DistortionCard
              key={distortion.key}
              distortion={distortion}
              isSelected={selectedSet.has(
                distortion.key as CognitiveDistortionKey,
              )}
              onToggle={() =>
                !readOnly &&
                handleToggle(distortion.key as CognitiveDistortionKey)
              }
              disabled={
                atLimit &&
                !selectedSet.has(distortion.key as CognitiveDistortionKey)
              }
              locked={readOnly}
            />
          );
        })}
      </View>

      <MoreOptionsButton
        expanded={showAllDistortions}
        hiddenCount={hiddenDistortionCount}
        onToggle={() => setShowAllDistortions((current) => !current)}
        label="patterns"
      />

      {!readOnly && (
        <Pressable
          onPress={handleTogglePatternHelp}
          accessibilityRole="button"
          accessibilityLabel={translateCopy(
            showPatternHelp
              ? "Hide help spotting a thought pattern"
              : "Show help spotting a thought pattern"
          )}
          accessibilityState={{ expanded: showPatternHelp }}
          className="mb-2 flex-row items-center justify-between border-t border-sage-100/70 py-3 active:opacity-70"
        >
          <ExerciseCopyText variant="label-bold" className="text-[14px] text-sage-700">
            {showPatternHelp
              ? "Hide possible matches"
              : "Need help spotting a pattern?"}
          </ExerciseCopyText>
          <Feather
            name={showPatternHelp ? "chevron-up" : "chevron-down"}
            size={18}
            color={SEMANTIC_COLORS.brand.pressed}
          />
        </Pressable>
      )}

      {showPatternHelp && (
        <View className="mb-4">
          {isAiLoading && (
            <LoadingRow message="Looking for possible matches..." />
          )}

          {!!aiError && !isAiLoading && (
            <ExerciseCopyText variant="caption" className="mb-3 text-ink-soft">
              Possible matches are unavailable. You can still choose from the
              list above.
            </ExerciseCopyText>
          )}

          {!isAiLoading &&
            !aiError &&
            aiSuggestedDistortions.length === 0 && (
              <ExerciseCopyText variant="caption" className="mb-3 text-ink-soft">
                No possible matches are available. Choose what feels closest
                from the list above.
              </ExerciseCopyText>
            )}

          {!isAiLoading &&
            !aiError &&
            aiSuggestedDistortions.map((distortion) => {
              const key = distortion.key as CognitiveDistortionKey;
              const isSelected = selectedSet.has(key);
              const isUseDisabled = atLimit && !isSelected;
              const isExplanationExpanded =
                expandedExplanationKey === distortion.key;

              return (
                <View
                  key={distortion.key}
                  className="border-t border-sage-100/70 py-3"
                >
                  <View className="flex-row items-center">
                    <Text className="mr-3 text-[17px] leading-[20px]">
                      {distortion.icon}
                    </Text>
                    <View className="flex-1 pr-3">
                      <ExerciseCopyText
                        variant="caption"
                        className="mb-0.5 text-[12px] text-ink-muted"
                      >
                        Possible match
                      </ExerciseCopyText>
                      <ExerciseCopyText
                        variant="label-bold"
                        className="text-[14px] text-ink"
                      >
                        {translateCopy(distortion.label)}
                      </ExerciseCopyText>
                    </View>
                    <Pressable
                      onPress={() => {
                        triggerSelectionHaptic();
                        handleToggle(key);
                      }}
                      disabled={isUseDisabled}
                      accessibilityRole="checkbox"
                      accessibilityLabel={`${translateCopy(isSelected ? "Remove" : "Use")} ${translateCopy(distortion.label)}`}
                      accessibilityState={{
                        checked: isSelected,
                        disabled: isUseDisabled,
                      }}
                      className={`min-h-11 min-w-11 items-center justify-center active:opacity-70 ${
                        isUseDisabled ? "opacity-40" : ""
                      }`}
                    >
                      {isSelected ? (
                        <Feather name="check" size={18} color={SEMANTIC_COLORS.brand.pressed} />
                      ) : (
                        <ExerciseCopyText variant="label-bold" className="text-sage-700">
                          Use
                        </ExerciseCopyText>
                      )}
                    </Pressable>
                  </View>

                  {!!distortion.explanation && (
                    <View className="ml-8 mt-2">
                      <Pressable
                        onPress={() =>
                          {
                            triggerSelectionHaptic();
                            setExpandedExplanationKey((current) =>
                              current === distortion.key ? null : distortion.key,
                            );
                          }
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`${translateCopy(isExplanationExpanded ? "Hide" : "Show")} ${translateCopy("why")} ${translateCopy(distortion.label)} ${translateCopy("may fit")}`}
                        accessibilityState={{
                          expanded: isExplanationExpanded,
                        }}
                        className="min-h-11 self-start justify-center active:opacity-70"
                      >
                        <ExerciseCopyText variant="label-bold" className="text-sage-700">
                          {isExplanationExpanded ? "Hide why" : "Why?"}
                        </ExerciseCopyText>
                      </Pressable>

                      {isExplanationExpanded && (
                        <Text
                          variant="caption"
                          className="pb-1 pr-2 text-[13px] leading-[19px] text-ink-soft"
                        >
                          {distortion.explanation}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      )}
    </StepShell>
  );
}
