const fs = require('fs');
const file = 'src/domains/journey/ui/hooks/useCheckpointSheet.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('NodeStatus')) {
  content = content.replace(
    'import type { PathNodeData } from "@/src/types/journey";',
    'import type { PathNodeData } from "@/src/types/journey";\nimport { NodeStatus } from "@/src/types/journey/enums";'
  );
  fs.writeFileSync(file, content);
}
