const fs = require('fs');
const file = 'src/domains/journey/ui/hooks/useNodeViewModel.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'case NodeState.CURRENT:\n      faceColor = SAGE[700];\n      rimColor = SAGE[800];',
  'case NodeState.CURRENT:\n      faceColor = SAGE[500];\n      rimColor = SAGE[600];'
);
content = content.replace(
  'case NodeState.COMPLETED:\n      faceColor = SAGE[500];\n      rimColor = SAGE[600];',
  'case NodeState.COMPLETED:\n      faceColor = SAGE[700];\n      rimColor = SAGE[800];'
);
fs.writeFileSync(file, content);
