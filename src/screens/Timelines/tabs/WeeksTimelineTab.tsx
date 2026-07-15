import React, { useState, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { Timeline } from '@/src/components/ui/Timeline/Timeline';
import { useGetWeeklyTimelineQuery, useGenerateWeeklyInsightMutation } from '@/src/store/api/timelineApi';
import { TimelineShimmer } from '../components/TimelineShimmer';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { GenerateInsightCard } from '../components/GenerateInsightCard';
import * as Haptics from 'expo-haptics';
import type { TimelineItemData, TimelineSection } from '@/src/components/ui/Timeline/types';

interface WeeklyTimelineItem extends TimelineItemData {
  originalDateString: string;
  aiInsight: {
    id?: string;
    summary: string;
  } | null;
}

const MOCK_TIMELINE_DATA = [
  {
    date: '2026-W28',
    start_date: '2026-07-06',
    end_date: '2026-07-12',
    aiInsight: {
      id: 'w1',
      summary: "This week was largely defined by adapting to a new chapter in your professional life. Early in the week, much of your attention was directed toward uncertainty and learning a new environment. As the week progressed, positive workplace feedback, consistent morning walks, and CBT exercises appeared to support greater confidence and emotional stability. By the end of the week, spending time with family brought an additional sense of balance."
    }
  },
  {
    date: '2026-W27',
    start_date: '2026-06-29',
    end_date: '2026-07-05',
    aiInsight: null
  },
  {
    date: '2026-W26',
    start_date: '2026-06-22',
    end_date: '2026-06-28',
    aiInsight: {
      id: 'w2',
      summary: "Last week centered heavily around preparation and closing out old commitments. You consistently logged meals and maintained a high level of physical activity, which seemed to buffer against the stress of wrapping up ongoing projects. Weekends provided much-needed unstructured rest, emphasizing the importance of disconnecting completely before a new week begins."
    }
  },
  {
    date: '2026-W25',
    start_date: '2026-06-15',
    end_date: '2026-06-21',
    aiInsight: null
  },
  {
    date: '2026-W24',
    start_date: '2026-06-08',
    end_date: '2026-06-14',
    aiInsight: {
      id: 'w3',
      summary: "This week showed a clear pattern of high productivity early on followed by creative burnout by Thursday. Recognizing this cycle, you successfully leaned into your coping strategy of weekend nature walks, which effectively reset your mental state. Moving forward, pacing yourself earlier in the week might prevent this mid-week crash."
    }
  },
  {
    date: '2026-W23',
    start_date: '2026-06-01',
    end_date: '2026-06-07',
    aiInsight: null
  }
];

export const WeeksTimelineTab = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useGetWeeklyTimelineQuery({ page, pageSize: 10 });
  const [generateInsight] = useGenerateWeeklyInsightMutation();
  
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

  const sections: TimelineSection<WeeklyTimelineItem>[] = useMemo(() => {
    return displayData.map((item: any) => {
      const year = parseInt(item.date.substring(0, 4));
      const week = parseInt(item.date.substring(6));
      const ms = new Date(year, 0, 1 + (week - 1) * 7).getTime();
      
      let title = `W${week} ${year}`;
      if (item.start_date && item.end_date) {
        // e.g., start_date: '2026-07-06', end_date: '2026-07-12'
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
      // Reusing DailyInsightCard as the structure is currently identical
      return <DailyInsightCard insight={item.aiInsight} />;
    }
    
    return (
      <GenerateInsightCard 
        title="Generate Weekly Insight" 
        subtitle="Tap to reflect on this week" 
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
      mode="weeks"
      onEndReached={() => {}}
    />
  );
};
