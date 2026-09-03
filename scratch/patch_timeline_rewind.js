const fs = require('fs');
const file = 'src/components/exercise/TimelineRewindCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace onInteraction calls to include format: "timeline_rewind"
code = code.replace(/onInteraction\(\{ \.\.\.saved, phase: "question"/g, 'onInteraction({ ...saved, format: "timeline_rewind", phase: "question"');
code = code.replace(/onInteraction\(\{ \.\.\.saved, selectedReflectionId: opt.id/g, 'onInteraction({ ...saved, format: "timeline_rewind", selectedReflectionId: opt.id');
code = code.replace(/onInteraction\(\{ \.\.\.saved, rewound: true/g, 'onInteraction({ ...saved, format: "timeline_rewind", rewound: true');
code = code.replace(/onInteraction\(\{ \.\.\.saved, revealCount: revealCount \+ 1/g, 'onInteraction({ ...saved, format: "timeline_rewind", revealCount: revealCount + 1');
code = code.replace(/onInteraction\(\{ phase: "intro" \}/g, 'onInteraction({ format: "timeline_rewind", phase: "intro" }');

fs.writeFileSync(file, code);
