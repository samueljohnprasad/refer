const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/TwinCaseCategoryEngine.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  "const showTryAgain = checkHasRun && !isCorrect;",
  "const showTryAgain = checkHasRun && !isCorrect;\n  console.log('TwinCase Check:', { checkHasRun, isCorrect, formedPairs, lockedPairIds });"
);

fs.writeFileSync(file, content);
