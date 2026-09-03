const fs = require('fs');
const file = 'src/components/exercise/TimelineRewindCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/import \{ readString, readRecord, readNumber \} from "\@\/src\/lib\/jsonHelpers";/, 'import { readString, readRecord, readNumber } from "@/src/components/exercise/courseExerciseContent";');

fs.writeFileSync(file, code);
