import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { format, startOfWeek, addDays, subWeeks, differenceInWeeks, isSameDay, differenceInCalendarDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface JournalEntry {
  date: string; // YYYY-MM-DD
  entriesCount: number;
  wordCount: number;
  moodScore?: number;
}

interface JournalingHeatmapProps {
  data?: JournalEntry[];
  weeksToShow?: number;
  onDayPress?: (date: Date) => void;
  premium?: boolean;
}

interface DayData {
  date: Date;
  level: number; // 0-4 intensity level
  entries: number;
  words: number;
  mood?: number;
}

const HEATMAP_COLORS = [
  '#F3F4F6', // Level 0 - No activity
  '#C8B5F6', // Level 1 - Low
  '#A78BFA', // Level 2 - Medium  
  '#8B5CF6', // Level 3 - High
  '#7C3AED', // Level 4 - Very High
];

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const calculateIntensityLevel = (entries: number, words: number): number => {
  if (entries === 0) return 0;
  if (entries === 1 && words < 100) return 1;
  if (entries === 1 && words < 300) return 2;
  if (entries >= 2 || words >= 300) return 3;
  if (entries >= 3 || words >= 500) return 4;
  return 2;
};

export const JournalingHeatmap: React.FC<JournalingHeatmapProps> = ({
  data,
  weeksToShow = 52,
  onDayPress,
  premium = false
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Generate mock data for demonstration
  const mockData: JournalEntry[] = useMemo(() => {
    const entries: JournalEntry[] = [];
    const today = new Date();
    
    for (let i = 0; i < weeksToShow * 7; i++) {
      const date = subDays(today, i);
      const hasEntry = Math.random() > 0.3;
      
      if (hasEntry) {
        entries.push({
          date: format(date, 'yyyy-MM-dd'),
          entriesCount: Math.floor(Math.random() * 3) + 1,
          wordCount: Math.floor(Math.random() * 600) + 50,
          moodScore: Math.floor(Math.random() * 5) + 1
        });
      }
    }
    
    return entries;
  }, [weeksToShow]);

  const journalData = data || mockData;

  // Process data into grid format
  const heatmapData = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(subWeeks(today, weeksToShow - 1));
    const dataMap = new Map(journalData.map(d => [d.date, d]));
    
    const weeks: DayData[][] = [];
    let currentDate = startDate;
    
    for (let week = 0; week < weeksToShow; week++) {
      const weekDays: DayData[] = [];
      
      for (let day = 0; day < 7; day++) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        const entry = dataMap.get(dateKey);
        
        weekDays.push({
          date: new Date(currentDate),
          level: entry 
            ? calculateIntensityLevel(entry.entriesCount, entry.wordCount)
            : 0,
          entries: entry?.entriesCount || 0,
          words: entry?.wordCount || 0,
          mood: entry?.moodScore
        });
        
        currentDate = addDays(currentDate, 1);
      }
      
      weeks.push(weekDays);
    }
    
    return weeks;
  }, [journalData, weeksToShow]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalDays = weeksToShow * 7;
    const activeDays = journalData.length;
    const totalWords = journalData.reduce((sum, d) => sum + d.wordCount, 0);
    const totalEntries = journalData.reduce((sum, d) => sum + d.entriesCount, 0);
    const currentStreak = calculateCurrentStreak(journalData);
    const longestStreak = calculateLongestStreak(journalData);
    
    return {
      consistency: ((activeDays / totalDays) * 100).toFixed(0),
      totalEntries,
      averageWords: activeDays > 0 ? Math.floor(totalWords / activeDays) : 0,
      currentStreak,
      longestStreak,
      activeDays
    };
  }, [journalData, weeksToShow]);

  const handleDayPress = (day: DayData) => {
    setSelectedDay(day.date);
    onDayPress?.(day.date);
  };

  return (
    <View className="w-full rounded-3xl bg-white shadow-lg border border-gray-100 overflow-hidden">
      {/* Premium Badge */}
      {premium && (
        <LinearGradient
          colors={['#7B61FF', '#9C7CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            position: 'absolute',
            top: 0,
            right: 0,
            borderBottomLeftRadius: 12,
            zIndex: 10
          }}
        >
          <Text className="text-white text-xs font-bold">PREMIUM</Text>
        </LinearGradient>
      )}

      {/* Header */}
      <View className="p-5 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-xl font-extrabold text-gray-800">
              Journaling Consistency
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Last {weeksToShow} weeks
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-3xl font-extrabold text-[#166534]">
              {stats.consistency}%
            </Text>
            <Text className="text-xs text-gray-500">Consistency</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row justify-between p-4 rounded-2xl" style={{ backgroundColor: '#F9FAFB' }}>
          <View className="items-center flex-1">
            <Text className="text-xl font-bold text-gray-800">
              {stats.currentStreak}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">Current Streak</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-xl font-bold text-gray-800">
              {stats.longestStreak}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">Best Streak</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-xl font-bold text-gray-800">
              {stats.averageWords}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">Avg Words</Text>
          </View>
        </View>
      </View>

      {/* Heatmap Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pb-5">
        <View>
          {/* Weekday labels */}
          <View className="flex-row mb-1">
            <View className="w-5" />
            {WEEKDAYS.map((day, idx) => (
              <View key={idx} className="w-5 items-center">
                <Text className="text-xs text-gray-400 font-medium">{day}</Text>
              </View>
            ))}
          </View>

          {/* Heatmap */}
          <View className="flex-row">
            {/* Month labels */}
            <View className="pr-2 justify-around">
              {Array.from({ length: Math.ceil(weeksToShow / 4) }).map((_, idx) => {
                const weekIdx = idx * 4;
                if (weekIdx >= heatmapData.length) return null;
                const monthDate = heatmapData[weekIdx][0].date;
                
                return (
                  <Text key={idx} className="text-xs text-gray-400 font-medium">
                    {format(monthDate, 'MMM')}
                  </Text>
                );
              })}
            </View>

            {/* Grid */}
            <View className="flex-row">
              {heatmapData.map((week, weekIdx) => (
                <View key={weekIdx} className="flex-col">
                  {week.map((day, dayIdx) => (
                    <TouchableOpacity
                      key={dayIdx}
                      onPress={() => handleDayPress(day)}
                      className="p-0.5"
                      activeOpacity={0.7}
                    >
                      <View
                        className="w-4 h-4 rounded-sm"
                        style={{
                          backgroundColor: HEATMAP_COLORS[day.level],
                          borderWidth: selectedDay && isSameDay(day.date, selectedDay) ? 2 : 0,
                          borderColor: '#7C3AED'
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Legend */}
          <View className="flex-row items-center mt-4 gap-2">
            <Text className="text-xs text-gray-500 mr-2">Less</Text>
            {HEATMAP_COLORS.map((color, idx) => (
              <View
                key={idx}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            <Text className="text-xs text-gray-500 ml-2">More</Text>
          </View>
        </View>
      </ScrollView>

      {/* Selected Day Details */}
      {selectedDay && (
        <View className="px-5 pb-5 pt-3 border-t border-gray-100">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold text-gray-700">
                {format(selectedDay, 'MMMM d, yyyy')}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                {journalData.find(d => d.date === format(selectedDay, 'yyyy-MM-dd'))
                  ? `${journalData.find(d => d.date === format(selectedDay, 'yyyy-MM-dd'))?.entriesCount} entries, ${journalData.find(d => d.date === format(selectedDay, 'yyyy-MM-dd'))?.wordCount} words`
                  : 'No journal entry'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onDayPress?.(selectedDay)}
              className="p-2 rounded-full bg-violet-50"
            >
              <Feather name="arrow-right" size={16} color="#7C3AED" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Helper functions
function calculateCurrentStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;
  
  const today = new Date();
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = today;
  
  for (let i = 0; i < 365; i++) {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const hasEntry = sortedEntries.some(e => e.date === dateKey);
    
    if (hasEntry) {
      streak++;
    } else if (streak > 0) {
      break; // Streak broken
    }
    
    currentDate = subDays(currentDate, 1);
  }
  
  return streak;
}

function calculateLongestStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let maxStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = new Date(sortedEntries[i - 1].date);
    const currDate = new Date(sortedEntries[i].date);
    const daysDiff = differenceInCalendarDays(currDate, prevDate);
    
    if (daysDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export default JournalingHeatmap;
