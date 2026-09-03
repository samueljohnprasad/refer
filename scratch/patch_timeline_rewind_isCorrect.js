const fs = require('fs');
const file = 'src/components/exercise/TimelineRewindCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

// Also set isCorrect: opt.isCorrect or isCorrect: true
code = code.replace(/phase: "complete"/g, 'phase: "complete", isCorrect: true');

fs.writeFileSync(file, code);
