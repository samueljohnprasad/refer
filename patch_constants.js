const fs = require('fs');
let file = 'src/data/journey/constants.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'export const NODE_SIZE = {\n  regular: 64,\n  chest: 80,\n  progressRingGap: 4,\n  progressRingStroke: 6,\n} as const;',
  'export const NODE_SIZE = {\n  regular: 72,\n  chest: 84,\n  progressRingGap: 4,\n  progressRingStroke: 6,\n} as const;'
);

fs.writeFileSync(file, content);
