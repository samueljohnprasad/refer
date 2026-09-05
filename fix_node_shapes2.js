const fs = require('fs');
const file = 'src/domains/journey/ui/components/NodeShapes.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/let viewBox = "0 0 100 100";/g, 'let viewBox = `0 0 100 ${100 + depth * (100 / size)}`;');
content = content.replace(/viewBox = "0 0 100 100";/g, 'viewBox = `0 0 100 ${100 + depth * (100 / size)}`;');

fs.writeFileSync(file, content);
