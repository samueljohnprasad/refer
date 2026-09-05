import fs from 'fs';
const file = 'src/exercises/WhatIfMachine/config.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '  if (response.phase === "complete") return "Continue";\n  if (response.phase === "running") return "Watch…";',
  '  if (response.phase === "complete") return "Continue";\n  if (response.phase === "running") return "Next";'
);

const newTransition = `    getPrimaryTransition: (exercise, response) => {
      if (response.phase === "complete") {
        return { kind: "complete" };
      }
      if (response.phase === "prediction" && response.selectedPredictionId) {
        return {
          kind: "response",
          ready: true,
          response: { ...response, phase: "running", consequenceIndex: 1 },
        };
      }
      if (response.phase === "running") {
        const stepCount = exercise.content?.steps?.length || 0;
        const currentIndex = (response.consequenceIndex as number) || 1;
        if (currentIndex < stepCount) {
          return {
            kind: "response",
            ready: true,
            response: { ...response, consequenceIndex: currentIndex + 1 },
          };
        } else {
          return {
            kind: "response",
            ready: true,
            response: { ...response, phase: "complete" },
          };
        }
      }
      return null;
    },`;

code = code.replace(/    getPrimaryTransition: \(exercise, response\) => \{[\s\S]*?    \},/, newTransition);

fs.writeFileSync(file, code);
