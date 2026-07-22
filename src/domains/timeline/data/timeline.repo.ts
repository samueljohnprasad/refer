import { supabase } from '@/src/network/auth/supabase';
import type { TimelineEntry } from '../model/timeline.types';

export const timelineRepo = {
  async getDailyTimeline(page: number, pageSize: number): Promise<{ data: TimelineEntry[] }> {
    const res = await supabase.functions.invoke(`get-timeline-daily?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });
    if (res.error) throw res.error;
    return { data: res.data };
  },

  async generateDailyInsight(date: string): Promise<{ data: any }> {
    const { data, error } = await supabase.functions.invoke('generate-daily-ai', {
      body: { date },
    });
    if (error) throw error;
    return { data };
  },

  async getWeeklyTimeline(page: number, pageSize: number): Promise<{ data: TimelineEntry[] }> {
    const res = await supabase.functions.invoke(`get-timeline-weekly?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });
    if (res.error) throw res.error;
    return { data: res.data };
  },

  async generateWeeklyInsight(week_index: number, year: number): Promise<{ data: any }> {
    const { data, error } = await supabase.functions.invoke('generate-weekly-ai', {
      body: { week_index, year },
    });
    if (error) throw error;
    return { data };
  },

  async getMonthlyTimeline(page: number, pageSize: number): Promise<{ data: TimelineEntry[] }> {
    const res = await supabase.functions.invoke(`get-timeline-monthly?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });
    if (res.error) throw res.error;
    return { data: res.data };
  },

  async generateMonthlyInsight(date: string): Promise<{ data: any }> {
    const { data, error } = await supabase.functions.invoke('generate-monthly-ai', {
      body: { date },
    });
    if (error) throw error;
    return { data };
  },
};
