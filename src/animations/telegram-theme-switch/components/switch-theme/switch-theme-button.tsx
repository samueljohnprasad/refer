import type { StyleProp, ViewStyle } from 'react-native';
import Reanimated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useSwitchTheme } from './context';

type SwitchThemeButtonProps = {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const MAX_THEME_ANIMATION_SIZE = 65;

// https://lottiefiles.com/animations/light-to-darak-Y6M1BnwnBn

const SwitchThemeButton: React.FC<SwitchThemeButtonProps> = ({
  style,
  contentContainerStyle,
}) => {
  const { toggleTheme, animationProgress } = useSwitchTheme();

  const viewRef = useAnimatedRef<Reanimated.View>();

  const reanimatedProgressValue = useDerivedValue(() => {
    return animationProgress.value;
  });

  const isInvisible = useDerivedValue(() => {
    return (
      reanimatedProgressValue.value > 0 && reanimatedProgressValue.value < 1
    );
  });

  const rAnimatedStyle = useAnimatedStyle(() => {
    const opacity = isInvisible.value ? 0 : 1;
    return {
      opacity,
    };
  }, []);

  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap().onTouchesUp(() => {
    const value = measure(viewRef);
    if (!value) return;
    const center = {
      x: value.pageX,
      y: value.pageY,
      height: 80,
      width: 80,
    };

    runOnJS(toggleTheme)({ center, style });
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value),
        },
      ],
    };
  });

  const rPulseStyle = useAnimatedStyle(() => {
    return {
      opacity: isInvisible.value ? 0.5 : 1,
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Reanimated.View style={[contentContainerStyle, rContainerStyle]}>
        <Reanimated.View
          ref={viewRef}
          style={[
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
            rAnimatedStyle,
          ]}>
          <Reanimated.View
            style={[
              style,
              {
                height: MAX_THEME_ANIMATION_SIZE,
                width: MAX_THEME_ANIMATION_SIZE,
                borderRadius: MAX_THEME_ANIMATION_SIZE / 2,
              },
              rPulseStyle,
            ]}
          />
        </Reanimated.View>
      </Reanimated.View>
    </GestureDetector>
  );
};

export { SwitchThemeButton };
