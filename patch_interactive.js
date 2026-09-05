const fs = require('fs');
const file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'disabled={!isInteractive}',
  'disabled={nodeState === NodeState.LOCKED}'
);

fs.writeFileSync(file, content);
