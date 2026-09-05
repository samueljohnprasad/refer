const fs = require('fs');
const file = 'src/domains/journey/ui/components/NodeShapes.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '} else if (type === NodeType.CHECKPOINT) {\n    viewBox = `0 0 100 ${100 + depth * (100 / size)}`;\n    pathD = NODE_SHAPES.shield;\n  }',
  '} else if (type === NodeType.CHECKPOINT) {\n    viewBox = `0 0 100 ${100 + depth * (100 / size)}`;\n    pathD = NODE_SHAPES.hexagon;\n  }'
);

fs.writeFileSync(file, content);
