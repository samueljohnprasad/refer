const fs = require('fs');
const file = 'src/domains/journey/ui/components/NodeShapes.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('let viewBox = NODE_SHAPES.hexagon.viewBox;', 'let viewBox = "0 0 100 100";');
content = content.replace('let pathD = NODE_SHAPES.hexagon.pathD;', 'let pathD = NODE_SHAPES.hexagon;');
content = content.replace('viewBox = NODE_SHAPES.rosette.viewBox;', 'viewBox = "0 0 100 100";');
content = content.replace('pathD = NODE_SHAPES.rosette.pathD;', 'pathD = NODE_SHAPES.rosette;');
content = content.replace('viewBox = NODE_SHAPES.shield.viewBox;', 'viewBox = "0 0 100 100";');
content = content.replace('pathD = NODE_SHAPES.shield.pathD;', 'pathD = NODE_SHAPES.shield;');

fs.writeFileSync(file, content);
