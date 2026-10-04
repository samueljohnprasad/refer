import React, { useCallback, useMemo, useRef } from "react";
import { View, FlatList, ViewToken, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Animated } from "react-native";
import { addDays } from "date-fns";
import type { MoodsMap } from "@/hooks/data/useFetchMoods";
import ChartPage from "./WeeklyChartPage";
import DailyChartPageWithData from "./DailyChartPageWithData";
import { MoodScale } from "./MoodScale";
import type { TabType } from "./MoodChartTabSelector";
import Loading from "@/src/components/Loading";

type Offset = number;
type Padding = { top: number; bottom: number; left: number; right: number };

interface Props {
  activeTab: TabType;
  weekIndex: number;
  setWeekIndex: (index: number) => void;
  dayIndex: number;
  setDayIndex: (index: number) => void;
  startDate: Date;
  endDate: Date;
  spanDays: number;
  today: Date;
  weeklyData: MoodsMap | undefined;
  isWeeklyLoading: boolean;
  layoutWidth: number;
  onLayout: (event: LayoutChangeEvent) => void;
  height: number;
  padding: Padding;
  locale: string;
}

export default function MoodChartPager({
  activeTab, weekIndex, setWeekIndex, dayIndex, setDayIndex, startDate, endDate,
  spanDays, today, weeklyData, isWeeklyLoading, layoutWidth, onLayout, height, padding, locale,
}: Props) {
  const pageWidth = layoutWidth > 0 ? Math.round(layoutWidth) : 0;
  const weekPages = useMemo(() => Array.from({ length: 53 }, (_, index) => index - 52), []);
  const currentWeekIndex = weekPages.length - 1;
  const dayPages = useMemo(() => Array.from({ length: 31 }, (_, index) => index - 30), []);
  const currentDayIndex = dayPages.length - 1;
  const weekListRef = useRef<FlatList<Offset> | null>(null);
  const dayListRef = useRef<FlatList<Offset> | null>(null);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

  const onWeekItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const item = viewableItems.find((visible) => visible.isViewable);
    if (item) setWeekIndex(typeof item.item === "number" ? item.item : weekPages[item.index ?? currentWeekIndex]);
  }, [currentWeekIndex, setWeekIndex, weekPages]);
  const onDayItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const item = viewableItems.find((visible) => visible.isViewable);
    if (item) setDayIndex(typeof item.item === "number" ? item.item : dayPages[item.index ?? currentDayIndex]);
  }, [currentDayIndex, dayPages, setDayIndex]);
  const getItemLayout = useCallback((_data: ArrayLike<Offset> | null | undefined, index: number) => ({
    length: pageWidth, offset: pageWidth * index, index,
  }), [pageWidth]);
  const endScroll = (ref: React.RefObject<FlatList<Offset> | null>) => (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth <= 0) return;
    ref.current?.scrollToIndex({ index: Math.round(event.nativeEvent.contentOffset.x / pageWidth), animated: false });
  };

  const chart = activeTab === "week" ? (
    <Animated.FlatList
      key="week-list" ref={weekListRef} data={weekPages} horizontal pagingEnabled
      snapToInterval={pageWidth} snapToAlignment="start" disableIntervalMomentum
      scrollEventThrottle={16} initialScrollIndex={currentWeekIndex + weekIndex}
      showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never"
      decelerationRate="fast" nestedScrollEnabled hitSlop={{ left: 124, right: 124 }}
      renderItem={({ item }) => <ChartPage emotionsData={weeklyData}
        startDate={addDays(startDate, item * spanDays)} endDate={addDays(endDate, item * spanDays)}
        width={pageWidth} height={height} padding={padding} isLoading={isWeeklyLoading} locale={locale} />}
      keyExtractor={(item) => `week-${item}`} getItemLayout={getItemLayout}
      onViewableItemsChanged={onWeekItemsChanged} viewabilityConfig={viewabilityConfig}
      onScrollEndDrag={endScroll(weekListRef)} windowSize={5} maxToRenderPerBatch={3}
      directionalLockEnabled removeClippedSubviews={false}
    />
  ) : (
    <Animated.FlatList
      key="day-list" ref={dayListRef} data={dayPages} horizontal pagingEnabled
      snapToInterval={pageWidth} snapToAlignment="start" disableIntervalMomentum
      scrollEventThrottle={16} initialScrollIndex={currentDayIndex + dayIndex}
      showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never"
      decelerationRate="fast" nestedScrollEnabled hitSlop={{ left: 124, right: 124 }}
      renderItem={({ item }) => <DailyChartPageWithData dayOffset={item} baseDate={today}
        width={pageWidth} height={height} padding={padding} locale={locale} />}
      keyExtractor={(item) => `day-${item}`} getItemLayout={getItemLayout}
      onViewableItemsChanged={onDayItemsChanged} viewabilityConfig={viewabilityConfig}
      onScrollEndDrag={endScroll(dayListRef)} windowSize={5} maxToRenderPerBatch={3}
      directionalLockEnabled removeClippedSubviews={false}
    />
  );

  return (
    <View className="overflow-hidden" onLayout={onLayout}>
      {pageWidth === 0 ? (
        <View style={{ height, alignItems: "center", justifyContent: "center" }}>
          <Loading />
        </View>
      ) : chart}
      {layoutWidth > 0 && <MoodScale />}
    </View>
  );
}
