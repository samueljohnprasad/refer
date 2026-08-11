import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  interpolateColor,
  useReducedMotion,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Rive, { AutoBind } from 'rive-react-native';
import { Button } from '@/src/components/ui/Button';
import { AnimatedFireIcon, GrayFireIcon } from '@/src/components/ui/AnimatedStatIcon';
import { useStreak } from '@/src/hooks/useStreak';
import { SAGE } from '@/lib/tokens';

// --- DESIGN TOKENS ---
const COLORS = {
  canvas: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSoft: '#F7F7F7',
  ink: '#142414',
  inkSoft: '#6B6B6B',
  inkMuted: '#AFAFAF',
  sageSelected: '#F2F8EF',
  sage500: '#5F7F58',
  sage600: '#44633F',
  sage700: '#29452A',
  beeYellow: '#FFD900',
  beeYellowTint: '#FFF5D6',
  parrotOrange: '#FF9600',
  border: '#E5E5E5',
  borderStrong: '#999999',
};

const TYPOGRAPHY = {
  number: {
    fontFamily: 'CormorantSemiBold',
    fontSize: 64,
    lineHeight: 68,
    color: COLORS.ink,
  },
  dayStreak: {
    fontFamily: 'GeistSemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: COLORS.ink,
  },
  weekLabel: {
    fontFamily: 'GeistSemiBold',
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.inkSoft,
  },
  supporting: {
    fontFamily: 'GeistRegular',
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.inkSoft,
  },
  cta: {
    fontFamily: 'GeistSemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.canvas,
  },
  close: {
    fontFamily: 'GeistMedium',
    fontSize: 15,
    color: COLORS.inkSoft,
  }
};

const SIZES = {
  screenPadding: 24,
  contentMaxWidth: 340,
  flameWidth: 220,
  flameHeight: 260,
  flameContainerWidth: 240,
  flameContainerHeight: 280,
  dayMarker: 28,
  ctaHeight: 52,
  ctaRadius: 16,
};

const SPACING = {
  flameToNumber: 6,
  numberToLabel: 2,
  labelToWeek: 28,
  weekToMessage: 28,
  messageToCTA: 28,
  ctaToClose: 16,
};

const MOTION = {
  anticipation: 180,
  ignitionStart: 180,
  ignitionDuration: 130,
  peakStart: 310,
  peakDuration: 100,
  recoilStart: 410,
  recoilDuration: 130,
  numberExitStart: 250,
  numberEnterStart: 330,
  labelStart: 420,
  dayActivationStart: 600,
  messageStart: 700,
  ctaStart: 820,
  settled: 1050,
};

const SPRINGS = {
  flame: { mass: 0.7, stiffness: 280, damping: 18 },
  number: { mass: 0.55, stiffness: 330, damping: 19 },
  dayIndicator: { mass: 0.5, stiffness: 360, damping: 18 },
};

// --- COMPONENTS ---

