import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { Box } from '@/components/ui/box';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';
import { CloudIcon, BrainIcon, LightBulbIcon } from '@/assets/Icons';

interface AnimatedProcessingIndicatorProps {
  message: string;
  timestamp?: string;
  iconType?: 'cloud' | 'brain' | 'lightbulb';
}

const AnimatedProcessingIndicator: React.FC<AnimatedProcessingIndicatorProps> = ({ 
  message, 
  timestamp,
  iconType = 'brain' // Default icon is brain
}) => {
  const activeTheme = useSeasonalTheme();
  
  // Animation values
  const pulseAnim = new Animated.Value(1);
  // Dots handled with simple state cycling instead of Animated interpolation
  const [dotState, setDotState] = useState<string>('');
  const floatAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);
  
  // Start animations when component mounts
  useEffect(() => {
    // Fade in
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Cycle dotState every 500ms to show trailing dots
    const interval = setInterval(() => {
      setDotState((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // dotState already provides the trailing dots string

  const bgColorLight = `${activeTheme.highlight}10`;
  
  return (
    <Animated.View style={[
      styles.container,
      { opacity: opacityAnim }
    ]}>
      {timestamp && (
        <Animated.Text style={[
          styles.timestamp,
          { opacity: 0.7 }
        ]}>
          {timestamp}
        </Animated.Text>
      )}
      
      <Animated.Text style={[
        styles.message,
        { 
          transform: [{ translateY: floatAnim }],
          color: Platform.OS === 'web' ? '#333' : '#333',
        }
      ]}>
        {`${message}${dotState}`}
      </Animated.Text>
      
      <Animated.View style={[
        styles.indicatorContainer,
        {
          transform: [{ scale: pulseAnim }],
        }
      ]}>
        {/* Icon above the pulsing circle */}
        <Animated.View style={[styles.iconContainer]}>
          {iconType === 'cloud' ? (
            <CloudIcon size={28} color={activeTheme.highlight} />
          ) : iconType === 'lightbulb' ? (
            <LightBulbIcon size={28} color={activeTheme.highlight} />
          ) : (
            <BrainIcon size={28} color={activeTheme.highlight} />
          )}
        </Animated.View>
        
        <Box
          className="rounded-full overflow-hidden"
          style={{
            width: 80,
            height: 80,
            backgroundColor: bgColorLight,
          } as any}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.innerCircle,
              {
                backgroundColor: activeTheme.highlight,
                opacity: 0.4,
                transform: [
                  { scale: pulseAnim }
                ],
              }
            ]}
          />
        </Box>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  indicatorContainer: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timestamp: {
    fontSize: 16,
    color: '#9CA3AF', // gray-400
    marginBottom: 48,
    fontWeight: '500',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  message: {
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827', // gray-900
    letterSpacing: -0.5,
    lineHeight: 44,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    maxWidth: '80%',
  },
  innerCircle: {
    borderRadius: 100,
  },
});

export default AnimatedProcessingIndicator;
