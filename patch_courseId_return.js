const fs = require('fs');
let file = 'src/domains/journey/ui/hooks/useJourneyNodeCellViewModel.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  return {\n    item,',
  '  return {\n    item,\n    courseId,'
);

fs.writeFileSync(file, content);
