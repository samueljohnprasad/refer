const fs = require('fs');
const file = 'src/domains/journey/ui/hooks/useJourneyNodeCellViewModel.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'import { SEMANTIC_COLORS } from "@/src/theme/colors";',
  'import { SAGE } from "@/src/theme/palette";'
);

code = code.replace(
  'let faceColor: string | import("react-native").OpaqueColorValue = isDark ? SEMANTIC_COLORS.brand.onSoft : SEMANTIC_COLORS.brand.soft;',
  'let faceColor: string = isDark ? SAGE[300] : SAGE[100];'
);
code = code.replace(
  'let rimColor: string | import("react-native").OpaqueColorValue = isDark ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.brand.pressed;',
  'let rimColor: string = isDark ? SAGE[400] : SAGE[600];'
);
code = code.replace(
  'let iconColor: string | import("react-native").OpaqueColorValue = isDark ? SEMANTIC_COLORS.border.selected : SEMANTIC_COLORS.brand.pressed;',
  'let iconColor: string = isDark ? SAGE[500] : SAGE[600];'
);

code = code.replace(
  'faceColor = isDark ? SEMANTIC_COLORS.brand.onSoft : SEMANTIC_COLORS.selection.foreground;',
  'faceColor = isDark ? SAGE[300] : SAGE[700];'
);
code = code.replace(
  'rimColor = isDark ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.brand.pressed;',
  'rimColor = isDark ? SAGE[400] : SAGE[600];'
);
code = code.replace(
  'iconColor = isDark ? SEMANTIC_COLORS.brand.soft : SEMANTIC_COLORS.brand.onSoft;',
  'iconColor = isDark ? "#142414" : SAGE[700];'
);

code = code.replace(
  'faceColor = SEMANTIC_COLORS.brand.primary;',
  'faceColor = isDark ? SAGE[400] : SAGE[500];'
);
code = code.replace(
  'rimColor = SEMANTIC_COLORS.brand.pressed;',
  'rimColor = isDark ? SAGE[500] : SAGE[600];'
);

code = code.replace(
  'ringBackgroundColor: isDark ? SEMANTIC_COLORS.brand.onSoft : SEMANTIC_COLORS.selection.foreground,',
  'ringBackgroundColor: isDark ? SAGE[300] : SAGE[700],'
);

fs.writeFileSync(file, code);
