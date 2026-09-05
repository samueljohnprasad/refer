const fs = require('fs');
let file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  const faceAnimatedProps = useAnimatedProps(() => {\n    if (type === NodeType.LESSON) {\n      return { transform: [{ translateY: yOffset.value }] };\n    }\n    return { transform: [{ translateY: yOffset.value }] };\n  });',
  '  const faceAnimatedProps = useAnimatedProps(() => {\n    if (type === NodeType.LESSON) {\n      // LESSON uses a 120x130 viewBox where the rim is 13 units below the face (53 - 40).\n      // DEPTH is 6. To move 13 units when yOffset is 6, we multiply by (13/6).\n      return { transform: [{ translateY: yOffset.value * (13 / 6) }] };\n    }\n    return { transform: [{ translateY: yOffset.value }] };\n  });'
);

fs.writeFileSync(file, content);
