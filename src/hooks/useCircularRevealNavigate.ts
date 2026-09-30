import { useSetAtom } from 'jotai';
import { startTransitionAtom } from '@/src/store/transitionStore';
import { useRouter } from 'expo-router';
import { Dimensions, GestureResponderEvent } from 'react-native';

export const useCircularRevealNavigate = () => {
  const router = useRouter();
  const startTransition = useSetAtom(startTransitionAtom);

  const navigateWithReveal = (
    event?: GestureResponderEvent,
    href?: string,
    color: string = '#4ECDC4', // Default fallback color
    duration?: number
  ) => {
    if (!href) return;

    // ponytail: fallback to screen center if event is missing or SyntheticEvent without nativeEvent
    const { width, height } = Dimensions.get('window');
    const pageX = event?.nativeEvent?.pageX ?? width / 2;
    const pageY = event?.nativeEvent?.pageY ?? height / 2;

    // Trigger the global Jotai state to start the Skia animation
    startTransition({
      cx: pageX,
      cy: pageY,
      color,
      duration,
      onComplete: () => {
        // Animation finished (you can add cleanup here if needed)
      }
    });

    // Fire the router push after exactly half of the duration time
    // This allows the circle to expand enough to cover the screen before the native transition starts
    const transitionDuration = duration || 400; // default to 400 if not provided
    setTimeout(() => {
      router.push(href as any);
    }, transitionDuration / 2);
  };

  return navigateWithReveal;
};
