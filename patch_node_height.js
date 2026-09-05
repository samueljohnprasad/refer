const fs = require('fs');
let file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace height in container
content = content.replace(
  'width: size,\n          height: size + DEPTH,',
  'width: size,\n          height: type === NodeType.LESSON ? size : size + DEPTH,'
);

// Replace height in Pressable
content = content.replace(
  'style={{ width: size, height: size + DEPTH }}',
  'style={{ width: size, height: type === NodeType.LESSON ? size : size + DEPTH }}'
);

fs.writeFileSync(file, content);
