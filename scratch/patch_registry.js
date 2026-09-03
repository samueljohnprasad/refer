const fs = require('fs');
const file = 'src/components/exercise/courseExerciseFinalBatchRegistry.ts';
let code = fs.readFileSync(file, 'utf8');

code = "import { StateSwitchConfig } from \"@/src/exercises/StateSwitch/config\";\n" + code;
code = code.replace(/};/, '  state_switch: StateSwitchConfig,\n};');

fs.writeFileSync(file, code);
