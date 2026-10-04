import { useMemo, useState } from "react";
import { View } from "react-native";
import { SuggestionCards, SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import { ReflectionContextBlock, ReflectionDisclosure, ReflectionExampleRow, ReflectionHint } from "@/src/components/exercise/ReflectionStepSections";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { ExerciseCopyText } from "@/src/components/exercise/ExerciseCopyText";
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { CBT_COMPOSER_MIN_HEIGHT, StepShell, StepTitle, LoadingRow, AiUnavailableNote } from "./customStepShared";

export function TREvidenceAgainstStep({
  response,
  onUpdate,
  onNext,
  onBack,
  canGoBack,
  isValid,
  isSaving,
  readOnly,
  progress,
  onClose,
  aiSuggestions,
  isAiLoading,
  aiError,
}: StepProps<ThoughtReframingResponse>) {
  const translateCopy = useExerciseCopy();
  const items = response.evidenceAgainst ?? [];
  const forItems = response.evidenceFor ?? [];
  const showBiasNote = items.length < forItems.length && items.length > 0;
  const [showEvidenceSuggestions, setShowEvidenceSuggestions] = useState(false);

  const aiGeneratedSuggestions = useMemo<SuggestionItem[]>(() => {
    if (aiSuggestions && aiSuggestions.length > 0) {
      const uniqueLabels = new Set<string>();
      const result: SuggestionItem[] = [];
      for (const s of aiSuggestions as Array<{
        text?: string;
        label?: string;
      }>) {
        const txt = s?.text || s?.label;
        if (txt && typeof txt === "string" && txt.trim()) {
          const normalized = txt.trim();
          if (!uniqueLabels.has(normalized)) {
            uniqueLabels.add(normalized);
            result.push({
              label: normalized,
            });
          }
        }
      }
      return result;
    }
    return [];
  }, [aiSuggestions]);
  const visibleEvidenceSuggestions = useMemo(
    () => aiGeneratedSuggestions.slice(0, 2),
    [aiGeneratedSuggestions],
  );
  const addEvidenceItem = (text: string) => {
    const normalized = text.trim();
    if (!normalized || items.includes(normalized)) return;
    onUpdate({ evidenceAgainst: [...items, normalized] });
  };
  const toggleSuggestionItem = (text: string) => {
    const normalized = text.trim();
    if (!normalized) return;
    setShowEvidenceSuggestions(false);

    if (items.includes(normalized)) {
      onUpdate({
        evidenceAgainst: items.filter((item) => item !== normalized),
      });
      return;
    }

    onUpdate({ evidenceAgainst: [...items, normalized] });
  };

  return (
    <StepShell
      onNext={onNext}
      onBack={onBack}
      canGoBack={canGoBack}
      isValid={isValid}
      isSaving={isSaving}
      nextLabel={translateCopy(items.length === 0 ? "Skip" : "Continue")}
      progress={progress}
      onClose={onClose}
    >
      <StepTitle
        title="Evidence Against"
        subtitle="What facts do not fit the prediction?"
      />

      <ReflectionContextBlock
        label={translateCopy("The Thought")}
        text={response.automaticThought}
        variant="quote"
      />

      <ExerciseTextComposer
        mode="list"
        items={items}
        onAdd={addEvidenceItem}
        onRemove={(i) =>
          onUpdate({ evidenceAgainst: items.filter((_, idx) => idx !== i) })
        }
        placeholder={translateCopy("Add a fact that contradicts the thought...")}
        readOnly={readOnly}
        addLabel={translateCopy("Add")}
        minHeight={CBT_COMPOSER_MIN_HEIGHT}
      />

      {!readOnly ? (
        <ReflectionDisclosure
          expanded={showEvidenceSuggestions}
          onToggle={() => setShowEvidenceSuggestions((current) => !current)}
        >
          {isAiLoading ? <LoadingRow message="Finding starting points..." /> : null}
          <AiUnavailableNote visible={!!aiError && !isAiLoading} />

          <ReflectionExampleRow
            title={translateCopy("Contradicting fact")}
            body={translateCopy(`"I've been nervous before and it turned out okay."`)}
            icon="check-circle"
            iconColor={String(SEMANTIC_COLORS.brand.primary)}
          />
          <ReflectionExampleRow
            title={translateCopy("Another fact")}
            body={translateCopy(`"Nobody has ever actually called me incompetent."`)}
            icon="check-circle"
            iconColor={String(SEMANTIC_COLORS.brand.primary)}
          />

          {!isAiLoading && visibleEvidenceSuggestions.length > 0 ? (
            <View className="pt-3">
              <ExerciseCopyText
                variant="label-bold"
                className="mb-2 text-[14px] text-sage-700"
              >
                Optional starters
              </ExerciseCopyText>
              <SuggestionCards
                title=""
                actionLabel="Use"
                suggestions={visibleEvidenceSuggestions}
                currentValue={items}
                onSelect={toggleSuggestionItem}
              />
            </View>
          ) : null}
        </ReflectionDisclosure>
      ) : null}

      {showBiasNote ? (
        <ReflectionHint text={translateCopy("Threat can show up faster than safety. Keep looking for the full picture.")} />
      ) : null}
    </StepShell>
  );
}
