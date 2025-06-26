import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedCheckmarkProps {
  size?: number;
  color?: string;
  completed: boolean;
  style?: ViewStyle;
  delay?: number;
  label?: string;
}

const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  size = 24,
  color,
  completed = false,
  style,
  delay = 0,
  label,
}) => {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const rotation = useSharedValue(0);

  // Use the provided color or default to theme success color
  const checkColor = color || theme.colors.success;

  useEffect(() => {
    if (completed) {
      // Animate in with a bounce effect
      opacity.value = withDelay(
        delay,
        withTiming(1, { duration: 300 })
      );
      
      scale.value = withSequence(
        withDelay(
          delay, 
          withTiming(1.2, { duration: 250 })
        ),
        withTiming(1, { duration: 150 })
      );
      
      // Rotate in for a satisfying effect
      rotation.value = withDelay(
        delay,
        withTiming(360, { duration: 500 })
      );
    } else {
      // Reset animations
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.5, { duration: 200 });
      rotation.value = withTiming(0, { duration: 200 });
    }
  }, [completed, delay]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotation.value}deg` }
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      <Reanimated.View style={containerStyle}>
        <View style={[styles.iconContainer, { backgroundColor: checkColor + '20', width: size, height: size }]}>
          <FontAwesome name="check" size={size * 0.5} color={checkColor} />
        </View>
      </Reanimated.View>
      {label && (
        <View style={styles.labelContainer}>
          <Reanimated.Text style={[styles.label, { opacity: opacity.value }]}>
            {label}
          </Reanimated.Text>
        </View>
      )}
    </View>
  );
};

// We're now using react-native-svg directly

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  iconContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default AnimatedCheckmark;
