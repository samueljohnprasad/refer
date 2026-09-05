const fs = require('fs');
let file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the tooltip Animated.View with a wrapper
let oldTooltip = `{label && state === NodeState.CURRENT && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: -40,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: "white",
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#E5E5E5",
              shadowColor: "#000",
              minWidth: 80,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            },
            iconAnimatedStyle,
          ]}
        >
          <Text style={{ fontFamily: "Nunito-Bold", fontSize: 14, color: "#4B4B4B" }}>
            {label}
          </Text>
          <View
            style={{
              position: "absolute",
              bottom: -6,
              alignSelf: "center",
              width: 10,
              height: 10,
              backgroundColor: "white",
              borderBottomWidth: 2,
              borderRightWidth: 2,
              borderColor: "#E5E5E5",
              transform: [{ rotate: "45deg" }],
            }}
          />
        </Animated.View>
      )}`;

let newTooltip = `{label && state === NodeState.CURRENT && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -40,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 20,
            elevation: 20,
          }}
        >
          <Animated.View
            style={[
              {
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: "white",
                borderRadius: 16,
                borderWidth: 2,
                borderColor: "#E5E5E5",
                shadowColor: "#000",
                minWidth: 80,
                alignItems: "center",
                justifyContent: "center",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              },
              iconAnimatedStyle,
            ]}
          >
            <Text style={{ fontFamily: "Nunito-Bold", fontSize: 14, color: "#4B4B4B" }}>
              {label}
            </Text>
            <View
              style={{
                position: "absolute",
                bottom: -6,
                alignSelf: "center",
                width: 10,
                height: 10,
                backgroundColor: "white",
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderColor: "#E5E5E5",
                transform: [{ rotate: "45deg" }],
              }}
            />
          </Animated.View>
        </View>
      )}`;

content = content.replace(oldTooltip, newTooltip);
fs.writeFileSync(file, content);
