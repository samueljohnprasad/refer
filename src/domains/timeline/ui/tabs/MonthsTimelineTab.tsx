import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useToast } from 'heroui-native';
import { showAppToast } from '@/src/lib/showToast';
import { Timeline } from '@/src/components/ui/Timeline/Timeline';
import { useMonthlyTimeline } from '../../data/timeline.queries';
import { useGenerateMonthlyInsight } from '../../data/timeline.mutations';
import { TimelineShimmer } from '../components/TimelineShimmer';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { GenerateInsightCard } from '../components/GenerateInsightCard';
import * as Haptics from 'expo-haptics';
import { useHeaderHeight } from 'expo-router/react-navigation';
import type { TimelineSection } from '@/src/components/ui/Timeline/types';
import type { MonthlyTimelineItem, TimelineTabProps } from '../../model/timeline.types';


export const MonthsTimelineTab = ({ onOpenModal }: TimelineTabProps) => {
  const headerHeight = useHeaderHeight();
  const { toast } = useToast();
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useMonthlyTimeline({ pageSize: 10 });
  const { mutateAsync: generateInsight } = useGenerateMonthlyInsight();
  
  const [generatingDates, setGeneratingDates] = useState<Set<string>>(new Set());

  const handleGenerate = async (date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setGeneratingDates(prev => new Set(prev).add(date));
    
    try {
      const year = parseInt(date.substring(0, 4), 10);
      const month = parseInt(date.substring(5, 7), 10);
      await generateInsight({ month, year });
    } catch (e) {
      showAppToast(toast, {
        variant: 'danger',
        title: 'Generation Failed',
        description: 'Could not generate insight. Please try again later.',
      });
    } finally {
      setGeneratingDates(prev => {
        const next = new Set(prev);
        next.delete(date);
        return next;
      });
    }
  };

  const displayData = data?.pages ? data.pages.flatMap(p => p.data) : [];

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
      mode="months"
      isLoadingMore={isFetchingNextPage}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    />
  );
};
