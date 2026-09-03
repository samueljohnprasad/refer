const fs = require('fs');
const file = 'src/components/exercise/StateSwitchCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  /const meterIndicatorStyle = useAnimatedStyle\(\(\) => \{\n\s*return \{\n\s*left: withSpring\(`\$\{meterValue\}%`, \{ damping: 20, stiffness: 90 \}\)\n\s*\};\n\s*\}\);/,
  `// Replaced useAnimatedStyle to prevent Reanimated crashes with string percentages\n  const meterIndicatorStyle = { left: \`\${meterValue}%\` };`
);
code = code.replace(
  /<Animated\.View style=\\{\[styles\.meterIndicator, meterIndicatorStyle\]\\} \/>/,
  `<Animated.View layout={LinearTransition.springify().damping(20).stiffness(90)} style={[styles.meterIndicator, meterIndicatorStyle]} />`
);
fs.writeFileSync(file, code);
