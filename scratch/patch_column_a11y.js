const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/CourseExerciseTwinColumn.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  "accessibilityState={{ selected: isSelected, disabled: effectiveDisabled }}",
  `accessibilityState={{ selected: isSelected, disabled: effectiveDisabled }}
            accessibilityLabel={[
              badge === "✓" ? "Verified correct:" : badge === "!" ? "Incorrect match:" : badge ? \`Paired as pair \${badge}:\` : "Unpaired:",
              side === "left" ? pair.left : pair.right,
            ].join(" ")}`
);

fs.writeFileSync(file, content);
