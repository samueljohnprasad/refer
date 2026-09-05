const fs = require('fs');
let file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  iconName?: string | null;\n  onPress: (node?: any) => void;\n  accessibilityLabel: string;\n}',
  '  iconName?: string | null;\n  onPress?: (e?: any) => void;\n  accessibilityLabel: string;\n}'
);

content = content.replace(
  'export const Node = React.memo(function Node({',
  'export const Node = React.memo(React.forwardRef<View, NodeProps>(function Node({'
);

content = content.replace(
  '  accessibilityLabel,\n}: NodeProps) {',
  '  accessibilityLabel,\n}: NodeProps, ref) {'
);

content = content.replace(
  '  const handlePress = useCallback(() => {\n    if (!vm.isInteractive) return;\n    // We pass node object as requested by contract, though typically caller wraps it anyway.\n    onPress({ id, index, type, state, position, size, label });\n  }, [vm.isInteractive, onPress, id, index, type, state, position, size, label]);',
  '  const handlePress = useCallback((e: any) => {\n    if (!vm.isInteractive) return;\n    onPress?.(e);\n  }, [vm.isInteractive, onPress]);'
);

content = content.replace(
  '  return (\n    <Animated.View\n      style={[',
  '  return (\n    <Animated.View\n      ref={ref}\n      style={['
);

content = content.replace(
  '      <Pressable\n        accessibilityRole="button"',
  '      <Pressable\n        accessibilityRole="button"'
);

// Don't forget to close the forwardRef call at the end!
content = content.replace(
  '      )}\n    </Animated.View>\n  );\n});',
  '      )}\n    </Animated.View>\n  );\n}));'
);

fs.writeFileSync(file, content);
