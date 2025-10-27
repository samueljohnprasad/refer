import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { PressableScale } from "pressto";

type SplitAction = {
  label: string;
  labelColor?: string;
  onPress: () => void;
  backgroundColor: string;
  icon?: React.ReactNode;
  iconVisible?: boolean;
};

type SplitButtonProps = {
  splitted: boolean;
  mainAction: SplitAction;
  leftAction: SplitAction;
  rightAction: SplitAction;
};

const ButtonHeight = 64; // Slightly taller for premium feel

const LayoutTransitionDefault = LinearTransition.duration(300);

export const SplitButton: React.FC<SplitButtonProps> = ({
  splitted,
  mainAction,
  leftAction,
  rightAction,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const paddingHorizontal = 20;
  const gap = 10;

  const splittedOffset = windowWidth * 0.45;
  const LeftSplittedButtonWidth =
    (windowWidth - paddingHorizontal * 2 - gap - splittedOffset) / 2;
  const RightSplittedButtonWidth =
    (windowWidth - paddingHorizontal * 2 - gap + splittedOffset) / 2;

  const rLeftButtonStyle = useAnimatedStyle(() => {
    const leftButtonWidth = splitted ? LeftSplittedButtonWidth : 0;
    return {
      width: withTiming(leftButtonWidth, {
        duration: 350,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      opacity: withTiming(splitted ? 1 : 0, {
        duration: 250,
      }),
      transform: [
        {
          scale: withSpring(splitted ? 1 : 0.95, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  }, [splitted]);

  const rLeftTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 1 : 0, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  }, [splitted]);

  const rMainButtonStyle = useAnimatedStyle(() => {
    const mainButtonWidth = splitted
      ? RightSplittedButtonWidth
      : LeftSplittedButtonWidth + RightSplittedButtonWidth;
    return {
      width: withTiming(mainButtonWidth, {
        duration: 350,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      marginLeft: withTiming(splitted ? gap : 0, {
        duration: 300,
      }),
      backgroundColor: withTiming(
        splitted ? rightAction.backgroundColor : mainAction.backgroundColor,
        { duration: 250 }
      ),
      transform: [
        {
          scale: withSpring(1, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  }, [splitted]);

  const rMainTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 0 : 1),
    };
  }, [splitted]);

  const rRightTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 1 : 0),
    };
  }, [splitted]);

  return (
    <View
      style={{
        width: "100%",
        height: ButtonHeight,
        paddingHorizontal,
        flexDirection: "row",
      }}
    >
      <PressableScale
        onPress={leftAction.onPress}
        style={[
          {
            backgroundColor: leftAction.backgroundColor,
          },
          rLeftButtonStyle,
          styles.button,
        ]}
      >
        <Animated.Text
          layout={leftAction.iconVisible ? LayoutTransitionDefault : undefined}
          numberOfLines={1}
          style={[
            styles.label,
            rLeftTextStyle,
            {
              color: leftAction.labelColor,
            },
          ]}
        >
          {leftAction.iconVisible && leftAction.icon}
          {leftAction.label}
        </Animated.Text>
      </PressableScale>
      <PressableScale
        onPress={splitted ? rightAction.onPress : mainAction.onPress}
        style={[rMainButtonStyle, styles.button]}
      >
        <Animated.Text
          layout={mainAction.iconVisible ? LayoutTransitionDefault : undefined}
          style={[
            styles.label,
            rMainTextStyle,
            {
              color: mainAction.labelColor,
            },
          ]}
        >
          {mainAction.iconVisible && mainAction.icon}
          {mainAction.label}
        </Animated.Text>
        <Animated.Text
          layout={rightAction.iconVisible ? LayoutTransitionDefault : undefined}
          style={[
            styles.label,
            rRightTextStyle,
            {
              color: rightAction.labelColor,
            },
          ]}
        >
          {rightAction.iconVisible && rightAction.icon}
          {rightAction.label}
        </Animated.Text>
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 17,
    color: "white",
    position: "absolute",
    overflow: "visible",
    letterSpacing: 0.3,
    fontFamily: "SF-Pro-Rounded-Bold",
    fontWeight: "600",
  },
  button: {
    height: ButtonHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
    borderCurve: "continuous",
    flexDirection: "row",
    // Premium shadows
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    // Subtle border for depth
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});
