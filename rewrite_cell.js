const fs = require('fs');
let file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /(<Svg[\s\S]*?<\/Svg>\n\s*\) : null\}\n)[\s\S]*?(<\/View>\n\s*\);\n\}\);)/;
const replacement = `$1
      <Node
        type={item.type}
        state={nodeState}
        id={item.id}
        index={item.globalIndex}
        position={nodePosition}
        size={NODE_DISPLAY_SIZE}
        label={nodeState === NodeState.CURRENT ? item.label : undefined}
        onPress={handlePress}
        accessibilityLabel={nodeA11yLabel(item.type, nodeState)}
      />
    $2`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
