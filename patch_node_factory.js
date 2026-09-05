const fs = require('fs');
let file = 'src/data/journey/nodeFactory.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const ACTIVE_ICON_MAP: Record<NodeType, NodeIcon> = {\n  [NodeType.LESSON]: NodeIcon.STAR,\n  [NodeType.CHECKPOINT]: NodeIcon.BOOK,\n  [NodeType.CHEST]: NodeIcon.CHEST,\n};',
  'const ACTIVE_ICON_MAP: Record<NodeType, NodeIcon> = {\n  [NodeType.LESSON]: NodeIcon.BOOK,\n  [NodeType.CHECKPOINT]: NodeIcon.CHECKPOINT,\n  [NodeType.CHEST]: NodeIcon.CHEST,\n};'
);

fs.writeFileSync(file, content);
