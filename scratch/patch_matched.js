const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/CourseExerciseTwinColumn.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  `  matched: {
    borderColor: SEMANTIC_COLORS.border.default,
    borderBottomWidth: 1,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
    opacity: 0.72,
  },`,
  `  matched: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    borderBottomWidth: 1,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },`
);

fs.writeFileSync(file, content);
