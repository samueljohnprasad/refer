import React, { useState, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { Timeline } from '@/src/components/ui/Timeline/Timeline';
import { useWeeklyTimeline } from '../../data/timeline.queries';
import { useGenerateWeeklyInsight } from '../../data/timeline.mutations';
import { TimelineShimmer } from '../components/TimelineShimmer';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { GenerateInsightCard } from '../components/GenerateInsightCard';
import * as Haptics from 'expo-haptics';
import { useHeaderHeight } from 'expo-router/react-navigation';
import type { TimelineSection } from '@/src/components/ui/Timeline/types';
import type { WeeklyTimelineItem, TimelineTabProps } from '../../model/timeline.types';
import { MOCK_WEEKS_TIMELINE_DATA } from './mockData';

export const WeeksTimelineTab = ({ onOpenModal }: TimelineTabProps) => {
  const headerHeight = useHeaderHeight();
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useWeeklyTimeline({ pageSize: 10 });
  const { mutateAsync: generateInsight } = useGenerateWeeklyInsight();
  
  const [generatingDates, setGeneratingDates] = useState<Set<string>>(new Set());

  const handleGenerate = async (date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setGeneratingDates(prev => new Set(prev).add(date));
    
    try {
      const year = parseInt(date.substring(0, 4), 10);
      const week_index = parseInt(date.substring(6), 10);
      await generateInsight({ week_index, year });
    } catch (e) {
      Alert.alert("Generation Failed", "Could not generate insight. Please try again later.");
    } finally {
      setGeneratingDates(prev => {
        const next = new Set(prev);
        next.delete(date);
        return next;
      });
    }
  };

  const displayData = data?.pages ? data.pages.flatMap(p => p.data) : (isError ? MOCK_WEEKS_TIMELINE_DATA : []);

  const sections: TimelineSection<WeeklyTimelineItem>[] = useMemo(() => {
    return displayData.map((item: any) => {
      const year = parseInt(item.date.substring(0, 4));
      const week = parseInt(item.date.substring(6));
      const ms = new Date(year, 0, 1 + (week - 1) * 7).getTime();
      
      let title = `W${week} ${year}`;
      if (item.start_date && item.end_date) {
        const sDate = new Date(item.start_date);
        const eDate = new Date(item.end_date);
        const sMonth = sDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const eMonth = eDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const sDay = sDate.getDate();
        const eDay = eDate.getDate();
        
        if (sMonth === eMonth) {
          title = `${sMonth} ${sDay}-${eDay}, ${year}`;
        } else {
          title = `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${year}`;
        }
      }
      
      return {
        title,
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

  const renderTimelineItem = (item: WeeklyTimelineItem) => {
    const isGenerating = generatingDates.has(item.originalDateString);

    if (isGenerating) {
      return <TimelineShimmer />;
    }
    
    if (item.aiInsight) {
      return <DailyInsightCard insight={item.aiInsight} onPress={onOpenModal} />;
    }
    
    return (
      <GenerateInsightCard 
        title="Generate Weekly Insight" 
        subtitle="Tap to reflect on this week" 
        onPress={() => handleGenerate(item.originalDateString)} 
      />
    );
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
      mode="weeks"
      isLoadingMore={isFetchingNextPage}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    />
  );
};
