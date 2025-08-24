import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Easing, Platform } from 'react-native';
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
  const barWidth = Math.round(value * 100);
  
  // Animation for the bar filling effect
  const barWidthAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(barWidthAnim, {
      toValue: barWidth,
      duration: 1000,
      delay: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [barWidth]);
  
  // Dynamic style based on emotion type
  const getEmotionIcon = () => {
    switch(emotion) {
      case 'joy':
        return '😊';
      case 'sadness':
        return '😔';
      case 'anger':
        return '😠';
      case 'fear':
        return '😨';
      case 'surprise':
        return '😲';
      default:
        return '•';
    }
  };

  const backgroundGradient = {
    backgroundColor: Platform.OS === 'web' 
      ? `linear-gradient(90deg, ${color}30, ${color}10)` 
      : `${color}20`
  };

  const barGradient = {
    backgroundColor: Platform.OS === 'web'
      ? `linear-gradient(90deg, ${color}, ${color}90)`
      : color
  };
  
  return (
    <Box className="mb-4">
      <HStack className="justify-between mb-2">
        <HStack className="items-center">
          <Text className="w-6 mr-2 text-lg">{getEmotionIcon()}</Text>
          <Text className="text-sm text-gray-700 tracking-wide capitalize" style={{ fontWeight: '450' as any }}>{emotion}</Text>
        </HStack>
        <Text className="text-sm" style={{color, fontWeight: '500' as any}}>{percentage}</Text>
      </HStack>
      <Box 
        className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden"
        style={{
          backgroundColor: '#fafafa',
          borderWidth: 0.5,
          borderColor: '#eaebef',
          ...(Platform.OS === 'web' ? {
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
          } : {})
        } as any}>
        <Animated.View 
          style={{
            height: '100%',
            width: barWidthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            }),
            ...barGradient,
            borderRadius: 100,
          }}
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  
  // Create multiple animation values for staggered animations
  const fadeAnimArray = useRef(Array(7).fill(0).map(() => new Animated.Value(0))).current;
  const translateYAnimArray = useRef(Array(7).fill(0).map(() => new Animated.Value(30))).current;
  const scaleAnimArray = useRef(Array(7).fill(0).map(() => new Animated.Value(0.95))).current;
  
  // Animation sequence for cards with staggered animations
  const animateCards = () => {
    // Global animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
    
    Animated.timing(translateYAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
    
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
    
    // Staggered animations for each card section
    fadeAnimArray.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * 120), // Stagger delay increases with each card
        Animated.parallel([
          Animated.timing(fadeAnimArray[index], {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease)
          }),
          Animated.timing(translateYAnimArray[index], {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic)
          }),
          Animated.timing(scaleAnimArray[index], {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease)
          })
        ])
      ]).start();
    });
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
  
  // Helper function to get animated styles with staggered animations
  const getAnimatedStyle = (index: number) => {
    return {
      opacity: fadeAnimArray[index],
      transform: [
        { translateY: translateYAnimArray[index] },
        { scale: scaleAnimArray[index] }
      ],
      shadowOpacity: fadeAnimArray[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.12]
      }),
    };
  };
  
  // Custom hook for web hover effects
  const useHoverStyle = (enabled = Platform.OS === 'web') => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    const hoverProps = enabled ? {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false)
    } : {};
    
    return { isHovered, hoverProps };
  };
  
  // Typography style helper
  const getTypographyStyle = (type: 'heading' | 'subheading' | 'body' | 'caption') => {
    switch (type) {
      case 'heading':
        return { letterSpacing: -0.6, fontWeight: '600' as any, lineHeight: 28 };
      case 'subheading':
        return { letterSpacing: -0.4, fontWeight: '500' as any, lineHeight: 24 };
      case 'body':
        return { letterSpacing: 0.1, lineHeight: 23, opacity: 0.9 };
      case 'caption':
        return { letterSpacing: 0.2, lineHeight: 16, opacity: 0.7 };
      default:
        return {};
    }
  };
  
  return (
  
    <ScrollView className="flex-1 bg-gray-50/60" contentContainerStyle={{paddingBottom: 80}}>
      <Box className="px-5 py-8 pb-16">
        {/* Transcript Card - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(0)]}>  
          <Card className="mb-8 p-6 rounded-3xl bg-white" style={[{
              borderWidth: 0.5,
              ...styles.premiumCard
            }]}>
            <HStack className="items-center mb-3">
              <Box className="w-[1px] h-7 rounded-full bg-blue-500 mr-2.5" />
              <Text className="text-lg text-gray-800" style={{ letterSpacing: -0.4, fontWeight: '500' as any }}>Your Journal</Text>
            </HStack>
            <Box className="p-6 rounded-2xl" style={{backgroundColor: '#fafafa', borderWidth: 0.5, borderColor: 'rgba(225,225,235,0.4)', ...styles.innerShadow}}>
              {transcripts.map((transcript, index) => (
                <Text key={index} className="text-gray-700 leading-relaxed mb-3 font-normal" style={getTypographyStyle('body')}>
                  {transcript}
                </Text>
              ))}
            </Box>
          </Card>
        </Animated.View>
        
        {/* Summary Card - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(1)]}>
          <Card className="mb-8 p-6 rounded-3xl bg-white border border-gray-100/30" style={[styles.premiumCard]}>
            <HStack className="items-center mb-5">
              <Box className="w-[1px] h-7 rounded-full bg-green-500 mr-2.5" />
              <Text className="text-xl text-gray-800 tracking-tight" style={{ letterSpacing: -0.6, fontWeight: '500' as any }}>Summary</Text>
            </HStack>
            <Box className="p-5 rounded-xl" style={{backgroundColor: 'rgba(248,251,255,0.8)', borderWidth: 0.5, borderColor: 'rgba(225,230,250,0.35)', ...styles.innerShadow}}>
              <Text className="text-gray-700 leading-relaxed italic" style={{ letterSpacing: 0.2, lineHeight: 24, fontWeight: '400' as any }}>
                {analysisResult.summary}
              </Text>
            </Box>
          </Card>
        </Animated.View>
        
        {/* Sentiment Analysis - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(2)]}>
          <Card className="mb-8 p-6 rounded-3xl bg-white border border-gray-100/30" style={[styles.premiumCard]}>
            <HStack className="items-center mb-5">
              <Box className="w-[2px] h-7 rounded-full bg-purple-500 mr-2.5" />
              <Text className="text-xl text-gray-800 tracking-tight" style={{ letterSpacing: -0.6, fontWeight: '500' as any }}>Sentiment</Text>
            </HStack>
            <HStack className="items-center justify-between mb-1">
              <Box 
                className="p-6 mb-2 rounded-xl bg-white/95" 
                style={{
                  borderWidth: 0.5,
                  borderColor: 'rgba(230,230,235,0.35)',
                  backdropFilter: Platform.OS === 'web' ? 'blur(12px)' : undefined,
                  borderRadius: 12
                }}>
                <Text 
                  className="text-xl capitalize" 
                  style={{ color: getSentimentColor(), fontWeight: '500' as any, letterSpacing: -0.3 }}
                >
                  {analysisResult.sentiment.label}
                </Text>
                <Text className="text-xs text-gray-500 mt-1" style={{ letterSpacing: 0.2, opacity: 0.8 }}>Overall Mood</Text>
              </Box>
              <Box 
                className="h-24 w-24 rounded-full items-center justify-center"
                style={{ 
                  borderWidth: 0.5, 
                  borderColor: getSentimentColor(), 
                  backgroundColor: `${getSentimentColor()}05`,
                  ...(Platform.OS === 'web' ? {
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                  } : {})
                }}
              >
                <Text className="text-2xl" style={{ letterSpacing: -0.7, fontWeight: '500' as any, color: getSentimentColor() }}>
                  {Math.round((analysisResult.sentiment.score + 1) * 50)}
                </Text>
                <Text className="text-xs text-gray-500">Score</Text>
              </Box>
            </HStack>
          </Card>
        </Animated.View>
        
        {/* Emotions Analysis - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(3)]}>
          <Card className="mb-8 p-6 rounded-3xl bg-white border border-gray-100/30" style={[styles.premiumCard]}>
            <HStack className="items-center mb-5">
              <Box className="w-[2px] h-7 rounded-full bg-red-500 mr-2.5" />
              <Text className="text-xl text-gray-800 tracking-tight" style={{ letterSpacing: -0.6, fontWeight: '500' as any }}>Emotions</Text>
            </HStack>
            <Box 
                className="p-5 bg-gray-50/70 rounded-xl" style={{ 
                  backdropFilter: Platform.OS === 'web' ? 'blur(12px)' : undefined,
                  borderWidth: 0.5,
                  borderColor: 'rgba(230,230,235,0.4)'
                }}>
              <VStack className="space-y-3">
                {Object.entries(analysisResult.emotions).map(([emotion, value], index) => (
                  <Animated.View 
                    key={emotion}
                    style={{ 
                      opacity: fadeAnim, 
                      transform: [{ 
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [8 * (index + 1), 0]
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
          <Card className="mb-8 p-6 rounded-3xl bg-white border border-gray-100/30" style={[styles.premiumCard]}>
            <HStack className="items-center mb-5">
              <Box className="w-[2px] h-7 rounded-full bg-yellow-500 mr-2.5" />
              <Text className="text-xl text-gray-800 tracking-tight" style={{ letterSpacing: -0.6, fontWeight: '500' as any }}>Key Topics</Text>
            </HStack>
            <Box className="p-1.5 rounded-xl px-4 mr-2 mb-2" style={{ 
                  backgroundColor: 'rgba(248,248,252,0.8)',
                  backdropFilter: Platform.OS === 'web' ? 'blur(12px)' : undefined,
                  borderWidth: 0.5,
                  borderColor: 'rgba(230,230,235,0.4)'
                }}>
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
                        className="px-3.5 py-2 m-1 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${hueRotate}, 85%, 97%)`,
                          borderWidth: 0.5,
                          borderColor: `hsl(${hueRotate}, 70%, 90%)`,
                          ...(Platform.OS === 'web' ? {
                            boxShadow: '0 1px 2px rgba(0,0,0,0.01)',
                            transition: 'all 0.2s ease'
                          } : {})
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
          <Card className="mb-8 p-6 rounded-3xl bg-white border border-gray-100/30" style={[styles.premiumCard]}>
            <HStack className="items-center mb-5">
              <Box className="w-[2px] h-7 rounded-full bg-indigo-500 mr-2.5" />
              <Text className="text-xl text-gray-800 tracking-tight" style={{ letterSpacing: -0.6, fontWeight: '500' as any }}>Insights</Text>
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
                      className="p-4 rounded-lg bg-indigo-50/70"
                      style={{ 
                        borderLeftWidth: 2,
                        borderColor: activeTheme.highlight,
                        borderRadius: 8
                      }}
                    >
                      <HStack className="items-center mb-1">
                        <Box className="w-5 h-5 rounded-full bg-indigo-50 items-center justify-center mr-2" style={{ borderWidth: 0.5, borderColor: 'rgba(80,70,200,0.15)' }}>
                          <Text className="text-xs text-indigo-600" style={{ fontWeight: '500' as any }}>{index + 1}</Text>
                        </Box>
                        <Text className="text-sm text-indigo-800" style={{ fontWeight: '450' as any, letterSpacing: -0.2 }}>Key Insight</Text>
                      </HStack>
                      <Text className="text-gray-700 ml-8" style={{ lineHeight: 21, opacity: 0.92 }}>{insight}</Text>
                    </Box>
                  </Animated.View>
                ))}
              </VStack>
            </Box>
          </Card>
        </Animated.View>
        
        {/* Action Items - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(6)]}>
          <Card className="mb-8 p-6 rounded-3xl bg-white border border-gray-100/30" style={[styles.premiumCard]}>
            <HStack className="items-center mb-5">
              <Box className="w-[1px] h-7 rounded-full bg-green-500 mr-2.5" />
              <Text className="text-xl text-gray-800 tracking-tight" style={{ letterSpacing: -0.6, fontWeight: '500' as any }}>Suggested Actions</Text>
            </HStack>
            <Box className="p-5 bg-gray-50/40 rounded-xl" style={{ 
              borderWidth: 0.5, 
              borderColor: 'rgba(225,225,230,0.3)', 
              backdropFilter: Platform.OS === 'web' ? 'blur(15px)' : undefined 
            }}>
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
                    <HStack key={index} className="items-center space-x-3 p-2 bg-white rounded-lg" style={{
                      borderWidth: 0.5,
                      borderColor: 'rgba(228,228,233,0.5)',
                      ...(Platform.OS === 'web' ? {
                        boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
                      } : {})
                    }}>
                      <Box 
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ 
                          backgroundColor: `${activeTheme.highlight}10`,
                          borderWidth: 0.5,
                          borderColor: `${activeTheme.highlight}30`
                        }}
                      >
                        <Text className="text-green-700" style={{ fontSize: 12, fontWeight: '500' as any }}>{index + 1}</Text>
                      </Box>
                      <Text className="text-gray-700 flex-1" style={{ letterSpacing: 0.1, lineHeight: 20, fontWeight: '450' as any }}>{action}</Text>
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
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    // For web platforms
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
      transition: 'all 0.2s ease-in-out'
    } : {})
  },
  // Ultra premium card with refined ultra-thin shadows for depth
  premiumCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
    borderColor: 'rgba(230,230,235,0.4)',
    // For web platforms - ultra-thin layered shadows for premium look
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 10px 25px -6px rgba(0, 0, 0, 0.015), 0 1px 2px rgba(0, 0, 0, 0.005), 0 20px 40px -20px rgba(50, 50, 93, 0.02)',
      transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)'
    } : {})
  },
  // Ultra-thin inner shadow for inset elements
  innerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 1,
    elevation: 0,
    // For web platforms
    ...(Platform.OS === 'web' ? {
      boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.01), inset 0 0 2px rgba(0, 0, 0, 0.005)'
    } : {})
  },
  // Ultra-thin sentiment meter with minimal glow
  sentimentMeter: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
    // Extra light shadows for web only
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 8px -5px rgba(0, 0, 0, 0.02), 0 0 1px rgba(0, 0, 0, 0.005)'
    } : {})
  },
  // Animated progress bar
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  // Web-specific ultra-thin hover effects applied dynamically via useHoverStyle
  cardHoverActive: Platform.OS === 'web' ? {
    transform: 'translateY(-1px) scale(1.003)',
    boxShadow: '0 10px 25px -8px rgba(0, 0, 0, 0.015), 0 2px 4px -2px rgba(0, 0, 0, 0.008)'
  } : {},
});

export default JournalInsightsView;
