import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface UseModalAnimationProps {
  isVisible: boolean;
  onCloseComplete?: () => void;
}

interface ModalAnimationValues {
  blurAnim: Animated.Value;
  fadeAnim: Animated.Value;
  contentBlurAnim: Animated.Value;
}

interface UseModalAnimationReturn {
  animationValues: ModalAnimationValues;
  closeModal: () => void;
}

export const useModalAnimation = ({
  isVisible,
  onCloseComplete,
}: UseModalAnimationProps): UseModalAnimationReturn => {
  const blurAnim = useRef(new Animated.Value(0));
  const fadeAnim = useRef(new Animated.Value(0));
  const contentBlurAnim = useRef(new Animated.Value(0));

  const animationConfig = {
    duration: 300,
    easing: Easing.out(Easing.ease),
  };

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(blurAnim.current, {
          toValue: 30,
          ...animationConfig,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim.current, {
          toValue: 1,
          ...animationConfig,
          useNativeDriver: true,
        }),
        Animated.timing(contentBlurAnim.current, {
          toValue: 10,
          ...animationConfig,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isVisible]);

  const closeModal = (): void => {
    Animated.parallel([
      Animated.timing(blurAnim.current, {
        toValue: 0,
        ...animationConfig,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim.current, {
        toValue: 0,
        ...animationConfig,
        useNativeDriver: true,
      }),
      Animated.timing(contentBlurAnim.current, {
        toValue: 0,
        ...animationConfig,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (onCloseComplete) {
        onCloseComplete();
      }
    });
  };

  return {
    animationValues: {
      blurAnim: blurAnim.current,
      fadeAnim: fadeAnim.current,
      contentBlurAnim: contentBlurAnim.current,
    },
    closeModal,
  };
};
