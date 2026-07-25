import { format, startOfWeek, differenceInCalendarDays, subWeeks, addDays, isToday as isDateToday } from 'date-fns';
import { XPHistoryEntry } from '@/src/types/xp';

export interface ChartDayData {
  day: string;
  weekIndex: number;
  dayIndex: number;
  value: number; // 0.0 to 1.0
  dateString: string;
  totalXP: number; // For tooltip/display
  isToday: boolean;
}

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const generateXPChartData = (history: XPHistoryEntry[], numWeeks = 4) => {
  // 1. Find the start of the week for numWeeks ago (Sunday start)
  // e.g., if numWeeks = 4, we want data for the past 4 weeks including current week
  // The first week (weekIndex 0) should be 3 weeks ago, last week (weekIndex 3) is current week
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
  
  const startDate = subWeeks(currentWeekStart, numWeeks - 1);
  
  // 2. Initialize the 2D array grid
  const grid: ChartDayData[][] = Array.from({ length: numWeeks }, (_, weekIndex) => 
    Array.from({ length: 7 }, (_, dayIndex) => {
      const dayDate = addDays(startDate, weekIndex * 7 + dayIndex);
      return {
        day: dayLabels[dayIndex],
        weekIndex,
        dayIndex,
        value: 0,
        dateString: format(dayDate, 'd MMMM'),
        totalXP: 0,
        isToday: isDateToday(dayDate),
      };
    })
  );
  
  // 3. Aggregate XP into buckets
  let maxXP = 0;
  
  history.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    // Ignore entries before our start date or in the future
    if (entryDate < startDate || entryDate > addDays(currentWeekStart, 7)) {
      return;
    }
    
    // Find bucket
    const diffDays = differenceInCalendarDays(entryDate, startDate);
    const weekIdx = Math.floor(diffDays / 7);
    const dayIdx = diffDays % 7;
    
    if (weekIdx >= 0 && weekIdx < numWeeks && dayIdx >= 0 && dayIdx < 7) {
      grid[weekIdx][dayIdx].totalXP += entry.amount;
      if (grid[weekIdx][dayIdx].totalXP > maxXP) {
        maxXP = grid[weekIdx][dayIdx].totalXP;
      }
    }
  });
  
  // 4. Normalize values between 0.0 and 1.0
  const highestScore = Math.max(maxXP, 50); // Provide a reasonable minimum ceiling
  
  grid.forEach(week => {
    week.forEach(day => {
      day.value = day.totalXP / highestScore;
    });
  });
  
  // 5. Generate week labels
  const weekLabels = grid.map(week => {
    return `Week of ${week[0].dateString}`;
  });
  
  return {
    data: grid,
    weekLabels,
  };
};
