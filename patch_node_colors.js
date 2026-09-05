const fs = require('fs');
let file = 'src/domains/journey/ui/hooks/useNodeViewModel.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '    case NodeState.LOCKED:\n      faceColor = SAGE[100];\n      rimColor = SAGE[300];',
  '    case NodeState.LOCKED:\n      faceColor = SAGE[100];\n      rimColor = SAGE[400];'
);

fs.writeFileSync(file, content);
