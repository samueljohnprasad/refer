import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useToast } from 'heroui-native';
import { showAppToast } from '@/src/lib/showToast';
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
  const { toast } = useToast();
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

  const isTimelineEmpty = displayData.length === 0;
  const actualDataToDisplay = isTimelineEmpty ? MOCK_DAYS_TIMELINE_DATA : displayData;

  const sections: TimelineSection<DailyTimelineItem>[] = useMemo(() => {
    return actualDataToDisplay.map((item: any) => {
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
  }, [actualDataToDisplay]);

  const renderHeader = () => {
    if (!isTimelineEmpty) return null;
    return (
      <View className="px-6 pb-6 pt-2 items-center opacity-80">
        <Text className="text-center text-[15px] leading-6 tracking-[0.2px] text-[#767676]" style={{ fontFamily: APP_FONT_FAMILIES.regular }}>
          <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: '#142414' }}>Sample Data</Text>
          {'\n'}Your insights will look like this once generated.
        </Text>
      </View>
    );
  };

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
      ListHeaderComponent={renderHeader()}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage && !isTimelineEmpty) {
          fetchNextPage();
        }
      }}
    />
  );
};
