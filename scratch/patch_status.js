const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/TwinCaseCategoryEngine.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  ": isRetrying\n              ? `${retryCount} pair${retryCount !== 1 ? 's' : ''} left to match`\n              : `${numMatched} of ${pairs.length} matched`",
  `: isRetrying && numMatched < pairs.length\n              ? \`\${retryCount} pair\${retryCount !== 1 ? 's' : ''} left to match\`\n              : \`\${numMatched} of \${pairs.length} matched\``
);

fs.writeFileSync(file, content);
