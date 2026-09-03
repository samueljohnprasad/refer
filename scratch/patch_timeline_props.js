const fs = require('fs');
const file = 'src/components/exercise/TimelineRewindCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/exercise: Record<string, unknown>;/, 'exercise: any;');
code = code.replace(/import \{ CourseExerciseHeading \} from "\@\/src\/components\/exercise\/CourseExerciseHeading";/, 'import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";\nimport { Exercise } from "@/src/types/exercises";');
code = code.replace(/exercise: any;/, 'exercise: Exercise;');

fs.writeFileSync(file, code);
