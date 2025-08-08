import { MentalHealthData, MoodEntry, DailyStatistics, MoodTrend, PersonalizedInsight, EmotionDistribution } from '@/types/mentalHealth';
import { addDays, subDays, startOfDay } from 'date-fns';

// Generate test data for mental health journal
export const generateTestMentalHealthData = (selectedDate: Date): MentalHealthData => {
  const entries = generateEntriesForDate(selectedDate);
  const dailyStats = generateDailyStats(selectedDate, entries);
  const weeklyTrends = generateWeeklyTrends(selectedDate);
  const monthlyTrends = generateMonthlyTrends(selectedDate);
  const insights = generatePersonalizedInsights();

  return {
    dailyStats,
    entries,
    weeklyTrends,
    monthlyTrends,
    insights,
  };
};

const generateEntriesForDate = (date: Date): MoodEntry[] => {
  const entries: MoodEntry[] = [];
  const numEntries = Math.floor(Math.random() * 5) + 1; // 1-5 entries per day
  
  const sampleTranscriptions = [
    "I had a really challenging meeting today with my manager about the project timeline. I felt anxious going into it, but I managed to communicate my concerns clearly. I think we found a good compromise, and I'm feeling more hopeful about the workload now.",
    "Woke up feeling overwhelmed by my to-do list. Decided to break everything down into smaller tasks and that helped a lot. Sometimes I forget how much better I feel when I organize my thoughts. Grateful for this realization.",
    "Had coffee with Sarah today and we talked about our career goals. It made me realize how much I've been second-guessing myself lately. She reminded me of all the progress I've made this year, which was exactly what I needed to hear.",
    "Feeling stressed about the upcoming presentation. My mind keeps racing with all the things that could go wrong. I tried some deep breathing exercises and they helped a bit. Maybe I should practice more mindfulness techniques.",
    "Today was surprisingly peaceful. No major deadlines or conflicts. I took a longer lunch break and walked in the park. It's amazing how much nature can reset my mood. I want to make this a regular habit.",
    "Had an argument with my roommate about cleaning responsibilities. I got more heated than I intended and feel bad about it now. I think I was projecting my work stress onto the situation. Need to apologize tomorrow.",
    "Therapy session went well today. We talked about my tendency to catastrophize situations. Dr. Smith gave me some new cognitive techniques to try. I'm cautiously optimistic about implementing them this week.",
    "Feeling grateful for my support system. Mom called just when I was having a tough day, and somehow she always knows exactly what to say. These connections matter so much more than I sometimes realize.",
  ];

  const sampleAITitles = [
    "Processing Work Anxiety",
    "Finding Organization & Clarity",
    "Career Reflection & Support",
    "Managing Presentation Stress",
    "Peaceful Nature Connection",
    "Conflict Resolution Thoughts",
    "Therapy Progress & Growth",
    "Gratitude for Support System",
    "Morning Meditation Insights",
    "Evening Reflection Time",
    "Relationship Communication",
    "Personal Achievement Moment",
  ];

  const sampleSuggestions = [
    ["Try progressive muscle relaxation when feeling tense", "Consider journaling before bed to process the day"],
    ["Practice the 5-4-3-2-1 grounding technique", "Schedule regular check-ins with yourself"],
    ["Continue building your support network", "Celebrate small wins along the way"],
    ["Break overwhelming tasks into smaller steps", "Use positive self-talk before challenges"],
    ["Maintain regular nature breaks", "Consider mindfulness meditation apps"],
    ["Practice 'I' statements during conflicts", "Take breaks when emotions run high"],
  ];

  for (let i = 0; i < numEntries; i++) {
    const transcription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    const timestamp = new Date(date);
    timestamp.setHours(9 + i * 2, Math.floor(Math.random() * 60), 0, 0);

    entries.push({
      id: `entry-${date.toISOString().split('T')[0]}-${i}`,
      timestamp,
      primaryMood: getRandomMood(),
      moodIntensity: Math.floor(Math.random() * 5) + 4, // 4-8 range for more realistic data
      emotions: getRandomEmotions(),
      aiTitle: sampleAITitles[Math.floor(Math.random() * sampleAITitles.length)],
      excerpt: transcription.substring(0, 50) + (transcription.length > 50 ? '...' : ''),
      fullTranscription: transcription,
      aiSuggestions: sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)],
      reflectionPrompts: [
        "How did this experience help you grow?",
        "What would you tell a friend in this situation?",
        "What are you most grateful for today?",
        "How can you show yourself compassion right now?",
      ],
      entryType: Math.random() > 0.3 ? 'voice' : 'text',
      duration: Math.random() > 0.3 ? Math.floor(Math.random() * 180) + 30 : undefined, // 30-210 seconds
    });
  }

  return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

