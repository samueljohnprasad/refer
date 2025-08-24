import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Easing, Platform, TouchableOpacity, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { TextAnalysisResult } from '@/utils/textAnalysisService';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
          <Text className="w-6 mr-2 text-xl">{getEmotionIcon()}</Text>
          <Text className="text-sm text-gray-700 tracking-wide capitalize" style={{ fontWeight: '450' as any, letterSpacing: 0.1 }}>{emotion}</Text>
        </HStack>
        <Text className="text-sm" style={{color, fontWeight: '500' as any}}>{percentage}</Text>
      </HStack>
      <Box 
        className="h-1 w-full bg-gray-50 rounded-full overflow-hidden"
        style={{
          backgroundColor: '#fafafa',
          borderWidth: 0.5,
          borderColor: 'rgba(230,230,235,0.4)',
          ...(Platform.OS === 'web' ? {
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.01)'
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
  onClose?: () => void;
  onEdit?: () => void;
}

const JournalInsightsView: React.FC<JournalInsightsViewProps> = ({ transcripts, analysisResult, onClose, onEdit }) => {
  const activeTheme = useSeasonalTheme();
  const insets = useSafeAreaInsets();
  
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
  
  // Format current date for display
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Count words in transcripts
  const wordCount = transcripts.join(' ').split(/\s+/).filter((word: string) => word.length > 0).length || 0;

  // Render feeling tags
  const renderFeelingTags = () => {
    const feelings = [
      { emoji: '😫', label: 'Unwell' },
      { emoji: '😔', label: 'Pain' }
    ];
    
    return (
      <>
        <Text className="text-gray-400 uppercase text-xs mt-6 mb-2">FEELINGS</Text>
        <HStack className="flex-wrap">
          {feelings.map((feeling, index) => (
            <Box 
              key={index}
              className="bg-white mr-2 mb-2 rounded-full px-4 py-2 flex-row items-center"
              style={{ 
                borderWidth: 0.2, 
                borderColor: 'rgba(0,0,0,0.1)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 1,
                elevation: 1,
              }}
            >
              <Text className="mr-2 text-base">{feeling.emoji}</Text>
              <Text className="text-gray-700">{feeling.label}</Text>
            </Box>
          ))}
        </HStack>
      </>
    );
  };
  
  // Render photos section
  const renderPhotosSection = () => {
    return (
      <>
        <Text className="text-gray-400 uppercase text-xs mt-6 mb-2">PHOTOS TO REMEMBER</Text>
        <TouchableOpacity 
          className="bg-white h-20 w-20 rounded-lg items-center justify-center"
          style={{ 
            borderWidth: 0.2, 
            borderColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <AntDesign name="plus" size={24} color="#999" />
        </TouchableOpacity>
      </>
    );
  };

  // Render transcript section
  const renderTranscriptSection = () => {
    return (
      <>
        <Text className="text-gray-400 uppercase text-xs mt-6 mb-2">
          TRANSCRIPT ({wordCount} words)
        </Text>
        <VStack className="mt-1">
          {transcripts.map((text, index) => (
            <Text key={index} className="text-gray-800 text-base leading-6 mb-2">
              {text}
            </Text>
          ))}
        </VStack>
      </>
    );
  };
  
  // Render audio controls
  const renderAudioControls = () => {
    return (
      <Box 
        style={styles.audioControls}
        className="w-full absolute bottom-0 px-5 pt-3"
      >
        <Box className="w-full flex-row items-center justify-center">
          <TouchableOpacity 
            className="bg-black h-14 w-14 rounded-full items-center justify-center mr-3"
            style={{ shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4 }}
          >
            <AntDesign name="caretright" size={24} color="white" />
          </TouchableOpacity>
          
          <Box className="flex-1 h-10 justify-center">
            <Box className="h-[1px] bg-gray-300" />
            <Box className="h-6 w-20 bg-gray-800 absolute opacity-40" />
            
            <Text className="absolute right-0 text-gray-500 text-xs">
              00:05
            </Text>
          </Box>
        </Box>
        
        {/* Bottom pill indicator */}
        <Box className="w-full items-center pt-4">
          <Box className="w-10 h-1 bg-gray-800 rounded-full opacity-20" />
        </Box>
      </Box>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Close, Title and Edit */}
      <Box className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={onClose}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{ borderWidth: 0.2, borderColor: 'rgba(0,0,0,0.1)' }}
        >
          <Text className="text-2xl font-light">×</Text>
        </TouchableOpacity>
        
        <Box className="items-center">
          <Text className="text-lg font-semibold">Today</Text>
          <Text className="text-sm text-gray-400">{formattedTime}</Text>
        </Box>
        
        <TouchableOpacity 
          onPress={onEdit}
          className="w-16 h-10 rounded-full bg-white items-center justify-center"
          style={{ borderWidth: 0.2, borderColor: 'rgba(0,0,0,0.1)' }}
        >
          <Text className="font-medium">Edit</Text>
        </TouchableOpacity>
      </Box>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Emoji/Avatar */}
        <Box className="items-center mt-4 mb-3">
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>😑</Text>
            <Box className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-100">
              <View style={{ width: 10, height: 10 }} />
            </Box>
          </View>
        </Box>
        
        {/* Title with emojis */}
        <Text className="text-3xl font-bold text-center mb-4">
          {analysisResult.summary?.slice(0, 30)}... <Text>🤢😅</Text>
        </Text>
        
        {/* Feeling Tags */}
        {renderFeelingTags()}
        
        {/* Photos Section */}
        {renderPhotosSection()}
        
        {/* Transcript Section */}
        {renderTranscriptSection()}
        
        {/* Sentiment Analysis Card */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(2)]}>  
          <Card className="mb-6 p-5 rounded-2xl bg-white" style={[styles.premiumCard]}>
            <HStack className="items-center mb-3">
              <Box className="w-[0.5px] h-6 rounded-full bg-blue-500 mr-2" />
              <Text className="text-lg text-gray-800" style={{ letterSpacing: -0.4, fontWeight: '500' as any }}>Sentiment</Text>
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
                  style={{ color: getSentimentColor(), fontWeight: '450' as any, letterSpacing: -0.4 }}
                >
                  {analysisResult.sentiment.label}
                </Text>
                <Text className="text-xs text-gray-500 mt-1" style={{ letterSpacing: 0.3, opacity: 0.7 }}>Overall Mood</Text>
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
                <Text className="text-2xl" style={{ letterSpacing: -0.7, fontWeight: '450' as any, color: getSentimentColor() }}>
                  {Math.round((analysisResult.sentiment.score + 1) * 50)}
                </Text>
                <Text className="text-xs text-gray-500" style={{ letterSpacing: 0.2, opacity: 0.7 }}>Score</Text>
              </Box>
            </HStack>
          </Card>
        </Animated.View>
        
        {/* Emotions Analysis - Enhanced */}
        <Animated.View style={[styles.cardContainer, getAnimatedStyle(3)]}>
          <Card className="mb-6 p-5 rounded-2xl bg-white" style={[styles.premiumCard]}>
            <HStack className="items-center mb-3">
              <Box className="w-[0.5px] h-6 rounded-full bg-red-500 mr-2" />
              <Text className="text-lg text-gray-800" style={{ letterSpacing: -0.4, fontWeight: '500' as any }}>Emotions</Text>
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
          <Card className="mb-6 p-5 rounded-2xl bg-white" style={[styles.premiumCard]}>
            <HStack className="items-center mb-3">
              <Box className="w-[0.5px] h-6 rounded-full bg-yellow-500 mr-2" />
              <Text className="text-lg text-gray-800" style={{ letterSpacing: -0.4, fontWeight: '500' as any }}>Key Topics</Text>
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
                          backgroundColor: `hsl(${hueRotate}, 85%, 98%)`,
                          borderWidth: 0.5,
                          borderColor: `hsl(${hueRotate}, 70%, 90%)`,
                          backdropFilter: Platform.OS === 'web' ? 'blur(5px)' : undefined,
                          ...(Platform.OS === 'web' ? {
                            boxShadow: '0 1px 1px rgba(0,0,0,0.005)',
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
          <Card className="mb-6 p-5 rounded-2xl bg-white" style={[styles.premiumCard]}>
            <HStack className="items-center mb-3">
              <Box className="w-[0.5px] h-6 rounded-full bg-indigo-500 mr-2" />
              <Text className="text-lg text-gray-800" style={{ letterSpacing: -0.4, fontWeight: '500' as any }}>Insights</Text>
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
                        borderLeftWidth: 1,
                        borderColor: activeTheme.highlight,
                        borderRadius: 8,
                        backdropFilter: Platform.OS === 'web' ? 'blur(8px)' : undefined
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
          <Card className="mb-6 p-5 rounded-2xl bg-white" style={[styles.premiumCard]}>
            <HStack className="items-center mb-3">
              <Box className="w-[0.5px] h-6 rounded-full bg-green-500 mr-2" />
              <Text className="text-lg text-gray-800" style={{ letterSpacing: -0.4, fontWeight: '500' as any }}>Suggested Actions</Text>
            </HStack>
            <Box className="p-5 bg-gray-50/40 rounded-xl" style={{ 
              borderWidth: 0.5, 
              borderColor: 'rgba(225,225,230,0.3)', 
              backdropFilter: Platform.OS === 'web' ? 'blur(15px)' : undefined 
            }}>
              <VStack className="space-y-4">
                {analysisResult.actionItems?.map((action: string, index: number) => (
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
                    <HStack key={index} className="items-center space-x-3 p-2.5 bg-white/95 rounded-lg" style={{
                      borderWidth: 0.5,
                      borderColor: 'rgba(228,228,233,0.4)',
                      backdropFilter: Platform.OS === 'web' ? 'blur(10px)' : undefined,
                      ...(Platform.OS === 'web' ? {
                        boxShadow: '0 1px 1px rgba(0,0,0,0.005)'
                      } : {})
                    }}>
                      <Box 
                        className="w-7 h-7 rounded-full items-center justify-center"
                        style={{ 
                          backgroundColor: `${activeTheme.highlight}05`,
                          borderWidth: 0.5,
                          borderColor: `${activeTheme.highlight}20`
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
      </ScrollView>
      
      {/* Audio Controls */}
      {renderAudioControls()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EE',
    borderRadius: 30,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F3EE',
    borderRadius: 30,
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  premiumCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderColor: 'rgba(230,230,235,0.4)',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
      transition: 'all 0.2s ease-in-out'
    } : {})
  },
  innerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.005,
    shadowRadius: 1,
    elevation: 0,
    ...(Platform.OS === 'web' ? {
      boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.005), inset 0 0 1px rgba(0, 0, 0, 0.003)'
    } : {})
  },
  audioControls: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F3EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 -1px 3px rgba(0,0,0,0.03)'
      }
    })
  },
  emojiContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFD699',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }
    })
  },
  emoji: {
    fontSize: 36,
    lineHeight: 40,
  },
  // Web-specific ultra-thin hover effects applied dynamically via useHoverStyle
  cardHoverActive: Platform.OS === 'web' ? {
    transform: 'translateY(-1px) scale(1.003)',
    boxShadow: '0 10px 25px -8px rgba(0, 0, 0, 0.015), 0 2px 4px -2px rgba(0, 0, 0, 0.008)'
  } : {},
  playButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 15
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    width: '30%',
    backgroundColor: '#3182CE',
    borderRadius: 2,
  },
});

export default JournalInsightsView;
