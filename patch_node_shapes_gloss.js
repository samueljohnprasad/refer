const fs = require('fs');
const file = 'src/domains/journey/ui/components/NodeShapes.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the LESSON return
const lessonCode = `
      <Svg width={size} height={size + depth} viewBox={\`0 0 \${size} \${size + depth}\`}>
        <Defs>
          <ClipPath id="lessonClip">
            <Ellipse cx={hSize} cy={hSize} rx={hSize - 4} ry={hSize - 4} />
          </ClipPath>
        </Defs>
        {/* Rim / Shadow */}
        <Ellipse cx={hSize} cy={hSize + depth} rx={hSize - 4} ry={hSize - 4} fill={rim as any} />
        {/* Animated Face */}
        <AnimatedEllipse
          cx={hSize}
          cy={hSize}
          rx={hSize - 4}
          ry={hSize - 4}
          fill={fill as any}
          animatedProps={faceAnimatedProps}
        />
        {/* Gloss */}
        <Animated.G animatedProps={faceAnimatedProps} clipPath="url(#lessonClip)">
          <Rect x={-size} y={size * 0.05} width={size * 3} height={size * 0.25} fill="rgba(255, 255, 255, 0.3)" transform={\`rotate(-45 \${hSize} \${hSize})\`} />
          <Rect x={-size} y={size * 0.35} width={size * 3} height={size * 0.08} fill="rgba(255, 255, 255, 0.3)" transform={\`rotate(-45 \${hSize} \${hSize})\`} />
        </Animated.G>
      </Svg>
    );
`;

content = content.replace(/<Svg width=\{size\}.*?<\/Svg>\n    \);\n  \}/s, lessonCode + '  }');

// Replace the Path return
const pathCode = `
  return (
    <Svg width={size} height={size + depth} viewBox={viewBox}>
      <Defs>
        <ClipPath id="shapeClip">
          <Path d={pathD} />
        </ClipPath>
      </Defs>
      {/* Rim / Shadow - offset vertically */}
      <G transform={\`translate(0, \${depth * (100 / size)})\`}>
        <Path d={pathD} fill={rim as any} />
      </G>
      {/* Animated Face */}
      <AnimatedPath d={pathD} fill={fill as any} animatedProps={faceAnimatedProps} />
      {/* Gloss */}
      <Animated.G animatedProps={faceAnimatedProps} clipPath="url(#shapeClip)">
        <Rect x={-50} y={10} width={200} height={25} fill="rgba(255, 255, 255, 0.3)" transform="rotate(-45 50 50)" />
        <Rect x={-50} y={40} width={200} height={8} fill="rgba(255, 255, 255, 0.3)" transform="rotate(-45 50 50)" />
      </Animated.G>
    </Svg>
  );
`;

content = content.replace(/return \(\n    <Svg width=\{size\}.*?<\/Svg>\n  \);/s, pathCode.trim());

content = content.replace('const AnimatedPath = Animated.createAnimatedComponent(Path);', 'const AnimatedPath = Animated.createAnimatedComponent(Path);\nconst AnimatedG = Animated.createAnimatedComponent(G);');
content = content.replace(/<Animated\.G/g, '<AnimatedG');
content = content.replace(/<\/Animated\.G>/g, '</AnimatedG>');

fs.writeFileSync(file, content);
