const fs = require('fs');
let file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '          if (finished && onPress) {\n            runOnJS(onPress)(e);\n          }',
  '          if (finished && onPress) {\n            // Do not pass the synthetic event `e` into the worklet closure to avoid serialization errors\n            runOnJS(onPress)();\n          }'
);

fs.writeFileSync(file, content);
