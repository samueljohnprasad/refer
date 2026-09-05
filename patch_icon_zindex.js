const fs = require('fs');
const file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '              bottom: type === NodeType.LESSON ? "16%" : DEPTH, // Match the old 3D center precisely\n              alignItems: "center",\n              justifyContent: "center",\n            },',
  '              bottom: type === NodeType.LESSON ? "16%" : DEPTH, // Match the old 3D center precisely\n              alignItems: "center",\n              justifyContent: "center",\n              zIndex: 10,\n              elevation: 10,\n            },'
);

fs.writeFileSync(file, content);
