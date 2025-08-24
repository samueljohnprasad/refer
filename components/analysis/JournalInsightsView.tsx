import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Easing } from 'react-native';
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
  
  // Animation values for premium entrance animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateYAnim = React.useRef(new Animated.Value(20)).current;
  
  // Animation sequence for cards
  const animateCards = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
    
    Animated.timing(translateYAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  };
  
  useEffect(() => {
    animateCards();
  }, []);
  
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
  
  // Helper function to get animated styles with delay based on index
  const getAnimatedStyle = (index: number) => {
    return {
      opacity: fadeAnim,
      transform: [{
        translateY: translateYAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 5 * index]
        })
      }],
    };
  };
  
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Box className="px-4 py-6 pb-12">
        {/* Transcript Card - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(0)]}>  
          <Card className="mb-6 p-5 rounded-xl bg-white shadow-sm border border-gray-100">
            <HStack className="items-center mb-3">
              <Box className="w-1.5 h-6 rounded-full bg-blue-500 mr-2" />
              <Text className="text-lg font-semibold text-gray-800">Your Journal</Text>
            </HStack>
            <Box className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              {transcripts.map((transcript, index) => (
                <Text key={index} className="text-gray-700 leading-relaxed mb-2 font-normal">
                  {transcript}
                </Text>
              ))}
            </Box>
          </Card>
        </Animated.View>
        
        {/* Summary Card - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(1)]}>
          <Card className="mb-6 p-5 rounded-xl bg-white shadow-sm border border-gray-100">
            <HStack className="items-center mb-3">
              <Box className="w-1.5 h-6 rounded-full bg-green-500 mr-2" />
              <Text className="text-lg font-semibold text-gray-800">Summary</Text>
            </HStack>
            <Box className="p-4 bg-blue-50/30 rounded-lg border border-blue-100/50">
              <Text className="text-gray-700 leading-relaxed font-normal italic">
                {analysisResult.summary}
              </Text>
            </Box>
          </Card>
        </Animated.View>
        
        {/* Sentiment Analysis - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(2)]}>
          <Card className="mb-6 p-5 rounded-xl bg-white shadow-sm border border-gray-100">
            <HStack className="items-center mb-3">
              <Box className="w-1.5 h-6 rounded-full bg-purple-500 mr-2" />
              <Text className="text-lg font-semibold text-gray-800">Sentiment</Text>
            </HStack>
            <HStack className="items-center justify-between mb-1">
              <Box className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <Text 
                  className="text-xl font-bold capitalize" 
                  style={{ color: getSentimentColor() }}
                >
                  {analysisResult.sentiment.label}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">Overall Mood</Text>
              </Box>
              <Box 
                className="h-24 w-24 rounded-full border-4 items-center justify-center shadow-inner"
                style={{ borderColor: getSentimentColor(), backgroundColor: `${getSentimentColor()}10` }}
              >
                <Text className="text-2xl font-bold" style={{ color: getSentimentColor() }}>
                  {Math.round((analysisResult.sentiment.score + 1) * 50)}
                </Text>
                <Text className="text-xs text-gray-500">Score</Text>
              </Box>
            </HStack>
          </Card>
        </Animated.View>
        
        {/* Emotions Analysis - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(3)]}>
          <Card className="mb-6 p-5 rounded-xl bg-white shadow-sm border border-gray-100">
            <HStack className="items-center mb-3">
              <Box className="w-1.5 h-6 rounded-full bg-red-500 mr-2" />
              <Text className="text-lg font-semibold text-gray-800">Emotions</Text>
            </HStack>
            <Box className="p-4 bg-gray-50/80 rounded-lg border border-gray-100">
              <VStack className="space-y-3">
                {Object.entries(analysisResult.emotions).map(([emotion, value], index) => (
                  <Animated.View 
                    key={emotion}
                    style={{ 
                      opacity: fadeAnim, 
                      transform: [{ 
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10 * (index + 1), 0]
                        })
                      }] 
                    }}
                  >
                    <EmotionBar 
                      emotion={emotion}
                      value={value}
                      color={emotionColors[emotion as keyof typeof emotionColors] || activeTheme.highlight}
                    />
                  </Animated.View>
                ))}
              </VStack>
            </Box>
          </Card>
        </Animated.View>
        
        {/* Topics - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(4)]}>
          <Card className="mb-6 p-5 rounded-xl bg-white shadow-sm border border-gray-100">
            <HStack className="items-center mb-3">
              <Box className="w-1.5 h-6 rounded-full bg-yellow-500 mr-2" />
              <Text className="text-lg font-semibold text-gray-800">Key Topics</Text>
            </HStack>
            <Box className="p-4 bg-gray-50/80 rounded-lg border border-gray-100">
              <HStack className="flex-wrap">
                {analysisResult.topics.map((topic, index) => {
                  const hueRotate = (index * 40) % 360;
                  return (
                    <Animated.View 
                      key={index}
                      style={{
                        opacity: fadeAnim,
                        transform: [{
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1]
                          })
                        }]
                      }}
                    >
                      <Box 
                        className="px-4 py-2 m-1 rounded-full bg-blue-50 border border-blue-100"
                        style={{ 
                          backgroundColor: `hsl(${hueRotate}, 85%, 95%)`,
                          borderColor: `hsl(${hueRotate}, 70%, 85%)`
                        }}
                      >
                        <Text 
                          className="text-gray-700 capitalize font-medium"
                          style={{ color: `hsl(${hueRotate}, 70%, 35%)` }}
                        >
                          {topic}
                        </Text>
                      </Box>
                    </Animated.View>
                  );
                })}
              </HStack>
            </Box>
          </Card>
        </Animated.View>
        
        {/* Insights - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(5)]}>
          <Card className="mb-6 p-5 rounded-xl bg-white shadow-sm border border-gray-100">
            <HStack className="items-center mb-3">
              <Box className="w-1.5 h-6 rounded-full bg-indigo-500 mr-2" />
              <Text className="text-lg font-semibold text-gray-800">Insights</Text>
            </HStack>
            <Box className="p-0 rounded-lg">
              <VStack className="space-y-3">
                {analysisResult.insights?.map((insight, index) => (
                  <Animated.View 
                    key={index} 
                    style={{
                      opacity: fadeAnim,
                      transform: [{
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10 * (index + 1), 0]
                        })
                      }]
                    }}
                  >
                    <Box 
                      className="p-4 rounded-lg bg-indigo-50 border-l-4"
                      style={{ borderColor: activeTheme.highlight }}
                    >
                      <HStack className="items-center mb-1">
                        <Box className="w-6 h-6 rounded-full bg-indigo-100 items-center justify-center mr-2">
                          <Text className="text-xs font-bold text-indigo-600">{index + 1}</Text>
                        </Box>
                        <Text className="text-sm font-medium text-indigo-800">Key Insight</Text>
                      </HStack>
                      <Text className="text-gray-700 ml-8">{insight}</Text>
                    </Box>
                  </Animated.View>
                ))}
              </VStack>
            </Box>
          </Card>
        </Animated.View>
        
        {/* Action Items - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(6)]}>
          <Card className="mb-6 p-5 rounded-xl bg-white shadow-sm border border-gray-100">
            <HStack className="items-center mb-3">
              <Box className="w-1.5 h-6 rounded-full bg-green-500 mr-2" />
              <Text className="text-lg font-semibold text-gray-800">Suggested Actions</Text>
            </HStack>
            <Box className="p-4 bg-green-50/40 rounded-lg border border-green-100/50">
              <VStack className="space-y-4">
                {analysisResult.actionItems?.map((action, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      opacity: fadeAnim,
                      transform: [{
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [index % 2 === 0 ? 20 : -20, 0]
                        })
                      }]
                    }}
                  >
                    <HStack key={index} className="items-center space-x-3 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                      <Box 
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${activeTheme.highlight}20` }}
                      >
                        <Text className="font-bold text-green-700">{index + 1}</Text>
                      </Box>
                      <Text className="text-gray-700 flex-1 font-medium">{action}</Text>
                    </HStack>
                  </Animated.View>
                ))}
              </VStack>
            </Box>
          </Card>
        </Animated.View>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default JournalInsightsView;
