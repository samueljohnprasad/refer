const fs = require('fs');
const file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { View } from "react-native";',
  'import { View, Text } from "react-native";'
);

fs.writeFileSync(file, content);
