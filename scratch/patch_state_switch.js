const fs = require('fs');

const path = 'src/components/exercise/StateSwitchCategoryEngine.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add useState to imports
if (!code.includes('useState')) {
  code = code.replace(/import React, \{ useEffect \}/, 'import React, { useEffect, useState }');
}

// 2. Insert staggered stressors state and effect
const staggeredLogic = `
  const saved = readRecord(savedResponse) ?? {};
  const stepIndex = readNumber(saved.stepIndex) ?? 0;
  const selectedReflectionId = readString(saved.selectedReflectionId);
  const phase = readString(saved.phase);

  const [revealedStressorsCount, setRevealedStressorsCount] = useState(0);

  const currentState = stepIndex < states.length ? states[stepIndex] : states[states.length - 1];
  const isRecall = stepIndex >= states.length;

  useEffect(() => {
    if (currentState?.mode === "conflict") {
      setRevealedStressorsCount(0);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setRevealedStressorsCount(c => c + 1);
        if (count >= (currentState.stressors?.length || 0)) {
          clearInterval(interval);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [currentState?.mode, currentState?.stressors?.length]);

  const baseMeterValue = currentState?.meterValue ?? 0;
  const meterValue = currentState?.mode === "conflict" 
    ? Math.max(15, 100 - (revealedStressorsCount * 28.33)) 
    : baseMeterValue;
`;
code = code.replace(/  const saved = readRecord\(savedResponse\) \?\? \{\};[\s\S]*?const meterValue = currentState\?\.meterValue \?\? 0;/m, staggeredLogic);

// 3. Update the meter indicator content (remove text)
code = code.replace(/<Animated\.View style=\{\[styles\.meterIndicator, meterIndicatorStyle\]\}>[\s\S]*?<\/Animated\.View>/m, `<Animated.View style={[styles.meterIndicator, meterIndicatorStyle]} />`);

// 4. Update the stressors mapping to only show up to revealedStressorsCount
const stressorsMap = `
            {currentState.stressors.length > 0 && (
              <View style={styles.symptomsList}>
                {currentState.stressors.slice(0, revealedStressorsCount).map((st, idx) => (
                  <Animated.Text entering={FadeIn.delay(100)} key={idx} style={styles.stressorText}>• {st}</Animated.Text>
                ))}
              </View>
            )}
`;
code = code.replace(/\{currentState\.stressors\.length > 0 && \([\s\S]*?<\/[Aa]nimated\.View>/m, `
            {currentState.stressors.length > 0 && (
              <View style={styles.symptomsList}>
                {currentState.stressors.slice(0, revealedStressorsCount).map((st, idx) => (
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
`);

// 5. Update CourseExerciseOptionButton props in recall
const optionButtonNew = `
                <CourseExerciseOptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={isSelected}
                  disabled={locked}
                  result={isSelected && locked ? (opt.isCorrect ? "correct" : "incorrect") : undefined}
                  onPress={() => handleAnswer(opt.id, opt.isCorrect)}
                />
`;
code = code.replace(/<CourseExerciseOptionButton\s+key=\{opt\.id\}\s+label=\{opt\.label\}\s+selected=\{isSelected\}\s+disabled=\{locked\}\s+onPress=\{.*?\}\s+\/>/ms, optionButtonNew);

// 6. Update styles
code = code.replace(/meterTrack: \{[\s\S]*?\},/m, `meterTrack: {\n    height: 16,\n    backgroundColor: "#E5E7EB",\n    borderRadius: 8,\n    justifyContent: "center",\n  },`);
code = code.replace(/meterIndicator: \{[\s\S]*?\},/m, `meterIndicator: {\n    position: "absolute",\n    width: 24,\n    height: 24,\n    backgroundColor: "#111827",\n    borderRadius: 12,\n    alignItems: "center",\n    justifyContent: "center",\n    marginLeft: -12,\n    shadowColor: "#000",\n    shadowOffset: { width: 0, height: 2 },\n    shadowOpacity: 0.1,\n    shadowRadius: 3,\n    elevation: 3,\n  },`);
code = code.replace(/stateCard: \{[\s\S]*?\},/m, `stateCard: {\n    marginTop: 24,\n    paddingHorizontal: 8,\n  },`);
code = code.replace(/stressorText: \{[\s\S]*?\},/m, `stressorText: {\n    fontFamily: "Geist-Medium",\n    fontSize: 18,\n    color: "#374151",\n  },`);
code = code.replace(/feedbackBlock: \{[\s\S]*?\},/m, `feedbackBlock: {\n    marginTop: 24,\n    padding: 16,\n    backgroundColor: "#F9FAFB",\n    borderWidth: 1,\n    borderColor: "#E5E7EB",\n    borderRadius: 12,\n  },`);
code = code.replace(/feedbackText: \{[\s\S]*?\},/m, `feedbackText: {\n    fontFamily: "Geist-Medium",\n    fontSize: 16,\n    color: "#4B5563",\n    textAlign: "center",\n  },`);

fs.writeFileSync(path, code);
