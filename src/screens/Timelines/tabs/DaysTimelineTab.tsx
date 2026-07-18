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

const MOCK_TIMELINE_DATA = [
  {
    date: new Date().toISOString().split('T')[0],
    aiInsight: {
      id: 'd9b2d63d-4c32-4d1e-a4b5-9f5a7e2b3c4d',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      reflection_date: new Date().toISOString().split('T')[0],
      summary: "Compared to the more relaxed pace of recent days, today was highly productive, as you sustained deep focus on new projects. Although the workload was demanding, pushing through it brought a strong sense of satisfaction and demonstrated your growing capability to handle complex tasks.",
      personalized_reflection: { tone: "encouraging", focus_areas: ["productivity", "focus"] },
      structured_memory: {
        themes: ["deep work", "projects"],
        emotions: ["focused", "satisfied"],
        stressors: [],
        positive_topics: ["new projects"],
        coping_strategies: [],
        recurring_patterns: ["productive mornings"],
        notable_events: ["significant project progress"],
        observations: ["Sustained focus on core tasks"],
        emotional_arc: "steady focus leading to satisfaction"
      },
      confidence: 0.92,
      created_at: new Date().toISOString(),
      input_tokens: 450,
      output_tokens: 120,
      total_tokens: 570
    }
  },
  {
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    aiInsight: null // Shows the "Generate AI Insight" button
  },
  {
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    aiInsight: {
      id: 'f1e2d3c4-b5a6-9f8e-7d6c-5b4a3f2e1d0c',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      reflection_date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      summary: "Unlike yesterday's demanding workload, today shifted your attention entirely toward personal connection and recovery. Spending quality time with good friends, followed by evening reading, helped you completely unwind and highlighted the importance of balancing your routine with meaningful downtime.",
      personalized_reflection: { tone: "calm", focus_areas: ["social", "relaxation"] },
      structured_memory: {
        themes: ["friendship", "relaxation", "reading"],
        emotions: ["peaceful", "happy", "relaxed"],
        stressors: [],
        positive_topics: ["good friends", "light reading"],
        coping_strategies: ["socializing", "reading"],
        recurring_patterns: ["evening relaxation"],
        notable_events: ["met with friends"],
        observations: ["Prioritized downtime and social connection"],
        emotional_arc: "consistently calm and joyful"
      },
      confidence: 0.88,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      input_tokens: 300,
      output_tokens: 95,
      total_tokens: 395
    }
  },
  {
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    aiInsight: {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      reflection_date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      summary: "Following a few days of high energy, this was a much more challenging day where you felt overwhelmed by competing tasks. However, by intentionally prioritizing your workload and logging your meals, you managed to get through the most critical items, proving that your coping strategies can carry you through stressful peaks.",
      personalized_reflection: { tone: "empathetic", focus_areas: ["stress management", "resilience"] },
      structured_memory: {
        themes: ["workload", "resilience", "stress"],
        emotions: ["overwhelmed", "relieved"],
        stressors: ["too many tasks"],
        positive_topics: ["completed critical tasks"],
        coping_strategies: ["prioritization"],
        recurring_patterns: ["mid-week stress peak"],
        notable_events: [],
        observations: ["Successfully pushed through overwhelming task load"],
        emotional_arc: "started stressed and overwhelmed, ended with relief"
      },
      confidence: 0.85,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      input_tokens: 420,
      output_tokens: 110,
      total_tokens: 530
    }
  },
  {
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    aiInsight: null
  },
  {
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    aiInsight: {
      id: 'b5a69f8e-7d6c-5b4a-3f2e-1d0cf1e2d3c4',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      reflection_date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
      summary: "Building on yesterday's mental clarity, you displayed remarkable energy and motivation today by kickstarting a new workout routine and maintaining healthy eating habits. Taking these deliberate steps to care for your physical health elevated your mood and kept your momentum high throughout the entire day.",
      personalized_reflection: { tone: "energetic", focus_areas: ["health", "motivation"] },
      structured_memory: {
        themes: ["health", "fitness", "motivation"],
        emotions: ["energetic", "motivated", "healthy"],
        stressors: [],
        positive_topics: ["new workout routine", "healthy eating"],
        coping_strategies: ["exercise", "diet"],
        recurring_patterns: ["bursts of motivation"],
        notable_events: ["started new workout routine"],
        observations: ["High physical activity and good dietary choices"],
        emotional_arc: "high energy and sustained motivation"
      },
      confidence: 0.95,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      input_tokens: 380,
      output_tokens: 105,
      total_tokens: 485
    }
  },
  {
    date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
    aiInsight: {
      id: 'c4d3e2f1-a5b6-c7d8-e9f0-a1b2c3d4e5f6',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      reflection_date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
      summary: "This was a quiet, grounded day dedicated entirely to reflection and preparation. By taking the time to set clear goals and organize your upcoming schedule, you created a sense of mental clarity that leaves you feeling well-equipped to handle the week ahead.",
      personalized_reflection: { tone: "reflective", focus_areas: ["planning", "organization"] },
      structured_memory: {
        themes: ["planning", "organization", "reflection"],
        emotions: ["reflective", "clear-headed", "organized"],
        stressors: [],
        positive_topics: ["goal setting", "scheduling"],
        coping_strategies: ["planning ahead"],
        recurring_patterns: ["weekend planning"],
        notable_events: ["set weekly goals"],
        observations: ["Took time to prepare mentally for the upcoming week"],
        emotional_arc: "quiet contemplation moving to organized clarity"
      },
      confidence: 0.89,
      created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
      input_tokens: 350,
      output_tokens: 100,
      total_tokens: 450
    }
  },
  {
    date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
    aiInsight: null
  },
  {
    date: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0],
    aiInsight: {
      id: 'd5e4f3a2-b1c0-d9e8-f7a6-b5c4d3e2f1a0',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      reflection_date: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0],
      summary: "In contrast to your usual proactive mornings, today felt sluggish and emotionally draining. However, acknowledging this low energy rather than fighting it allowed you to pivot to lighter tasks, demonstrating a healthy adaptability to your mental state.",
      personalized_reflection: { tone: "compassionate", focus_areas: ["self-compassion", "adaptability"] },
      structured_memory: {
        themes: ["low energy", "adaptability"],
        emotions: ["drained", "accepting"],
        stressors: ["fatigue"],
        positive_topics: ["self-compassion"],
        coping_strategies: ["adjusting expectations"],
        recurring_patterns: ["occasional morning fatigue"],
        notable_events: [],
        observations: ["Adapted workload to match energy levels"],
        emotional_arc: "started sluggish, ended with acceptance"
      },
      confidence: 0.82,
      created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
      input_tokens: 310,
      output_tokens: 95,
      total_tokens: 405
    }
  },
  {
    date: new Date(Date.now() - 86400000 * 9).toISOString().split('T')[0],
    aiInsight: null
  },
  {
    date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
    aiInsight: {
      id: 'e6f5a4b3-c2d1-e0f9-a8b7-c6d5e4f3a2b1',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      reflection_date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
      summary: "Today was defined by unexpected creative breakthroughs. Stepping away from your desk for a mid-day walk seemed to unlock the solution to a problem you've been stuck on, highlighting the direct link between movement and your creative problem-solving.",
      personalized_reflection: { tone: "inspiring", focus_areas: ["creativity", "movement"] },
      structured_memory: {
        themes: ["creativity", "problem-solving", "movement"],
        emotions: ["inspired", "relieved", "excited"],
        stressors: [],
        positive_topics: ["creative breakthrough", "walking"],
        coping_strategies: ["taking breaks", "walking"],
        recurring_patterns: ["movement sparking ideas"],
        notable_events: ["solved major problem"],
        observations: ["Strong correlation between physical movement and cognitive breakthroughs"],
        emotional_arc: "frustrated to suddenly inspired"
      },
      confidence: 0.94,
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      input_tokens: 390,
      output_tokens: 115,
      total_tokens: 505
    }
  },
  {
    date: new Date(Date.now() - 86400000 * 11).toISOString().split('T')[0],
    aiInsight: null
  },
  {
    date: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
    aiInsight: {
      id: 'f7a6b5c4-d3e2-f1a0-b9c8-d7e6f5a4b3c2',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      reflection_date: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
      summary: "This was a highly social day that left you feeling both connected and slightly drained. While the interactions were overwhelmingly positive, you noted a craving for solitude by the evening, reinforcing your need for quiet time to recharge after extensive socializing.",
      personalized_reflection: { tone: "observant", focus_areas: ["social battery", "boundaries"] },
      structured_memory: {
        themes: ["socializing", "energy management"],
        emotions: ["connected", "drained"],
        stressors: ["social fatigue"],
        positive_topics: ["good conversations"],
        coping_strategies: ["evening solitude"],
        recurring_patterns: ["social hangover"],
        notable_events: ["multiple social engagements"],
        observations: ["Clear need for introverted recovery time"],
        emotional_arc: "highly engaged shifting to socially tired"
      },
      confidence: 0.90,
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
      input_tokens: 410,
      output_tokens: 108,
      total_tokens: 518
    }
  }
];

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
  const displayData = isError || !data?.data ? MOCK_TIMELINE_DATA : data.data;

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
