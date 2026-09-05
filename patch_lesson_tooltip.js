const fs = require('fs');
const file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

const tooltipCode = `
          {nodeState === NodeState.CURRENT && item.label && (
            <View
              className="items-center"
              style={{
                position: "absolute",
                top: -40,
                left: NODE_DISPLAY_SIZE / 2 - 40,
                width: 80,
                zIndex: 20,
                elevation: 10,
              }}
              pointerEvents="none"
            >
              <View className="bg-white px-3 py-1.5 rounded-2xl shadow-sm border border-neutral-100 items-center justify-center min-w-[70px]">
                <Text className="text-neutral-600 font-bold text-xs uppercase tracking-wider">
                  {item.label}
                </Text>
              </View>
              <View
                className="w-3 h-3 bg-white border-b border-r border-neutral-100"
                style={{
                  transform: [{ rotate: "45deg" }, { translateY: -6 }],
                }}
              />
            </View>
          )}
`;

content = content.replace(
  '            accessibilityLabel={nodeA11yLabel(item.type, nodeState)}\n          />\n        </View>\n      ) : (',
  '            accessibilityLabel={nodeA11yLabel(item.type, nodeState)}\n          />\n' + tooltipCode + '\n        </View>\n      ) : ('
);

fs.writeFileSync(file, content);
