import fs from 'fs';
const file = 'src/exercises/WhatIfMachine/config.ts';
let code = fs.readFileSync(file, 'utf8');

const newTransition = `    getPrimaryTransition: (exercise, response) => {
      // Allow NodeEngineRouter's default completion flow to take over
      if (response.phase === "complete") {
        return null;
      }
      if (response.phase === "prediction" && response.selectedPredictionId) {
        return {
          kind: "response",
          ready: true,
          response: { 
            ...response, 
            format: CourseExerciseCategoryEnum.WhatIfMachine,
            phase: "running", 
            consequenceIndex: 1 
          },
        };
      }
      if (response.phase === "running") {
        const stepCount = (exercise.content?.steps as any[])?.length || 0;
        const currentIndex = (response.consequenceIndex as number) || 1;
        if (currentIndex < stepCount) {
          return {
            kind: "response",
            ready: true,
            response: { 
              ...response, 
              format: CourseExerciseCategoryEnum.WhatIfMachine,
              consequenceIndex: currentIndex + 1 
            },
          };
        } else {
          return {
            kind: "response",
            ready: true,
            response: { 
              ...response, 
              format: CourseExerciseCategoryEnum.WhatIfMachine,
              phase: "complete" 
            },
          };
        }
      }
      return null;
    },`;

code = code.replace(/    getPrimaryTransition: \(exercise, response\) => \{[\s\S]*?    \},/, newTransition);

fs.writeFileSync(file, code);
