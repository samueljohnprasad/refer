const fs = require('fs');
const file = 'src/types/courseExercises.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/TimelineRewind = "timeline_rewind",/, 'TimelineRewind = "timeline_rewind",\n  StateSwitch = "state_switch",');

fs.writeFileSync(file, code);
