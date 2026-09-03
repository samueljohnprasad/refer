const fs = require('fs');
const file = 'src/components/exercise/TimelineRewindCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

const hook = `  useEffect(() => {
    if (selectedReflectionId && !completed && !saved.recoveredHydration) {
      onInteraction({ ...saved, recoveredHydration: true, format: "timeline_rewind", phase: "complete", isCorrect: true }, true);
    }
  }, [selectedReflectionId, completed, saved, onInteraction]);

  useEffect(() => {
    if (!selectedPathId) return;`;

code = code.replace(/  useEffect\(\(\) => \{\n    if \(\!selectedPathId\) return;/, hook);

fs.writeFileSync(file, code);
