const fs = require('fs');
const file = 'src/domains/journey/ui/JourneyMapView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'backgroundColor: isDark\n                  ? SEMANTIC_COLORS.surface.primary\n                  : SEMANTIC_COLORS.surface.canvas,',
  'backgroundColor: isDark ? "#1a2a1a" : "#fbfdf8",' // NEUTRAL.offWhite is typically fbfdf8 or similar, NEUTRAL.white is fff
);

fs.writeFileSync(file, code);
