const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/TwinCaseCategoryEngine.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  "const showTryAgain = checkHasRun && !isCorrect;",
  `const showTryAgain = checkHasRun && !isCorrect;
  const correctMatchedIds = Object.entries(formedPairs).filter(([l, r]) => l === r).map(([l]) => l);`
);

content = content.replace(
  `matchedPairIds={leftMatchedIds}
          selectedLeftId={selectedLeftId}
          disabled={locked}`,
  `matchedPairIds={leftMatchedIds}
          selectedLeftId={selectedLeftId}
          disabled={locked}
          showCorrectness={checkHasRun}
          correctIds={correctMatchedIds}`
);

// Note: For the right side, the correct matched ID is technically the right side's ID, which is the same as the left side's ID!
content = content.replace(
  `matchedPairIds={rightMatchedIds}
          selectedLeftId={selectedLeftId}
          disabled={locked}`,
  `matchedPairIds={rightMatchedIds}
          selectedLeftId={selectedLeftId}
          disabled={locked}
          showCorrectness={checkHasRun}
          correctIds={correctMatchedIds}`
);

fs.writeFileSync(file, content);
