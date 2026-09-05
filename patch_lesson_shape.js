const fs = require('fs');
const file = 'src/domains/journey/ui/components/NodeShapes.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldLessonCode = `
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
        <AnimatedG animatedProps={faceAnimatedProps} clipPath="url(#lessonClip)">
          <Rect x={-size} y={size * 0.05} width={size * 3} height={size * 0.25} fill="rgba(255, 255, 255, 0.3)" transform={\`rotate(-45 \${hSize} \${hSize})\`} />
          <Rect x={-size} y={size * 0.35} width={size * 3} height={size * 0.08} fill="rgba(255, 255, 255, 0.3)" transform={\`rotate(-45 \${hSize} \${hSize})\`} />
        </AnimatedG>
      </Svg>
`;

const newLessonCode = `
      <Svg width={size} height={size} viewBox="-10 -10 120 130">
        <Defs>
          <ClipPath id="lessonClip">
            <Ellipse cx={50} cy={40} rx={51} ry={41} />
          </ClipPath>
        </Defs>
        <Ellipse cx={50} cy={46} rx={55} ry={45} fill={rim as any} />
        <AnimatedEllipse
          cx={50}
          cy={40}
          rx={55}
          ry={45}
          fill={fill as any}
          animatedProps={faceAnimatedProps}
        />
        <AnimatedG animatedProps={faceAnimatedProps} clipPath="url(#lessonClip)">
          <Rect x={-10} y={-2} width={120} height={30} fill="rgba(255, 255, 255, 0.3)" transform="rotate(-45 50 40)" />
          <Rect x={-10} y={50} width={120} height={26} fill="rgba(255, 255, 255, 0.3)" transform="rotate(-45 50 40)" />
        </AnimatedG>
      </Svg>
`;

content = content.replace(oldLessonCode.trim(), newLessonCode.trim());

fs.writeFileSync(file, content);
