const fs = require('fs');
const file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import ChestNode from "./ChestNode";\n', '');

fs.writeFileSync(file, content);
