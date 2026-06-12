import {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  SharedValue,
} from "react-native-reanimated";

export function useScrollVelocityTracker() {
  const scrollVelocity = useSharedValue(0);
  const lastOffset = useSharedValue(0);
  const lastTime = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentOffset = event.contentOffset.y;
      // Use event.contentSize for bounds checking to prevent weird bounces
      
      // We can use a simple delta calculation since _WORKLET has Date.now()
      const currentTime = Date.now();
      const deltaY = currentOffset - lastOffset.value;
      const deltaTime = currentTime - lastTime.value;
      
      if (deltaTime > 0 && deltaTime < 50) {
        // Raw velocity in pixels per ms
        const rawVelocity = deltaY / deltaTime; 
        
        // We use a looser spring here so it feels slightly fluid and decoupled from rigid scrolling
        scrollVelocity.value = withSpring(rawVelocity * 10, { damping: 20, stiffness: 100, overshootClamping: true });
      }
      
      lastOffset.value = currentOffset;
      lastTime.value = currentTime;
    },
    onMomentumEnd: () => {
      // Slosh back into place when scrolling fully stops
      scrollVelocity.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
    },
    onEndDrag: (event) => {
      // If user lifts finger without flicking
      if (Math.abs(event.velocity?.y || 0) < 0.1) {
         scrollVelocity.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
      }
    }
  });

  return { scrollHandler, scrollVelocity };
}

/**
 * Consumes the scroll velocity and applies a subtle Y-axis physical "slosh" or inertia.
 * 
 * @param scrollVelocity The shared value returned from useScrollVelocityTracker
 * @param intensity Multiplier for how heavily the element responds to the velocity (default: 1.0)
 * @param maxShift Maximum pixel shift in any direction (default: 4)
 */
export function useScrollMomentumStyle(
  scrollVelocity: SharedValue<number>,
  intensity: number = 1.0,
  maxShift: number = 4
) {
  return useAnimatedStyle(() => {
    // If we are scrolling down, velocity is positive. The element should lag behind (shift up, negative translateY)
    let shift = scrollVelocity.value * -0.5 * intensity;
    
    // Clamp the shift so it remains ultra-subtle and doesn't break layout
    shift = Math.max(-maxShift, Math.min(maxShift, shift));
    
    return {
      transform: [{ translateY: shift }],
    };
  });
}