const generateDailyStats = (date: Date, entries: MoodEntry[]): DailyStatistics => {
  const moodScores = entries.map(e => e.moodIntensity);
  const avgMoodScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length || 5;
  
  const allEmotions = entries.flatMap(e => e.emotions);
  const emotionCounts = allEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantEmotions = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([emotion]) => emotion as any);

  const emotionDistribution: EmotionDistribution[] = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({
      emotion: emotion as any,
      percentage: (count / allEmotions.length) * 100,
      color: getEmotionColor(emotion as any),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  const aiSummaries = [
    "Today showed a healthy balance of reflection and action. You processed challenges thoughtfully and maintained connections with your support system.",
    "Your emotional awareness was particularly strong today. You recognized stress patterns and took proactive steps to manage them.",
    "A day of growth and self-compassion. You handled difficult situations with maturity and sought appropriate support when needed.",
    "Your mindfulness practice is paying off. You stayed present during challenges and found moments of peace throughout the day.",
    "Strong emotional regulation today. You navigated conflicts constructively and maintained perspective during stressful moments.",
  ];

  return {
    date,
    overallMood: entries.length ? entries[entries.length - 1].primaryMood : 'neutral',
    moodScore: Math.round(avgMoodScore * 10) / 10,
    dominantEmotions,
    emotionDistribution,
    aiSummary: aiSummaries[Math.floor(Math.random() * aiSummaries.length)],
    totalEntries: entries.length,
    reflectionLevel: avgMoodScore > 6.5 ? 'high' : avgMoodScore > 4.5 ? 'medium' : 'low',
    stressLevel: Math.max(1, Math.min(10, Math.round(10 - avgMoodScore + Math.random() * 2))),
  };
};

const generateWeeklyTrends = (selectedDate: Date): MoodTrend[] => {
  const trends: MoodTrend[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(selectedDate, i);
    trends.push({
      date,
      moodScore: Math.random() * 3 + 4.5, // 4.5-7.5 range
      stressLevel: Math.random() * 4 + 3, // 3-7 range
      reflectionLevel: Math.random() * 3 + 5, // 5-8 range
    });
  }
  
  return trends;
};

const generateMonthlyTrends = (selectedDate: Date): MoodTrend[] => {
  const trends: MoodTrend[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = subDays(selectedDate, i);
    trends.push({
      date,
      moodScore: Math.random() * 3 + 4.5,
      stressLevel: Math.random() * 4 + 3,
      reflectionLevel: Math.random() * 3 + 5,
    });
  }
  
  return trends;
};

const generatePersonalizedInsights = (): PersonalizedInsight[] => {
  return [
    {
      id: 'insight-1',
      title: "Weekend Reflection Pattern",
      description: "You tend to be more reflective and peaceful on weekends, showing 40% higher mindfulness scores.",
      type: 'pattern',
      priority: 'medium',
      createdAt: new Date(),
    },
    {
      id: 'insight-2',
      title: "Stress Management Progress",
      description: "Your stress levels have decreased by 25% over the past month. Great work on implementing coping strategies!",
      type: 'achievement',
      priority: 'high',
      createdAt: subDays(new Date(), 1),
    },
    {
      id: 'insight-3',
      title: "Morning Mood Boost",
      description: "Consider scheduling important conversations in the morning when your emotional regulation is typically strongest.",
      type: 'suggestion',
      priority: 'low',
      createdAt: subDays(new Date(), 3),
    },
  ];
};

const getRandomMood = () => {
  const moods = ['anxious', 'calm', 'hopeful', 'stressed', 'peaceful', 'grateful', 'neutral', 'confident'] as const;
  return moods[Math.floor(Math.random() * moods.length)];
};

const getRandomEmotions = () => {
  const emotions = ['anxiety', 'stress', 'calm', 'hope', 'gratitude', 'peace', 'clarity', 'relief', 'contentment'] as const;
  const numEmotions = Math.floor(Math.random() * 3) + 1; // 1-3 emotions
  const selected = [];
  
  for (let i = 0; i < numEmotions; i++) {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    if (!selected.includes(emotion)) {
      selected.push(emotion);
    }
  }
  
  return selected;
};

const getEmotionColor = (emotion: string): string => {
  const colorMap: Record<string, string> = {
    anxiety: '#FF6B6B',
    stress: '#FF8E53',
    calm: '#4ECDC4',
    hope: '#45B7D1',
    gratitude: '#96CEB4',
    peace: '#FECA57',
    clarity: '#9B59B6',
    relief: '#58D68D',
    contentment: '#F39C12',
    joy: '#E74C3C',
    fear: '#8E44AD',
    anger: '#E67E22',
    confusion: '#95A5A6',
    loneliness: '#34495E',
    connection: '#2ECC71',
    frustration: '#E74C3C',
    worry: '#F39C12',
    overwhelmed: '#C0392B',
    motivated: '#27AE60',
  };
  
  return colorMap[emotion] || '#BDC3C7';
};
