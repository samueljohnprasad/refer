const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/CourseExerciseSequentialMatcher.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  "lockedPairIds.includes(currentLeftItem.id)",
  "lockedPairIds.includes(currentPair.id)"
);
content = content.replace(
  "lockedPairIds.includes(currentLeftItem.id)",
  "lockedPairIds.includes(currentPair.id)"
);

fs.writeFileSync(file, content);
