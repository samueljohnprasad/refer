import React from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface SourceProps {
  id: string; // The unique ID for this transition
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  className?: string;
}

/**
 * Wraps the element (card, button, node) that the user taps.
 * If onPress is provided, it acts as a button. Otherwise, it just acts as a wrapper.
 */
const Source: React.FC<SourceProps> = ({ id, children, style, onPress, className }) => {
  const AnimatedComponent = (
    <Animated.View
      sharedTransitionTag={`shared-${id}`}
      style={style}
      className={className}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        {AnimatedComponent}
      </Pressable>
    );
  }

  return AnimatedComponent;
};

interface DestinationProps {
  id: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/**
 * Wraps the background of the destination screen.
 * This must have the EXACT SAME background color/border-radius as the Source for a seamless morph.
 */
const Destination: React.FC<DestinationProps> = ({ id, children, style, className }) => {
  return (
    <Animated.View
      sharedTransitionTag={`shared-${id}`}
      style={[{ flex: 1 }, style]}
      className={className}
    >
      {children}
    </Animated.View>
  );
};

interface ContentProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/**
 * Wraps the content inside the destination screen (text, inputs, etc.).
 * It beautifully staggers the reveal of the content so it appears AFTER the background expands.
 */
const Content: React.FC<ContentProps> = ({ 
  children, 
  delay = 150, 
  duration = 400,
  style,
  className
}) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(duration).springify()}
      style={[{ flex: 1 }, style]}
      className={className}
    >
      {children}
    </Animated.View>
  );
};

export const SharedElement = {
  Source,
  Destination,
  Content,
};
