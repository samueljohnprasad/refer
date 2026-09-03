const fs = require('fs');
const file = 'src/exercises/TimelineRewind/config.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/submissionMode: "immediate",/, 'submissionMode: "immediate",\n    submissionRequirement: {\n      fields: ["phase"],\n      values: { phase: "complete" }\n    },');

fs.writeFileSync(file, code);
