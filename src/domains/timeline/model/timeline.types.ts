import type { TimelineItemData } from '@/src/components/ui/Timeline/types';

export interface AiInsight {
  id?: string;
  user_id?: string;
  reflection_date?: string;
  summary: string;
  timelineSummary?: string;
  personalized_reflection?: any;
  structured_memory?: any;
  confidence?: number;
  created_at?: string;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
}

export interface TimelineEntry {
  date: string;
  aiInsight: AiInsight | null;
}

export interface DailyTimelineItem extends TimelineItemData {
  originalDateString: string;
  aiInsight: AiInsight | null;
}

export interface WeeklyTimelineItem extends TimelineItemData {
  originalDateString: string;
  aiInsight: AiInsight | null;
}

export interface MonthlyTimelineItem extends TimelineItemData {
  originalDateString: string;
  aiInsight: AiInsight | null;
}

export type TimelineTabType = 'days' | 'weeks' | 'months';

export interface TimelineTabProps {
  onOpenModal?: () => void;
}
