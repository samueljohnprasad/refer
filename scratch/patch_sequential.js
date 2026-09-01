const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/CourseExerciseSequentialMatcher.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  "locked: boolean;",
  "locked: boolean;\n  lockedPairIds: string[];"
);

content = content.replace(
  "locked,",
  "locked,\n  lockedPairIds,"
);

content = content.replace(
  "disabled={locked}",
  "disabled={locked || lockedPairIds.includes(currentLeftItem.id)}"
);

content = content.replace(
  "locked && isSelectedForCurrent && isCorrect && styles.correctOption,",
  "locked && isSelectedForCurrent && isCorrect && styles.correctOption,\nlockedPairIds.includes(currentLeftItem.id) && isSelectedForCurrent && styles.correctOption,"
);

fs.writeFileSync(file, content);
