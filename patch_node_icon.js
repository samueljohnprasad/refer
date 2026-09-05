const fs = require('fs');
let file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update NodeProps
content = content.replace(
  '  label?: string;\n  onPress: (node?: any) => void;',
  '  label?: string;\n  iconName?: string | null;\n  onPress: (node?: any) => void;'
);

// Update Node component destructuring
content = content.replace(
  '  label,\n  onPress,\n  accessibilityLabel,\n}: NodeProps) {',
  '  label,\n  iconName,\n  onPress,\n  accessibilityLabel,\n}: NodeProps) {'
);

// Update useNodeViewModel call
content = content.replace(
  '  const vm = useNodeViewModel(type, state, null);',
  '  const vm = useNodeViewModel(type, state, iconName ?? null);'
);

fs.writeFileSync(file, content);

file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
content = fs.readFileSync(file, 'utf8');

// Update JourneyNodeCell to pass iconName
content = content.replace(
  '        size={NODE_DISPLAY_SIZE}\n        label={item.label}\n        onPress={handlePress}',
  '        size={NODE_DISPLAY_SIZE}\n        label={item.label}\n        iconName={item.icon}\n        onPress={handlePress}'
);

fs.writeFileSync(file, content);
