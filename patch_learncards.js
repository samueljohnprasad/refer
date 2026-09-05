const fs = require('fs');
let file = 'src/domains/journey/learning/courseExerciseSimpleTransitions.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '    ready: !isLastCard,',
  '    ready: true,'
);

fs.writeFileSync(file, content);
