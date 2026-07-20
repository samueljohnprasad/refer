import React, { useState, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { Timeline } from '@/src/components/ui/Timeline/Timeline';
import { useMonthlyTimeline } from '../../data/timeline.queries';
import { useGenerateMonthlyInsight } from '../../data/timeline.mutations';
import { TimelineShimmer } from '../components/TimelineShimmer';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { GenerateInsightCard } from '../components/GenerateInsightCard';
import * as Haptics from 'expo-haptics';
import type { TimelineSection } from '@/src/components/ui/Timeline/types';
import type { MonthlyTimelineItem, TimelineTabProps } from '../../model/timeline.types';
import { MOCK_MONTHS_TIMELINE_DATA } from './mockData';

export const MonthsTimelineTab = ({ onOpenModal }: TimelineTabProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMonthlyTimeline({ page, pageSize: 10 });
  const { mutateAsync: generateInsight } = useGenerateMonthlyInsight();
  
  const [generatingDates, setGeneratingDates] = useState<Set<string>>(new Set());

  const handleGenerate = async (date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setGeneratingDates(prev => new Set(prev).add(date));
    
    try {
      await generateInsight({ date });
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

  const displayData = isError || !data?.data ? MOCK_MONTHS_TIMELINE_DATA : data.data;

  const sections: TimelineSection<MonthlyTimelineItem>[] = useMemo(() => {
    return displayData.map((item: any) => {
      const year = parseInt(item.date.substring(0, 4));
      const month = parseInt(item.date.substring(5, 7));
      const ms = new Date(year, month - 1, 1).getTime();
      
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      return {
        title: `${monthNames[month - 1]} ${year}`,
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

  const renderTimelineItem = (item: MonthlyTimelineItem) => {
    const isGenerating = generatingDates.has(item.originalDateString);

    if (isGenerating) {
      return <TimelineShimmer />;
    }
    
    if (item.aiInsight) {
      return <DailyInsightCard insight={item.aiInsight} onPress={onOpenModal} />;
    }
    
    return (
      <GenerateInsightCard 
        title="Generate Monthly Insight" 
        subtitle="Tap to reflect on this month" 
        onPress={() => handleGenerate(item.originalDateString)} 
      />
    );
  };

  if (isLoading && page === 1) {
    return (
      <View className="px-4 py-6">
        <TimelineShimmer />
      </View>
    );
  }

  return (
    <Timeline
      sections={sections}
      renderItem={renderTimelineItem}
      mode="months"
      onEndReached={() => {}}
    />
  );
};
