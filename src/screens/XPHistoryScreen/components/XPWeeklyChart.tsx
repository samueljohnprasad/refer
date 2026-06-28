import React, { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { ChartDayData } from '../utils/chartUtils';

type WeekData = ChartDayData[];

interface BarProps {
  maxHeight: number;
  minHeight: number;
  width: number;
  progress: SharedValue<number>;
  letter: string;
}

const Bar: React.FC<BarProps> = ({ maxHeight, minHeight, width, progress, letter }) => {
  const animatedProgress = useDerivedValue(() => withTiming(progress.value), [progress]);

  const rAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(animatedProgress.value, [0, 1], [minHeight, maxHeight]);
    const backgroundColor = interpolateColor(
      animatedProgress.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 1)']
    );

    return { height, backgroundColor };
  }, []);

  return (
    <View>
      <Animated.View
        style={[{ width, borderRadius: 10, borderCurve: 'continuous' }, rAnimatedStyle]}
      />
      <Text style={styles.label}>{letter}</Text>
    </View>
  );
};

const AnimatedWeeklyBar = ({ data, width, height, index, internalPaddingHorizontal, gap }: any) => {
  const barWidth = (width - internalPaddingHorizontal * 2 - gap * 6) / 7;
  const letter = useMemo(() => data.value[index]?.day || '', [data, index]);
  const progress = useDerivedValue(() => data.value[index]?.value || 0, [data, index]);

  return (
    <Bar
      key={index}
      letter={letter}
      maxHeight={height}
      minHeight={height / 5}
      width={barWidth}
      progress={progress}
    />
  );
};

const WeeklyChart: React.FC<{ width: number; height: number; data: SharedValue<WeekData> }> = ({ width, height, data }) => {
  const internalPaddingHorizontal = 32;
  const gap = 12;
  const initialData = useMemo(() => data.value || [], [data]);

  return (
    <View style={{ width, height, paddingHorizontal: internalPaddingHorizontal, gap, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
      {initialData.map((_, index) => (
        <AnimatedWeeklyBar
          key={index}
          data={data}
          width={width}
          height={height}
          index={index}
          internalPaddingHorizontal={internalPaddingHorizontal}
          gap={gap}
        />
      ))}
    </View>
  );
};

export const XPWeeklyChart = ({ weeklyData, weekLabels }: { weeklyData: ChartDayData[][]; weekLabels: string[] }) => {
  const { width: windowWidth } = useWindowDimensions();
  const animatedRef = useAnimatedRef<any>();
  const scrollOffset = useScrollViewOffset(animatedRef);
  
  const activeIndex = useDerivedValue(() => {
    return Math.max(0, Math.min(weeklyData.length - 1, Math.floor((scrollOffset.value + windowWidth / 2) / windowWidth)));
  }, [scrollOffset, weeklyData.length]);

  const animatedData = useDerivedValue(() => {
    return weeklyData[activeIndex.value] || [];
  }, [activeIndex, weeklyData]);

  if (!weeklyData || weeklyData.length === 0) return null;

  return (
    <View style={styles.container}>
      <WeeklyChart width={windowWidth} height={150} data={animatedData} />
      <View style={{ height: 60, width: windowWidth }}>
        <Animated.FlatList
          ref={animatedRef}
          horizontal
          pagingEnabled
          snapToInterval={windowWidth}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          decelerationRate="fast"
          data={weeklyData}
          keyExtractor={(_, index) => index.toString()}
          initialScrollIndex={weeklyData.length > 0 ? weeklyData.length - 1 : 0} 
          getItemLayout={(_, index) => ({ length: windowWidth, offset: windowWidth * index, index })}
          renderItem={({ index }) => (
            <View style={[{ width: windowWidth }, styles.labelContainer]}>
              <Text style={styles.weekLabel}>{weekLabels[index]}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingTop: 16,
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekLabel: {
    color: '#8E8E93', 
    fontFamily: 'happy-font-body-medium',
    fontSize: 14,
  },
  label: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'happy-font-body-medium',
    fontSize: 12,
  },
});
