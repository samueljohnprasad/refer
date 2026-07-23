import React, { useState, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { Timeline } from '@/src/components/ui/Timeline/Timeline';
import { useDailyTimeline } from '../../data/timeline.queries';
import { useGenerateDailyInsight } from '../../data/timeline.mutations';
import { TimelineShimmer } from '../components/TimelineShimmer';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { GenerateInsightCard } from '../components/GenerateInsightCard';
import * as Haptics from 'expo-haptics';
import { useHeaderHeight } from 'expo-router/react-navigation';
import type { TimelineSection } from '@/src/components/ui/Timeline/types';
import type { DailyTimelineItem, TimelineTabProps } from '../../model/timeline.types';
import { MOCK_DAYS_TIMELINE_DATA } from './mockData';

export const DaysTimelineTab = ({ onOpenModal }: TimelineTabProps) => {
  const headerHeight = useHeaderHeight();
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useDailyTimeline({ pageSize: 10 });
  const { mutateAsync: generateInsight } = useGenerateDailyInsight();
  
  // Track which dates are actively being generated so we can show a Shimmer gracefully
  const [generatingDates, setGeneratingDates] = useState<Set<string>>(new Set());

  const handleGenerate = async (date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Optimistically set loading state for this specific card
    setGeneratingDates(prev => new Set(prev).add(date));
    
    try {
      await generateInsight({ date });
    } catch (e) {
      // Intentionally swallowing error log for production
      Alert.alert("Generation Failed", "Could not generate insight. Please try again later.");
    } finally {
      setGeneratingDates(prev => {
        const next = new Set(prev);
        next.delete(date);
        return next;
      });
    }
  };

  const displayData = data?.pages ? data.pages.flatMap(p => p.data) : [];

  const sections: TimelineSection<DailyTimelineItem>[] = useMemo(() => {
    return displayData.map((item: any) => {
      const ms = new Date(item.date).getTime();
      return {
        title: item.date,
        date: ms,
        data: [{
          id: item.date,
          date: ms,
          status: item.aiInsight ? "completed" : "in_progress",
          originalDateString: item.date,
          aiInsight: item.aiInsight,
        }]
      };
    });
  }, [displayData]);

  const renderTimelineItem = (item: DailyTimelineItem) => {
    const isGenerating = generatingDates.has(item.originalDateString);

    if (isGenerating) {
      return <TimelineShimmer />;
    }
    
    if (item.aiInsight) {
      return <DailyInsightCard insight={item.aiInsight} onPress={onOpenModal} />;
    }
    
    return <GenerateInsightCard onPress={() => handleGenerate(item.originalDateString)} />;
  };

  if (isLoading) {
    return (
      <View className="px-4 py-6" style={{ paddingTop: headerHeight + 16 }}>
        <TimelineShimmer />
      </View>
    );
  }

  return (
    <Timeline
      sections={sections}
      renderItem={renderTimelineItem}
      isLoadingMore={isFetchingNextPage}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    />
  );
};
