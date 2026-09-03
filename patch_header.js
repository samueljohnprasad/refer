const fs = require('fs');
const file = 'src/components/exercise/CourseExerciseHeader.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'import { useSafeAreaInsets } from "react-native-safe-area-context";',
  'import { useSafeAreaInsets } from "react-native-safe-area-context";\nimport { useColorScheme } from "react-native";\nimport { SAGE } from "@/src/theme/palette";'
);

code = code.replace(
  '  const insets = useSafeAreaInsets();',
  '  const insets = useSafeAreaInsets();\n  const isDark = useColorScheme() === "dark";'
);

code = code.replace(
  '              progressFillColor={SEMANTIC_COLORS.brand.primary}',
  '              progressFillColor={isDark ? SAGE[400] : SAGE[500]}'
);

code = code.replace(
  '              progressTrackColor={SEMANTIC_COLORS.surface.secondary}',
  '              progressTrackColor={isDark ? "#2a3a2a" : "#eef2ea"}'
);

fs.writeFileSync(file, code);
