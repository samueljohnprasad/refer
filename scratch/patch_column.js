const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "src/components/exercise/CourseExerciseTwinColumn.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  "correctIds?: string[];",
  "correctIds?: string[];\n  disabledIds?: string[];\n  pairIdentifiers?: Record<string, string>;"
);

content = content.replace(
  "correctIds = [],",
  "correctIds = [],\n  disabledIds = [],\n  pairIdentifiers = {},"
);

content = content.replace(
  "const isSelected = side === \"left\" && selectedLeftId === pair.id;",
  `const isSelected = side === "left" && selectedLeftId === pair.id;
        const isPermanentlyLocked = disabledIds.includes(pair.id);
        const effectiveDisabled = disabled || isPermanentlyLocked;
        const badge = pairIdentifiers[pair.id];`
);

content = content.replace(
  "accessibilityState={{ selected: isSelected, disabled: disabled }}",
  "accessibilityState={{ selected: isSelected, disabled: effectiveDisabled }}"
);

content = content.replace(
  "disabled={disabled}",
  "disabled={effectiveDisabled}"
);

content = content.replace(
  "disabled && !isMatched && styles.disabled,",
  "effectiveDisabled && !isMatched && styles.disabled,"
);

content = content.replace(
  "pressed && !disabled && styles.pressed,",
  "pressed && !effectiveDisabled && styles.pressed,"
);

content = content.replace(
  "{side === \"left\" ? pair.left : pair.right}",
  "{badge ? `${badge} ` : \"\"}{side === \"left\" ? pair.left : pair.right}"
);

fs.writeFileSync(file, content);
