const fs = require('fs');
let file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the entire LESSON ternary with just Node
content = content.replace(/\{item\.type === NodeType\.LESSON \? \([\s\S]*?\) : \(/, '{true ? (');

fs.writeFileSync(file, content);

file = 'src/domains/journey/ui/components/Node.tsx';
content = fs.readFileSync(file, 'utf8');

// Add alignSelf: center to the tooltip
content = content.replace(
  '              minWidth: 80,\n              alignItems: "center",\n              justifyContent: "center",',
  '              minWidth: 80,\n              alignItems: "center",\n              justifyContent: "center",\n              alignSelf: "center",'
);

fs.writeFileSync(file, content);
