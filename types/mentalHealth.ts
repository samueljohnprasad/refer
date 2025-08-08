// Mental Health Journal Data Types

export interface MoodEntry {
  id: string;
  timestamp: Date;
  primaryMood: MoodType;
  moodIntensity: number; // 1-10 scale
  emotions: EmotionTag[];
  aiTitle: string;
  excerpt: string; // First ~50 characters
  fullTranscription: string;
  aiSuggestions: string[];
  reflectionPrompts: string[];
  entryType: 'voice' | 'text';
  duration?: number; // in seconds for voice entries
}

export interface DailyStatistics {
  date: Date;
  overallMood: MoodType;
  moodScore: number; // Average mood intensity for the day
  dominantEmotions: EmotionTag[];
  emotionDistribution: EmotionDistribution[];
  aiSummary: string;
  totalEntries: number;
  reflectionLevel: 'low' | 'medium' | 'high';
  stressLevel: number; // 1-10 scale
}

export interface MoodTrend {
  date: Date;
  moodScore: number;
  stressLevel: number;
  reflectionLevel: number;
}

export interface EmotionDistribution {
  emotion: EmotionTag;
  percentage: number;
  color: string; // For chart visualization
}

export interface PersonalizedInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'pattern' | 'achievement' | 'suggestion';
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export type MoodType = 
  | 'anxious'
  | 'calm' 
  | 'hopeful'
  | 'stressed'
  | 'peaceful'
  | 'overwhelmed'
  | 'grateful'
  | 'sad'
  | 'excited'
  | 'neutral'
  | 'confused'
  | 'confident';

export type EmotionTag = 
  | 'anxiety'
  | 'stress'
  | 'calm'
  | 'hope'
  | 'gratitude'
  | 'sadness'
  | 'joy'
  | 'fear'
  | 'anger'
  | 'peace'
  | 'confusion'
  | 'clarity'
  | 'loneliness'
  | 'connection'
  | 'frustration'
  | 'contentment'
  | 'worry'
  | 'relief'
  | 'overwhelmed'
  | 'motivated';

export interface MentalHealthData {
  dailyStats: DailyStatistics;
  entries: MoodEntry[];
  weeklyTrends: MoodTrend[];
  monthlyTrends: MoodTrend[];
  insights: PersonalizedInsight[];
}
