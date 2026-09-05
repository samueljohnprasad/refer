const fs = require('fs');
const file = 'src/domains/journey/ui/hooks/useJourneyNodeCellViewModel.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  'onNodePress: (node: PathNodeData, event?: any, color?: string | import("react-native").OpaqueColorValue) => void;',
  'onNodePress: (node: PathNodeData, event?: any, color?: string) => void;'
);
fs.writeFileSync(file, content);
