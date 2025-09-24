import React from 'react';
import { Animated, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/components/Themed';
import { useTodayPillAnimation } from '@/hooks/useTodayPillAnimation';

export interface TodayPillProps {
  visible: boolean;
  label?: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  pointerColor?: string;
  textColor?: string;
  durationMs?: number;
  offsetX?: number;
  scaleFrom?: number;
}

export const TodayPill: React.FC<TodayPillProps> = ({
  visible,
  label = 'Today',
  onPress,
  containerStyle,
  backgroundColor = '#8B5CF6', // purple-500
  pointerColor = '#6D28D9', // darker purple pointer
  textColor = '#ffffff',
  durationMs,
  offsetX,
  scaleFrom,
}) => {
  const { animatedStyle, pointerEvents } = useTodayPillAnimation({
    visible,
    durationMs,
    offsetX,
    scaleFrom,
  });

  return (
    <Animated.View
      style={[styles.pill, { backgroundColor }, containerStyle, animatedStyle]}
      pointerEvents={pointerEvents}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.row}
      >
        <View style={[styles.pointer, { borderRightColor: pointerColor }]} />
        <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    right: 0,
    bottom: -10,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  pointer: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TodayPill;
