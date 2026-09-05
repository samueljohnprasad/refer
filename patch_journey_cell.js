const fs = require('fs');
const file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldNodeBlock = `      ) : (
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
      )}`;

const newNodeBlock = `      ) : item.type === NodeType.LESSON ? (
        <View
          className="items-center justify-center"
          style={{
            position: "absolute",
            left: nodePosition.x - NODE_DISPLAY_SIZE / 2,
            top: nodePosition.y - NODE_DISPLAY_SIZE / 2,
            width: NODE_DISPLAY_SIZE,
            height: NODE_DISPLAY_SIZE,
          }}
        >
          <DuolingoSvgNodeButton
            size={NODE_DISPLAY_SIZE}
            onPress={handlePress}
            disabled={!isInteractive}
            faceColor={nodeState === NodeState.COMPLETED ? SAGE[700] : (nodeState === NodeState.CURRENT ? SAGE[500] : SAGE[200])}
            rimColor={nodeState === NodeState.COMPLETED ? SAGE[800] : (nodeState === NodeState.CURRENT ? SAGE[600] : SAGE[300])}
            icon={
              nodeState === NodeState.LOCKED ? (
                <Feather name="lock" size={24} color={SAGE[400]} />
              ) : nodeState === NodeState.COMPLETED ? (
                <FontAwesome5 name="check" size={24} color="#FFFFFF" />
              ) : (
                <FontAwesome5 name="star" size={24} color="#FFFFFF" />
              )
            }
            iconSize={35}
            accessibilityLabel={nodeA11yLabel(item.type, nodeState)}
          />
        </View>
      ) : (
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
      )}`;

content = content.replace(oldNodeBlock, newNodeBlock);
fs.writeFileSync(file, content);
