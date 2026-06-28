import React, { cloneElement, ReactElement } from 'react';
import { GestureResponderEvent } from 'react-native';
import { useCircularRevealNavigate } from '@/src/hooks/useCircularRevealNavigate';

interface CircularRevealWrapperProps {
  /** The navigation target route */
  href: string;
  /** The color of the circular reveal mask. Defaults to #4ECDC4 */
  color?: string;
  /** Custom duration for the transition animation in milliseconds */
  duration?: number;
  /** The child component (must accept an onPress prop, e.g., Pressable, TouchableOpacity) */
  children: ReactElement;
}

/**
 * A highly reusable wrapper component that intercepts the onPress event 
 * of its single child and triggers the Skia Circular Reveal transition 
 * before navigating to the target href.
 */
export function CircularRevealWrapper({ 
  href, 
  color = '#4ECDC4', 
  duration,
  children 
}: CircularRevealWrapperProps) {
  const navigateWithReveal = useCircularRevealNavigate();

  // Clone the child to inject our custom onPress handler
  return cloneElement(children, {
    onPress: (e: GestureResponderEvent) => {
      // Trigger the reveal and navigation
      navigateWithReveal(e, href, color, duration);
      
      // If the child had its own onPress, call it as well
      if (children.props.onPress) {
        children.props.onPress(e);
      }
    },
  });
}
