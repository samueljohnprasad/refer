import React, { useState, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { Timeline } from '@/src/components/ui/Timeline/Timeline';
import { useGetDailyTimelineQuery, useGenerateDailyInsightMutation } from '@/src/store/api/timelineApi';
import { TimelineShimmer } from '../components/TimelineShimmer';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { GenerateInsightCard } from '../components/GenerateInsightCard';
import * as Haptics from 'expo-haptics';
import type { TimelineItemData, TimelineSection } from '@/src/components/ui/Timeline/types';

interface DailyTimelineItem extends TimelineItemData {
  originalDateString: string;
  aiInsight: {
    id?: string;
    user_id?: string;
    reflection_date?: string;
    summary: string;
    personalized_reflection?: any;
    structured_memory?: any;
    confidence?: number;
    created_at?: string;
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  } | null;
}

import { MOCK_DAYS_TIMELINE_DATA } from './mockData';

export interface TimelineTabProps {
  onOpenModal?: () => void;
}

export const DaysTimelineTab = ({ onOpenModal }: TimelineTabProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useGetDailyTimelineQuery({ page, pageSize: 10 });
  const [generateInsight] = useGenerateDailyInsightMutation();
  
  // Track which dates are actively being generated so we can show a Shimmer gracefully
  const [generatingDates, setGeneratingDates] = useState<Set<string>>(new Set());

  const handleGenerate = async (date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Optimistically set loading state for this specific card
    setGeneratingDates(prev => new Set(prev).add(date));
    
    try {
      await generateInsight({ date }).unwrap();
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

  // Use mock data if the API fails for local UI testing
  const displayData = isError || !data?.data ? MOCK_DAYS_TIMELINE_DATA : data.data;

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
      onEndReached={() => {
        // Increment page when reaching bottom for infinite scroll
      }}
    />
  );
};
