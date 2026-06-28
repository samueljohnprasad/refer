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
        // Once the Skia canvas fills the screen, perform the actual navigation
        // Note: Expo Router's push doesn't support disabling animations via options dynamically here, 
        // but because the Skia overlay covers the screen, it masks the native transition!
        router.push(href as any);
      }
    });
  };

  return navigateWithReveal;
};
