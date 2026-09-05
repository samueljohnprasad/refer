const fs = require('fs');
let file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  handlePress,\n  screenWidth,\n}: JourneyNodeCellViewProps)',
  '  handlePress,\n  screenWidth,\n  courseId,\n}: JourneyNodeCellViewProps)'
);

fs.writeFileSync(file, content);
