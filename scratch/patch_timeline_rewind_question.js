const fs = require('fs');
const file = 'src/components/exercise/TimelineRewindCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/phase: "question"/g, 'format: "timeline_rewind", phase: "question"');

fs.writeFileSync(file, code);
