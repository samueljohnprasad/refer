const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/TwinCaseCategoryEngine.tsx");
let content = fs.readFileSync(file, "utf8");

const oldShuffle = `  if (orderIds.length !== pairs.length) {
    return [...pairs].sort((a, b) => a.right.localeCompare(b.right));
  }`;

const newShuffle = `  if (orderIds.length !== pairs.length) {
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    // ensure not identical to left column
    if (pairs.length > 1) {
      let isIdentical = true;
      for (let i = 0; i < pairs.length; i++) {
        if (pairs[i].id !== shuffled[i].id) {
          isIdentical = false;
          break;
        }
      }
      if (isIdentical) {
        const temp = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = temp;
      }
    }
    return shuffled;
  }`;

content = content.replace(oldShuffle, newShuffle);

fs.writeFileSync(file, content);