function HeroFlame({ streak, startAnim, reducedMotion }: { streak: number, startAnim: boolean, reducedMotion: boolean | null }) {
  const scale = useSharedValue(reducedMotion ? 0.95 : 0.72);
  const translateY = useSharedValue(reducedMotion ? 0 : 7);
  const rotateZ = useSharedValue(reducedMotion ? 0 : -2);
  const opacity = useSharedValue(reducedMotion ? 0 : 0.68);
  const colorProgress = useSharedValue(0);
  
  const pulseScale = useSharedValue(0.75);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (startAnim) {
      if (reducedMotion) {
        opacity.value = withTiming(1, { duration: 250 });
        scale.value = withTiming(1, { duration: 250 });
        colorProgress.value = withTiming(1, { duration: 250 });
      } else {
        opacity.value = withDelay(MOTION.ignitionStart, withTiming(1, { duration: MOTION.ignitionDuration }));
        colorProgress.value = withDelay(MOTION.ignitionStart, withTiming(1, { duration: MOTION.ignitionDuration }));
        
        scale.value = withSequence(
          withDelay(MOTION.ignitionStart, withTiming(1.18, { duration: MOTION.ignitionDuration, easing: Easing.out(Easing.cubic) })),
          withTiming(1.27, { duration: MOTION.peakDuration, easing: Easing.linear }),
          withTiming(0.94, { duration: MOTION.recoilDuration, easing: Easing.linear }),
          withSpring(1, SPRINGS.flame)
        );

        translateY.value = withSequence(
          withDelay(MOTION.ignitionStart, withTiming(-7, { duration: MOTION.ignitionDuration, easing: Easing.out(Easing.cubic) })),
          withTiming(-10, { duration: MOTION.peakDuration, easing: Easing.linear }),
          withTiming(3, { duration: MOTION.recoilDuration, easing: Easing.linear }),
          withSpring(0, SPRINGS.flame)
        );

        rotateZ.value = withSequence(
          withDelay(MOTION.ignitionStart, withTiming(2, { duration: MOTION.ignitionDuration, easing: Easing.out(Easing.cubic) })),
          withTiming(-1, { duration: MOTION.peakDuration, easing: Easing.linear }),
          withTiming(1, { duration: MOTION.recoilDuration, easing: Easing.linear }),
          withSpring(0, SPRINGS.flame)
        );
        
        // Impact pulse behind flame
        pulseOpacity.value = withSequence(
          withDelay(270, withTiming(0.12, { duration: 50 })),
          withTiming(0, { duration: 300 })
        );
        pulseScale.value = withSequence(
          withDelay(270, withTiming(0.8, { duration: 50 })),
          withTiming(1.65, { duration: 300, easing: Easing.out(Easing.ease) })
        );
      }
    }
  }, [startAnim, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotateZ.value}deg` }
    ]
  }));
  
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }]
  }));

  const riveRef = React.useRef<any>(null);

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout, t3: NodeJS.Timeout;
    let isMounted = true;
    
    if (riveRef.current) {
      const updateRive = () => {
        if (!isMounted) return;
        try {
          riveRef.current?.setNumber('streak', streak);
        } catch (e) {}
      };
      
      updateRive();
      t1 = setTimeout(updateRive, 50);
      t2 = setTimeout(updateRive, 150);
      t3 = setTimeout(updateRive, 300);
    }
    
    return () => {
      isMounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [streak]);

  return (
    <View style={styles.flameWrapper}>
      <Animated.View style={[styles.pulse, pulseStyle]} />
      <Animated.View style={[style, { width: SIZES.flameWidth, height: SIZES.flameHeight }]}>
        <Rive
          ref={riveRef}
          source={require('../../../assets/lottie/dynamic-streak-fire.riv')}
          style={{ width: '100%', height: '100%' }}
          autoplay={true}
          stateMachineName="State Machine 1"
          dataBinding={AutoBind(true)}
          onError={(error) => {
            console.log('Rive error caught gracefully:', error);
          }}
          onPlay={() => {
            try {
              riveRef.current?.setNumber('streak', streak);
            } catch (e) {}
          }}
        />
      </Animated.View>
    </View>
  );
}


function DayStreakLabel({ startAnim, reducedMotion }: { startAnim: boolean, reducedMotion: boolean | null }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(reducedMotion ? 0 : 7);

  useEffect(() => {
    if (startAnim) {
      if (reducedMotion) {
        opacity.value = withDelay(MOTION.labelStart, withTiming(1, { duration: 250 }));
      } else {
        opacity.value = withDelay(MOTION.labelStart, withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }));
        translateY.value = withDelay(MOTION.labelStart, withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) }));
      }
    }
  }, [startAnim, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text style={[styles.dayStreakLabel, style]}>
      Day Streak
    </Animated.Text>
  );
}

function WeekStreakRow({ startAnim, reducedMotion }: { startAnim: boolean, reducedMotion: boolean | null }) {
  const { weeklyProgress } = useStreak();
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  
  const mostRecentCompletedIndex = [...weeklyProgress.days].findLastIndex(Boolean);

  return (
    <View style={styles.weekRow}>
      {weeklyProgress.days.map((isCompleted, idx) => {
        const isToday = idx === mostRecentCompletedIndex;
        
        return (
          <DayIndicator 
            key={idx} 
            day={labels[idx]} 
            isToday={isToday} 
            isCompleted={isCompleted}
            startAnim={startAnim} 
            reducedMotion={reducedMotion} 
          />
        );
      })}
    </View>
  );
}

function DayIndicator({ day, isToday, isCompleted, startAnim, reducedMotion }: { day: string, isToday: boolean, isCompleted: boolean, startAnim: boolean, reducedMotion: boolean | null }) {
  const scale = useSharedValue(1);
  
  useEffect(() => {
    if (startAnim && isToday) {
      if (reducedMotion) {
        scale.value = withDelay(MOTION.dayActivationStart, withTiming(1.05, { duration: 180 }));
      } else {
        scale.value = withSequence(
          withDelay(MOTION.dayActivationStart, withTiming(0.84, { duration: 70 })),
          withSpring(1, SPRINGS.dayIndicator)
        );
      }
    }
  }, [startAnim, isToday, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <View style={styles.dayCol}>
      <Text style={styles.dayLabel}>{day}</Text>
      <Animated.View style={[styles.dayMarker, style]}>
        {isCompleted || isToday ? (
          <AnimatedFireIcon width={28} height={28} />
        ) : (
          <GrayFireIcon width={28} height={28} />
        )}
      </Animated.View>
    </View>
  );
}

function SupportingMessage({ startAnim, reducedMotion }: { startAnim: boolean, reducedMotion: boolean | null }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(reducedMotion ? 0 : 8);

  useEffect(() => {
    if (startAnim) {
      if (reducedMotion) {
        opacity.value = withDelay(MOTION.messageStart, withTiming(1, { duration: 250 }));
      } else {
        opacity.value = withDelay(MOTION.messageStart, withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) }));
        translateY.value = withDelay(MOTION.messageStart, withTiming(0, { duration: 260, easing: Easing.out(Easing.cubic) }));
      }
    }
  }, [startAnim, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text style={[styles.supportingMessage, style]}>
      A new streak begins! Keep showing up each day to build your progress.
    </Animated.Text>
  );
}

function PrimaryCTA({ onPress, startAnim, reducedMotion }: { onPress: () => void, startAnim: boolean, reducedMotion: boolean | null }) {
  const translateY = useSharedValue(reducedMotion ? 0 : 20);
  const opacity = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (startAnim) {
      if (reducedMotion) {
        opacity.value = withTiming(1, { duration: 200 });
      } else {
        translateY.value = withDelay(MOTION.ctaStart, withSpring(0, { mass: 0.6, stiffness: 280, damping: 20 }));
        opacity.value = withDelay(MOTION.ctaStart, withTiming(1, { duration: 250 }));
      }
    }
  }, [startAnim, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    width: '100%',
  }));

  return (
    <Animated.View style={style}>
      <Button label="Continue" variant="primary" size="lg" onPress={onPress} />
    </Animated.View>
  );
}


// --- MAIN EXPORT ---

export function StreakCelebration({ 
  previousStreak, 
  streak, 
  onClose 
}: { 
  previousStreak: number, 
  streak: number,
  onClose?: () => void
}) {
  const reducedMotion = useReducedMotion();
  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setStartAnim(true);
    }, 50);

    const hapticTimer = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 50 + 340); 

    return () => {
      clearTimeout(t);
      clearTimeout(hapticTimer);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        
        <HeroFlame streak={streak} startAnim={startAnim} reducedMotion={reducedMotion} />

        <View style={styles.spacerLabel}>
          <DayStreakLabel startAnim={startAnim} reducedMotion={reducedMotion} />
        </View>

        <View style={styles.spacerWeek}>
          <WeekStreakRow startAnim={startAnim} reducedMotion={reducedMotion} />
        </View>

        <View style={styles.spacerMessage}>
          <SupportingMessage startAnim={startAnim} reducedMotion={reducedMotion} />
        </View>

        <View style={styles.spacerCTA}>
          <PrimaryCTA onPress={() => onClose && onClose()} startAnim={startAnim} reducedMotion={reducedMotion} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.screenPadding,
  },
  content: {
    width: '100%',
    maxWidth: SIZES.contentMaxWidth,
    alignItems: 'center',
  },
  
  // Flame
  flameWrapper: {
    width: SIZES.flameContainerWidth,
    height: SIZES.flameContainerHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.beeYellow,
  },


  // Label
  spacerLabel: {
    marginTop: SPACING.numberToLabel,
  },
  dayStreakLabel: {
    ...TYPOGRAPHY.dayStreak,
    textAlign: 'center',
  },

  // Week Row
  spacerWeek: {
    marginTop: SPACING.labelToWeek,
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  dayCol: {
    alignItems: 'center',
    width: 36,
  },
  dayLabel: {
    ...TYPOGRAPHY.weekLabel,
    marginBottom: 6,
  },
  dayMarker: {
    width: SIZES.dayMarker,
    height: SIZES.dayMarker,
    borderRadius: SIZES.dayMarker / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Message
  spacerMessage: {
    marginTop: SPACING.weekToMessage,
    width: '100%',
  },
  supportingMessage: {
    ...TYPOGRAPHY.supporting,
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 320,
  },

  // CTA
  spacerCTA: {
    marginTop: SPACING.messageToCTA,
    width: '100%',
  },

});
