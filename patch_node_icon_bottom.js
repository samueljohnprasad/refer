const fs = require('fs');
const file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'bottom: DEPTH, // Center slightly above rim by pulling bottom up',
  'bottom: type === NodeType.LESSON ? "16%" : DEPTH, // Match the old 3D center precisely'
);

fs.writeFileSync(file, content);
