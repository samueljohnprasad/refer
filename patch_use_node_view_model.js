const fs = require('fs');
let file = 'src/domains/journey/ui/hooks/useNodeViewModel.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '    case NodeState.LOCKED:\n      faceColor = SAGE[100];\n      rimColor = SAGE[200];\n      iconColor = SAGE[400];\n      isInteractive = false;\n      indicator = "lock";',
  '    case NodeState.LOCKED:\n      faceColor = SAGE[100];\n      rimColor = SAGE[200];\n      iconColor = SAGE[400];\n      isInteractive = false;\n      indicator = "none";'
);

content = content.replace(
  '    case NodeType.CHEST:\n      shapeKey = "chest";\n      iconName = "gift";\n      break;',
  '    case NodeType.CHEST:\n      shapeKey = "chest";\n      iconName = "box";\n      break;'
);

fs.writeFileSync(file, content);
