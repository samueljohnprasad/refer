import React, { useState, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { Timeline } from '@/src/components/ui/Timeline/Timeline';
import { useGetMonthlyTimelineQuery, useGenerateMonthlyInsightMutation } from '@/src/store/api/timelineApi';
import { TimelineShimmer } from '../components/TimelineShimmer';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { GenerateInsightCard } from '../components/GenerateInsightCard';
import * as Haptics from 'expo-haptics';
import type { TimelineItemData, TimelineSection } from '@/src/components/ui/Timeline/types';

interface MonthlyTimelineItem extends TimelineItemData {
  originalDateString: string;
  aiInsight: {
    id?: string;
    summary: string;
  } | null;
}

const MOCK_TIMELINE_DATA = [
  {
    date: '2026-07',
    aiInsight: {
      id: 'm1',
      summary: "This month marked a significant period of professional transition. Across the past four weeks, your reflections showed a clear trajectory from initial uncertainty toward growing confidence and established routines. The persistent use of morning walks and evening cognitive restructuring exercises appeared to be your most effective tools for maintaining stability during high-stress weeks. Looking forward, maintaining these core routines could provide a solid foundation as you continue settling into your new roles."
    }
  },
  {
    date: '2026-06',
    aiInsight: null
  },
  {
    date: '2026-05',
    aiInsight: {
      id: 'm2',
      summary: "May was defined by preparation and consistency. You maintained a nearly unbroken streak of habit completion, which appeared to correlate with fewer intense emotional spikes. While stress remained present, your coping mechanisms were deployed effectively and proactively rather than reactively."
    }
  },
  {
    date: '2026-04',
    aiInsight: null
  },
  {
    date: '2026-03',
    aiInsight: {
      id: 'm3',
      summary: "March was a challenging month marked by high external stress, particularly regarding financial planning. However, your consistent use of gratitude journaling helped reframe many of the daily anxieties. By the end of the month, you had built a much healthier perspective on what you could actually control."
    }
  },
  {
    date: '2026-02',
    aiInsight: null
  }
];

export interface TimelineTabProps {
  onOpenModal?: () => void;
}

export const MonthsTimelineTab = ({ onOpenModal }: TimelineTabProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useGetMonthlyTimelineQuery({ page, pageSize: 10 });
  const [generateInsight] = useGenerateMonthlyInsightMutation();
  
  const [generatingDates, setGeneratingDates] = useState<Set<string>>(new Set());

  const handleGenerate = async (date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setGeneratingDates(prev => new Set(prev).add(date));
    
    try {
      await generateInsight({ date }).unwrap();
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

  const displayData = isError || !data?.data ? MOCK_TIMELINE_DATA : data.data;

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
      // Reusing DailyInsightCard as the structure is currently identical
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
