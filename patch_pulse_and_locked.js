const fs = require('fs');

// Patch Node.tsx to remove pulse ring
let file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

const pulseBlock = `
        {vm.indicator === "pulse" && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -8,
              left: -8,
              right: -8,
              bottom: DEPTH - 8,
              borderWidth: 2,
              borderColor: vm.faceColor,
              borderRadius: size,
              opacity: 0.5,
            }}
          />
        )}
`;
content = content.replace(pulseBlock, '');
fs.writeFileSync(file, content);

// Patch useNodeViewModel.ts to use SAGE[200] for locked rim, SAGE[300] for icon
file = 'src/domains/journey/ui/hooks/useNodeViewModel.ts';
content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '    case NodeState.LOCKED:\n      faceColor = SAGE[100];\n      rimColor = SAGE[400];\n      iconColor = SAGE[400];',
  '    case NodeState.LOCKED:\n      faceColor = SAGE[100];\n      rimColor = SAGE[200];\n      iconColor = SAGE[400];'
);

fs.writeFileSync(file, content);
