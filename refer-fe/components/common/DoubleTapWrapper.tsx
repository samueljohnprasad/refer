import React, { useRef, useState, useEffect } from 'react';
import { TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface DoubleTapWrapperProps {
  onDoubleTap: () => void;
  children: React.ReactNode;
  doubleTapDelay?: number;
  style?: ViewStyle;
  feedbackEnabled?: boolean;
  onSingleTap?: () => void;
}

const DoubleTapWrapper: React.FC<DoubleTapWrapperProps> = ({
  onDoubleTap,
  onSingleTap,
  children,
  doubleTapDelay = 300,
  style,
  feedbackEnabled = true,
}) => {
  const lastTap = useRef<number | null>(null);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  
  // Animation values
  const feedbackScale = useSharedValue(0);
  const feedbackOpacity = useSharedValue(0);

  // Handle the tap feedback animation
  useEffect(() => {
    if (showFeedback && feedbackEnabled) {
      // Start feedback animation
      feedbackScale.value = 0;
      feedbackOpacity.value = 0;
      
      // Quick pop animation
      feedbackScale.value = withSequence(
        withTiming(1.5, { duration: 200, easing: Easing.out(Easing.quad) }),
        withTiming(1.2, { duration: 100 }),
        withDelay(
          400,
          withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
        )
      );
      
      // Fade in and out
      feedbackOpacity.value = withSequence(
        withTiming(0.6, { duration: 200 }),
        withDelay(400, withTiming(0, { duration: 300 }))
      );
      
      // Hide feedback after animation completes
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showFeedback, feedbackEnabled]);

  const handleTap = () => {
    const now = Date.now();
    
    if (lastTap.current && now - lastTap.current < doubleTapDelay) {
      // It's a double tap
      if (singleTapTimer.current) {
        clearTimeout(singleTapTimer.current);
        singleTapTimer.current = null;
      }
      
      lastTap.current = null;
      setShowFeedback(true);
      onDoubleTap();
    } else {
      // It might be a single tap or the first tap of a double tap
      lastTap.current = now;
      
      if (onSingleTap) {
        // Set a timer to trigger single tap if no second tap happens
        singleTapTimer.current = setTimeout(() => {
          onSingleTap();
          singleTapTimer.current = null;
        }, doubleTapDelay) as ReturnType<typeof setTimeout>;
      }
    }
  };

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackScale.value }],
    opacity: feedbackOpacity.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={[{ position: 'relative' }, style]}>
        {children}
        
        {feedbackEnabled && (
          <Reanimated.View 
            style={[
              {
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 8,
                backgroundColor: 'white',
                zIndex: 100,
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              },
              feedbackAnimatedStyle
            ]}
          >
            <Reanimated.View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Reanimated.Text
                style={{
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                ♥
              </Reanimated.Text>
            </Reanimated.View>
          </Reanimated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DoubleTapWrapper;
