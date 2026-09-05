const fs = require('fs');
const file = 'src/domains/journey/ui/components/index.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('export { default as ChestNode } from "./ChestNode";\n', '');

fs.writeFileSync(file, content);
