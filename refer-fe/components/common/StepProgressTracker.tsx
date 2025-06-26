import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ViewStyle, StyleProp } from 'react-native';
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
import ResponsiveText from './ResponsiveText';

export interface Step {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  icon?: string;
}

interface StepProgressTrackerProps {
  steps: Step[];
  style?: StyleProp<ViewStyle>;
  activeColor?: string;
  inactiveColor?: string;
  showConnectingLines?: boolean;
  animated?: boolean;
  stepDelay?: number;
}

const StepProgressTracker: React.FC<StepProgressTrackerProps> = ({
  steps,
  style,
  activeColor,
  inactiveColor,
  showConnectingLines = true,
  animated = true,
  stepDelay = 300,
}) => {
  const { theme } = useTheme();
  const activeColorValue = activeColor || theme.colors.success;
  const inactiveColorValue = inactiveColor || theme.colors.secondary + '40';
  
  // Animation values for each step
  const stepScales = steps.map(() => useSharedValue(0.6));
  const stepOpacities = steps.map(() => useSharedValue(0));
  const lineProgress = steps.map(() => useSharedValue(0));
  
  useEffect(() => {
    // Animate steps sequentially when they're completed
    steps.forEach((step, index) => {
      if (step.completed && animated) {
        // Calculate delay based on step position
        const delay = index * stepDelay;
        
        // Animate circle scale with bounce effect
        stepScales[index].value = withDelay(
          delay,
          withSequence(
            withTiming(1.2, { duration: 300, easing: Easing.out(Easing.quad) }),
            withTiming(1, { duration: 150 })
          )
        );
        
        // Fade in
        stepOpacities[index].value = withDelay(
          delay,
          withTiming(1, { duration: 400 })
        );
        
        // If this isn't the last step, animate the connecting line
        if (index < steps.length - 1 && showConnectingLines) {
          lineProgress[index].value = withDelay(
            delay + 200,
            withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) })
          );
        }
      } else if (!step.completed) {
        // Reset animations for incomplete steps
        stepScales[index].value = withTiming(0.6, { duration: 200 });
        stepOpacities[index].value = withTiming(0.5, { duration: 200 });
        if (index < steps.length - 1 && showConnectingLines) {
          lineProgress[index].value = withTiming(0, { duration: 200 });
        }
      }
    });
  }, [steps, animated, stepDelay]);

  // Get appropriate icon for step
  const getStepIcon = (step: Step) => {
    if (step.icon) {
      return step.icon;
    }
    return step.completed ? 'check' : 'circle';
  };
  
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        // Create animated styles for this step
        const circleStyle = useAnimatedStyle(() => ({
          transform: [{ scale: stepScales[index].value }],
          opacity: stepOpacities[index].value,
          backgroundColor: step.completed ? activeColorValue : inactiveColorValue,
        }));
        
        // Create animated style for connecting line (if not the last step)
        const lineStyle = index < steps.length - 1 ? 
          useAnimatedStyle(() => ({
            width: `${lineProgress[index].value * 100}%`,
            backgroundColor: activeColorValue,
          })) : null;
        
        return (
          <View key={step.id} style={styles.stepWrapper}>
            <View style={styles.stepAndLine}>
              {/* Step circle with icon */}
              <Reanimated.View style={[styles.stepCircle, circleStyle]}>
                <FontAwesome 
                  name={getStepIcon(step) as any} 
                  size={16} 
                  color="white" 
                />
              </Reanimated.View>
              
              {/* Connecting line to next step (if not last step) */}
              {index < steps.length - 1 && showConnectingLines && (
                <View style={styles.lineContainer}>
                  <View style={styles.lineBackground} />
                  <Reanimated.View style={[styles.line, lineStyle]} />
                </View>
              )}
            </View>
            
            {/* Step content */}
            <View style={styles.stepContent}>
              <ResponsiveText
                content={step.title}
                baseSize={14}
                bold={step.completed}
                customStyle={{ 
                  color: step.completed ? theme.colors.text : theme.colors.secondary,
                  opacity: step.completed ? 1 : 0.7
                }}
              />
              
              {step.description && (
                <ResponsiveText
                  content={step.description}
                  baseSize={12}
                  customStyle={{ 
                    color: theme.colors.secondary,
                    marginTop: 4,
                    opacity: step.completed ? 0.8 : 0.5
                  }}
                />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stepWrapper: {
    marginBottom: 16,
  },
  stepAndLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContainer: {
    flex: 1,
    height: 2,
    marginLeft: 8,
    position: 'relative',
  },
  lineBackground: {
    width: '100%',
    height: 2,
    backgroundColor: '#e0e0e0',
    position: 'absolute',
  },
  line: {
    height: 2,
    position: 'absolute',
  },
  stepContent: {
    marginTop: 8,
    paddingLeft: 8,
  },
});

export default StepProgressTracker;
