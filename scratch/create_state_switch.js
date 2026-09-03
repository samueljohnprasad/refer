const fs = require('fs');

const code = `import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { LinearTransition, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import { readString, readRecord, readNumber } from "@/src/components/exercise/courseExerciseContent";
import { Exercise } from "@/src/types/journeyV5";

export function StateSwitchCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
  locked,
}: {
  exercise: Exercise;
  savedResponse: Record<string, unknown> | null;
  onInteraction: (response: Record<string, unknown>, ready: boolean) => void;
  locked: boolean;
}) {
  const content = readRecord(exercise.content) ?? {};
  
  const title = readString(content.title) ?? "";
  const instruction = readString(content.instruction) ?? "";
  
  const states = (Array.isArray(content.states) ? content.states : []).map(s => {
    const rec = readRecord(s);
    return {
      id: readString(rec?.id) ?? "",
      mode: readString(rec?.mode) ?? "",
      meterLabel: readString(rec?.meterLabel) ?? "",
      symptoms: (Array.isArray(rec?.symptoms) ? rec?.symptoms : []).map(sym => readString(sym) ?? ""),
      stressors: (Array.isArray(rec?.stressors) ? rec?.stressors : []).map(st => readString(st) ?? ""),
      summary: readString(rec?.summary) ?? "",
      actionLabel: readString(rec?.actionLabel) ?? "",
      meterValue: readNumber(rec?.meterValue) ?? 0,
    };
  });
  
  const recallRec = readRecord(content.recall);
  const recall = recallRec ? {
    scenario: readString(recallRec.scenario) ?? "",
    options: (Array.isArray(recallRec.options) ? recallRec.options : []).map(o => {
      const rec = readRecord(o);
      return {
        id: readString(rec?.id) ?? "",
        label: readString(rec?.label) ?? "",
        isCorrect: rec?.isCorrect === true
      };
    }),
    feedback: {
      correct: readString(readRecord(recallRec.feedback)?.correct) ?? "",
      incorrect: readString(readRecord(recallRec.feedback)?.incorrect) ?? "",
    }
  } : null;
  
  const finalInsightRec = readRecord(content.finalInsight);
  const finalInsight = finalInsightRec ? {
    headline: readString(finalInsightRec.headline) ?? "",
    body: readString(finalInsightRec.body) ?? ""
  } : null;

  const saved = readRecord(savedResponse) ?? {};
  const stepIndex = readNumber(saved.stepIndex) ?? 0;
  const selectedReflectionId = readString(saved.selectedReflectionId);
  const phase = readString(saved.phase);
  
  useEffect(() => {
    if (!readRecord(savedResponse)) {
      onInteraction({ format: "state_switch", phase: "intro", stepIndex: 0 }, false);
    }
  }, [onInteraction, savedResponse]);

  // Hydration recovery (if completed but ready is false)
  useEffect(() => {
    if (selectedReflectionId && phase !== "complete" && !saved.recoveredHydration) {
      onInteraction({ ...saved, recoveredHydration: true, format: "state_switch", phase: "complete" }, true);
    }
  }, [selectedReflectionId, phase, saved, onInteraction]);

  const currentState = stepIndex < states.length ? states[stepIndex] : states[states.length - 1];
  const isRecall = stepIndex >= states.length;

  const meterValue = currentState?.meterValue ?? 0;
  
  const meterIndicatorStyle = useAnimatedStyle(() => {
    return {
      left: withSpring(\`\${meterValue}%\`, { damping: 20, stiffness: 90 })
    };
  });

  const handleNextState = () => {
    if (locked) return;
    onInteraction({ ...saved, format: "state_switch", stepIndex: stepIndex + 1 }, false);
  };

  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    if (locked || selectedReflectionId) return;
    onInteraction({ 
      ...saved, 
      format: "state_switch", 
      selectedReflectionId: optionId, 
      phase: "complete", 
      isCorrect 
    }, true);
  };

  const selectedOption = recall?.options.find(o => o.id === selectedReflectionId);
  const feedbackText = selectedOption?.isCorrect ? recall?.feedback.correct : recall?.feedback.incorrect;

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading title={title} instruction={instruction} />
      
      <Animated.View layout={LinearTransition.springify().damping(18).stiffness(150)} style={styles.meterContainer}>
        {/* The Track */}
        <View style={styles.meterTrack}>
          <Animated.View style={[styles.meterIndicator, meterIndicatorStyle]}>
            <Text style={styles.meterIndicatorText}>{currentState?.meterLabel}</Text>
          </Animated.View>
        </View>
        <View style={styles.meterLabels}>
          <Text style={styles.meterLabelText}>ALERT</Text>
          <Text style={styles.meterLabelText}>SETTLED</Text>
        </View>
      </Animated.View>

      {!isRecall && currentState && (
        <Animated.View layout={LinearTransition.springify()} style={styles.stateCard}>
          <View style={styles.stateCardContent}>
            {currentState.symptoms.length > 0 && (
              <View style={styles.symptomsList}>
                {currentState.symptoms.map((sym, idx) => (
                  <Text key={idx} style={styles.symptomText}>• {sym}</Text>
                ))}
              </View>
            )}
            
            {currentState.stressors.length > 0 && (
              <View style={styles.symptomsList}>
                {currentState.stressors.map((st, idx) => (
                  <Text key={idx} style={styles.stressorText}>• {st}</Text>
                ))}
              </View>
            )}

            {!!currentState.summary && (
              <Text style={styles.summaryText}>{currentState.summary}</Text>
            )}
          </View>
          
          <View style={{ marginTop: 24 }}>
            <CourseExerciseOptionButton
              label={currentState.actionLabel}
              selected={false}
              disabled={locked}
              onPress={handleNextState}
            />
          </View>
        </Animated.View>
      )}

      {isRecall && recall && (
        <Animated.View layout={LinearTransition.springify()} style={styles.recallContainer}>
          <Text style={styles.scenarioText}>{recall.scenario}</Text>
          
          <View style={{ gap: 12, marginTop: 24 }}>
            {recall.options.map(opt => {
              const isSelected = selectedReflectionId === opt.id;
              return (
                <CourseExerciseOptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={isSelected}
                  disabled={locked}
                  onPress={() => handleAnswer(opt.id, opt.isCorrect)}
                />
              );
            })}
          </View>

          {selectedReflectionId && feedbackText && (
            <Animated.View layout={LinearTransition.springify()} style={styles.feedbackBlock}>
              <Text style={styles.feedbackText}>{feedbackText}</Text>
            </Animated.View>
          )}

          {selectedReflectionId && finalInsight && (
            <Animated.View layout={LinearTransition.springify()} style={styles.insightBlock}>
              <Text style={styles.insightHeadline}>{finalInsight.headline}</Text>
              <Text style={styles.insightBody}>{finalInsight.body}</Text>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  meterContainer: {
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  meterTrack: {
    height: 12,
    backgroundColor: "#E5E7EB", // gray-200
    borderRadius: 6,
    justifyContent: "center",
  },
  meterIndicator: {
    position: "absolute",
    width: 48,
    height: 32,
    backgroundColor: "#111827", // gray-900
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -24, // center the thumb based on its width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  meterIndicatorText: {
    fontFamily: "Geist-Bold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  meterLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  meterLabelText: {
    fontFamily: "Geist-Medium",
    fontSize: 12,
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  stateCard: {
    backgroundColor: "#F9FAFB", // gray-50
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  stateCardContent: {
    gap: 16,
  },
  symptomsList: {
    gap: 8,
  },
  symptomText: {
    fontFamily: "Geist-Medium",
    fontSize: 18,
    color: "#374151",
  },
  stressorText: {
    fontFamily: "Geist-Medium",
    fontSize: 18,
    color: "#DC2626", // red-600 to signify stressors
  },
  summaryText: {
    fontFamily: "Geist-Regular",
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    marginTop: 8,
  },
  recallContainer: {
    marginTop: 24,
  },
  scenarioText: {
    fontFamily: "Geist-Medium",
    fontSize: 18,
    color: "#111827",
    lineHeight: 26,
    textAlign: "center",
  },
  feedbackBlock: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
  },
  feedbackText: {
    fontFamily: "Geist-Medium",
    fontSize: 16,
    color: "#92400E",
    textAlign: "center",
  },
  insightBlock: {
    marginTop: 32,
    alignItems: "center",
    gap: 12,
  },
  insightHeadline: {
    fontFamily: "Cormorant-Bold",
    fontSize: 32,
    color: "#111827",
    textAlign: "center",
  },
  insightBody: {
    fontFamily: "Geist-Regular",
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    lineHeight: 24,
  }
});
`;

fs.writeFileSync('src/components/exercise/StateSwitchCategoryEngine.tsx', code);
