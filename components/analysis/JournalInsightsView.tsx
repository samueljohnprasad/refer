import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { TextAnalysisResult } from '@/utils/textAnalysisService';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';

interface EmotionBarProps {
  emotion: string;
  value: number;
  color: string;
}

const EmotionBar: React.FC<EmotionBarProps> = ({ emotion, value, color }) => {
  const percentage = `${Math.round(value * 100)}%`;
  
  return (
    <Box className="mb-3">
      <HStack className="justify-between mb-1">
        <Text className="text-sm text-gray-600 capitalize">{emotion}</Text>
        <Text className="text-sm font-medium">{percentage}</Text>
      </HStack>
      <Box className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <Box 
          className="h-full rounded-full"
          style={{
            width: `${Math.round(value * 100)}%`,
            backgroundColor: color
          } as any}
        />
      </Box>
    </Box>
  );
};

interface JournalInsightsViewProps {
  transcripts: string[];
  analysisResult: TextAnalysisResult;
}

const JournalInsightsView: React.FC<JournalInsightsViewProps> = ({ 
  transcripts, 
  analysisResult
}) => {
  const activeTheme = useSeasonalTheme();
  
  // Get sentiment color
  const getSentimentColor = () => {
    switch (analysisResult.sentiment.label) {
      case 'positive':
        return '#10B981'; // Green
      case 'negative':
        return '#EF4444'; // Red
      default:
        return '#A1A1AA'; // Gray
    }
  };
  
  // Emotion colors
  const emotionColors = {
    joy: '#10B981',    // Green
    sadness: '#60A5FA', // Blue
    anger: '#EF4444',  // Red
    fear: '#8B5CF6',   // Purple
    surprise: '#F59E0B' // Orange
  };
  
  return (
    <ScrollView className="flex-1">
      <Box className="px-4 py-6">
        {/* Transcript Card */}
        <Card className="mb-6 p-5 rounded-xl bg-white">
          <Text className="text-lg font-semibold mb-2">Your Journal</Text>
          <Box className="p-4 bg-gray-50 rounded-lg">
            {transcripts.map((transcript, index) => (
              <Text key={index} className="text-gray-700 leading-relaxed mb-2">
                {transcript}
              </Text>
            ))}
          </Box>
        </Card>
        
        {/* Summary Card */}
        <Card className="mb-6 p-5 rounded-xl bg-white">
          <Text className="text-lg font-semibold mb-2">Summary</Text>
          <Text className="text-gray-700 leading-relaxed">
            {analysisResult.summary}
          </Text>
        </Card>
        
        {/* Sentiment Analysis */}
        <Card className="mb-6 p-5 rounded-xl bg-white">
          <Text className="text-lg font-semibold mb-2">Sentiment</Text>
          <HStack className="items-center justify-between mb-4">
            <Box className="p-3 rounded-lg bg-gray-50">
              <Text 
                className="text-lg font-bold capitalize" 
                style={{ color: getSentimentColor() }}
              >
                {analysisResult.sentiment.label}
              </Text>
            </Box>
            <Box className="h-20 w-20 rounded-full border-4 items-center justify-center"
              style={{ borderColor: getSentimentColor() }}>
              <Text className="text-xl font-bold" style={{ color: getSentimentColor() }}>
                {Math.round((analysisResult.sentiment.score + 1) * 50)}
              </Text>
            </Box>
          </HStack>
        </Card>
        
        {/* Emotions Analysis */}
        <Card className="mb-6 p-5 rounded-xl bg-white">
          <Text className="text-lg font-semibold mb-3">Emotions</Text>
          <VStack className="space-y-1">
            {Object.entries(analysisResult.emotions).map(([emotion, value]) => (
              <EmotionBar 
                key={emotion}
                emotion={emotion}
                value={value}
                color={emotionColors[emotion as keyof typeof emotionColors] || activeTheme.highlight}
              />
            ))}
          </VStack>
        </Card>
        
        {/* Topics */}
        <Card className="mb-6 p-5 rounded-xl bg-white">
          <Text className="text-lg font-semibold mb-3">Key Topics</Text>
          <HStack className="flex-wrap">
            {analysisResult.topics.map((topic, index) => (
              <Box 
                key={index}
                className="px-4 py-2 m-1 rounded-full bg-gray-100"
              >
                <Text className="text-gray-700 capitalize">{topic}</Text>
              </Box>
            ))}
          </HStack>
        </Card>
        
        {/* Insights */}
        <Card className="mb-6 p-5 rounded-xl bg-white">
          <Text className="text-lg font-semibold mb-3">Insights</Text>
          <VStack className="space-y-2">
            {analysisResult.insights?.map((insight, index) => (
              <Box 
                key={index}
                className="p-3 rounded-lg bg-blue-50 border-l-4"
                style={{ borderColor: activeTheme.highlight }}
              >
                <Text className="text-gray-700">{insight}</Text>
              </Box>
            ))}
          </VStack>
        </Card>
        
        {/* Action Items */}
        <Card className="mb-6 p-5 rounded-xl bg-white">
          <Text className="text-lg font-semibold mb-3">Suggested Actions</Text>
          <VStack className="space-y-3">
            {analysisResult.actionItems?.map((action, index) => (
              <HStack key={index} className="items-center space-x-3">
                <Box 
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${activeTheme.highlight}20` }}
                >
                  <Text className="font-semibold">{index + 1}</Text>
                </Box>
                <Text className="text-gray-700 flex-1">{action}</Text>
              </HStack>
            ))}
          </VStack>
        </Card>
      </Box>
    </ScrollView>
  );
};

export default JournalInsightsView;
