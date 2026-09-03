const fs = require('fs');
const file = 'src/exercises/TimelineRewind/config.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/hideSkip: \(exercise, response\) => \{[\s\S]*?return !!response\?.selectedPathId;\n    \}/, 'hideSkip: () => true,\n    hideFooter: (exercise, response) => response?.phase !== "complete"');

fs.writeFileSync(file, code);
