const fs = require('fs');
let file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import Link
if (!content.includes('import { Link } from "expo-router";')) {
  content = content.replace(
    'import { Node } from "./Node";',
    'import { Link } from "expo-router";\nimport { Node } from "./Node";'
  );
}

const oldNode = `<Node
        type={item.type}
        state={nodeState}
        id={item.id}
        index={item.globalIndex}
        position={nodePosition}
        size={NODE_DISPLAY_SIZE}
        label={item.label}
        iconName={item.icon}
        onPress={handlePress}
        accessibilityLabel={nodeA11yLabel(item.type, nodeState)}
      />`;

const newNode = `{(item.type === "lesson" || item.type === "milestone") && (nodeState === "current" || nodeState === "completed" || nodeState === "available") ? (
        <Link
          href={{
            pathname: "/tabs/screens/journey-flow",
            params: { courseId: item.courseId || "default", nodeId: item.id },
          }}
          asChild
        >
          <Link.Trigger>
            <Link.AppleZoom>
              <Node
                type={item.type}
                state={nodeState}
                id={item.id}
                index={item.globalIndex}
                position={nodePosition}
                size={NODE_DISPLAY_SIZE}
                label={item.label}
                iconName={item.icon}
                onPress={handlePress}
                accessibilityLabel={nodeA11yLabel(item.type, nodeState)}
              />
            </Link.AppleZoom>
          </Link.Trigger>
        </Link>
      ) : (
        <Node
          type={item.type}
          state={nodeState}
          id={item.id}
          index={item.globalIndex}
          position={nodePosition}
          size={NODE_DISPLAY_SIZE}
          label={item.label}
          iconName={item.icon}
          onPress={handlePress}
          accessibilityLabel={nodeA11yLabel(item.type, nodeState)}
        />
      )}`;

content = content.replace(oldNode, newNode);

// Note: `courseId` is passed in `JourneyNodeCellViewProps`. So I should use `courseId` directly, not `item.courseId`.
content = content.replace('item.courseId || "default"', 'courseId');

fs.writeFileSync(file, content);
