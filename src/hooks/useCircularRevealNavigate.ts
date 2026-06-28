import { useSetAtom } from 'jotai';
import { startTransitionAtom } from '@/src/store/transitionStore';
import { useRouter } from 'expo-router';
import { GestureResponderEvent } from 'react-native';

export const useCircularRevealNavigate = () => {
  const router = useRouter();
  const startTransition = useSetAtom(startTransitionAtom);

  const navigateWithReveal = (
    event: GestureResponderEvent,
    href: string,
    color: string = '#4ECDC4', // Default fallback color
    duration?: number
  ) => {
    // Extract the exact X and Y coordinates of the user's tap on the screen
    const { pageX, pageY } = event.nativeEvent;

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
