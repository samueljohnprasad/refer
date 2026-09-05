const fs = require('fs');
const file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { DuolingoSvgNodeButton }')) {
  content = content.replace(
    'import ChestNode from "./ChestNode";',
    'import ChestNode from "./ChestNode";\nimport { DuolingoSvgNodeButton } from "./DuolingoSvgNodeButton";'
  );
}

if (!content.includes('import { SAGE }')) {
  content = content.replace(
    'import { NodeType, NodeState } from "@/src/types/journey";',
    'import { NodeType, NodeState } from "@/src/types/journey";\nimport { SAGE } from "@/src/theme";'
  );
}

fs.writeFileSync(file, content);
