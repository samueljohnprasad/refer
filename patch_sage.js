const fs = require('fs');
const file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { SAGE } from "@/src/theme";',
  'import { SAGE } from "@/src/theme/palette";'
);

fs.writeFileSync(file, content);
