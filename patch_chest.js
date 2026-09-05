const fs = require('fs');
const file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '      {item.type === NodeType.CHEST ? (\n        // ponytail: keep ChestNode for shake/shine animation; Node handles all other types\n        <ChestNode node={pathNodeData} position={nodePosition} onPress={handlePress} />\n      ) : item.type === NodeType.LESSON ? (',
  '      {item.type === NodeType.LESSON ? ('
);

fs.writeFileSync(file, content);
