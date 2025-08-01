import React, { useState, useEffect, useCallback } from 'react';
import { MentalHealthData, MoodEntry } from '@/types/mentalHealth';
import { generateTestMentalHealthData } from '@/data/testMentalHealthData';
import { DailyStatisticsView } from './DailyStatistics/DailyStatisticsView';
import { EntryCardsView } from './EntryCards/EntryCardsView';
import { EntryDetailModal } from './EntryModal/EntryDetailModal';

interface MentalHealthProfileContainerProps {
  selectedDate: Date;
  onRefresh?: () => void;
}

export const MentalHealthProfileContainer: React.FC<MentalHealthProfileContainerProps> = ({
  selectedDate,
  onRefresh,
}) => {
  const [mentalHealthData, setMentalHealthData] = useState<MentalHealthData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Load data for the selected date
  const loadDataForDate = useCallback(async (date: Date): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = generateTestMentalHealthData(date);
      setMentalHealthData(data);
    } catch (error) {
      console.error('Error loading mental health data:', error);
      // In a real app, you'd handle this error appropriately
      setMentalHealthData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data when selected date changes
  useEffect(() => {
    loadDataForDate(selectedDate);
  }, [selectedDate, loadDataForDate, refreshKey]);

  // Handle entry card press
  const handleEntryPress = useCallback((entry: MoodEntry): void => {
    setSelectedEntry(entry);
    setIsModalVisible(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback((): void => {
    setIsModalVisible(false);
    // Clear selected entry after animation completes
    setTimeout(() => {
      setSelectedEntry(null);
    }, 300);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback((): void => {
    setRefreshKey(prev => prev + 1);
    onRefresh?.();
  }, [onRefresh]);

  // Simulate real-time updates (optional - for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional data updates (e.g., new entries, mood changes)
      if (Math.random() < 0.1 && mentalHealthData) { // 10% chance every 30 seconds
        const updatedData = generateTestMentalHealthData(selectedDate);
        setMentalHealthData(updatedData);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [selectedDate, mentalHealthData]);

  if (!mentalHealthData && !isLoading) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700">
            Unable to load mental health data. Please try again.
          </p>
          <button 
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Daily Statistics Section */}
      <DailyStatisticsView
        dailyStats={mentalHealthData?.dailyStats || null}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />

      {/* Journal Entries Section */}
      <EntryCardsView
        entries={mentalHealthData?.entries || []}
        isLoading={isLoading}
        onEntryPress={handleEntryPress}
        onRefresh={handleRefresh}
      />

      {/* Entry Detail Modal */}
      <EntryDetailModal
        entry={selectedEntry}
        isVisible={isModalVisible}
        onClose={handleModalClose}
      />
    </>
  );
};

// Custom hook for mental health data management (for potential reuse)
export const useMentalHealthData = (selectedDate: Date) => {
  const [data, setData] = useState<MentalHealthData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (date: Date): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const mentalHealthData = generateTestMentalHealthData(date);
      setData(mentalHealthData);
    } catch (err) {
      setError('Failed to load mental health data');
      console.error('Error loading mental health data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback((): void => {
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  return {
    data,
    isLoading,
    error,
    refresh,
  };
};
