const fs = require('fs');
const file = 'src/components/exercise/StateSwitchCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'import { readString, readRecord, readNumber } from "@/src/components/exercise/courseExerciseContent";',
  'import { readString, readRecord, readNumber } from "@/src/components/exercise/courseExerciseContent";\nimport { COURSE_EXERCISE_FONTS } from "@/src/components/exercise/courseExerciseTheme";'
);

code = code.replace(/fontFamily: "Geist-Bold"/g, 'fontFamily: COURSE_EXERCISE_FONTS.bodyBold');
code = code.replace(/fontFamily: "Geist-Medium"/g, 'fontFamily: COURSE_EXERCISE_FONTS.bodyMedium');
code = code.replace(/fontFamily: "Geist-Regular"/g, 'fontFamily: COURSE_EXERCISE_FONTS.body');
code = code.replace(/fontFamily: "Cormorant-Bold"/g, 'fontFamily: COURSE_EXERCISE_FONTS.heading');

fs.writeFileSync(file, code);
