import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Modal, 
  ScrollView, 
  Pressable, 
  Dimensions, 
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Text } from '@/components/ui/text';
import { MoodEntry } from '@/types/mentalHealth';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';

interface EntryDetailModalProps {
  entry: MoodEntry | null;
  isVisible: boolean;
  onClose: () => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  isVisible,
  onClose,
}) => {
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 200,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible && entry) {
      openModal();
    } else if (!isVisible) {
      closeModal();
    }
  }, [isVisible, entry]);

  const openModal = (): void => {
    translateY.setValue(Dimensions.get('window').height);
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 200,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = (): void => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: Dimensions.get('window').height,
        useNativeDriver: true,
        friction: 10,
        tension: 200,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!entry) return null;

  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: Record<string, string> = {
      anxious: '😟',
      calm: '😌',
      hopeful: '🌟',
      stressed: '😓',
      peaceful: '🕊️',
      grateful: '🙏',
      sad: '😢',
      excited: '🎉',
      neutral: '😐',
      confident: '💪',
      overwhelmed: '🤯',
      confused: '🤔',
    };
    return moodEmojis[mood] || '😐';
  };

  const getEntryTypeIcon = (type: 'voice' | 'text'): string => {
    return type === 'voice' ? 'mic' : 'edit-3';
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodIntensityColor = (intensity: number): { bg: string; text: string } => {
    if (intensity >= 8) return { bg: 'bg-green-100', text: 'text-green-800' };
    if (intensity >= 6) return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    if (intensity >= 4) return { bg: 'bg-orange-100', text: 'text-orange-800' };
    return { bg: 'bg-red-100', text: 'text-red-800' };
  };

  const intensityColors = getMoodIntensityColor(entry.moodIntensity);

  return (
    <Modal 
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Backdrop */}
        <Animated.View 
          className="absolute inset-0 bg-black"
          style={{ opacity: backdropOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5]
          })}}
        >
          <Pressable 
            className="flex-1" 
            onPress={closeModal}
          />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
          style={{
            transform: [{ translateY }],
            maxHeight: Dimensions.get('window').height * 0.9,
            minHeight: Dimensions.get('window').height * 0.6,
          }}
          {...panResponder.panHandlers}
        >
          {/* Handle Bar */}
          <View className="items-center py-3">
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-4 border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">
                {entry.aiTitle}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-sm text-gray-500">
                  {format(entry.timestamp, 'EEEE, MMMM d • h:mm a')}
                </Text>
                <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                <Feather 
                  name={getEntryTypeIcon(entry.entryType) as any} 
                  size={12} 
                  color="#6B7280" 
                />
                {entry.entryType === 'voice' && entry.duration && (
                  <Text className="text-sm text-gray-500 ml-1">
                    {formatDuration(entry.duration)}
                  </Text>
                )}
              </View>
            </View>
            
            <Pressable onPress={closeModal} className="p-2">
              <Feather name="x" size={24} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Mood & Intensity */}
            <View className="py-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                  Emotional State
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-3xl mr-3">
                    {getMoodEmoji(entry.primaryMood)}
                  </Text>
                  <View className={`px-3 py-2 rounded-full ${intensityColors.bg}`}>
                    <Text className={`text-sm font-semibold ${intensityColors.text}`}>
                      {entry.moodIntensity}/10
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text className="text-base text-gray-700 capitalize">
                Primary mood: <Text className="font-semibold">{entry.primaryMood}</Text>
              </Text>
            </View>

            {/* Emotion Tags */}
            <View className="pb-6 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Emotions Identified
              </Text>
              <View className="flex-row flex-wrap">
                {entry.emotions.map((emotion, index) => (
                  <View 
                    key={`${emotion}-${index}`}
                    className="bg-blue-50 rounded-full px-3 py-2 mr-2 mb-2"
                  >
                    <Text className="text-blue-700 text-sm font-medium capitalize">
                      {emotion}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Full Transcription */}
            <View className="py-6 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Full Entry
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4">
                <Text className="text-base text-gray-700 leading-7">
                  {entry.fullTranscription}
                </Text>
              </View>
            </View>

            {/* AI Suggestions */}
            <View className="py-6 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Therapeutic Suggestions
              </Text>
              <View className="space-y-3">
                {entry.aiSuggestions.map((suggestion, index) => (
                  <View 
                    key={index}
                    className="flex-row items-start bg-green-50 rounded-xl p-4"
                  >
                    <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Feather name="zap" size={12} color="#059669" />
                    </View>
                    <Text className="flex-1 text-gray-700 text-base leading-6">
                      {suggestion}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Reflection Prompts */}
            <View className="py-6 mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Reflection Questions
              </Text>
              <View className="space-y-3">
                {entry.reflectionPrompts.map((prompt, index) => (
                  <View 
                    key={index}
                    className="flex-row items-start bg-purple-50 rounded-xl p-4"
                  >
                    <View className="w-6 h-6 bg-purple-100 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Text className="text-purple-700 text-xs font-bold">
                        ?
                      </Text>
                    </View>
                    <Text className="flex-1 text-gray-700 text-base leading-6">
                      {prompt}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Privacy Notice */}
            <View className="py-4 border-t border-gray-100 mb-8">
              <View className="flex-row items-center justify-center">
                <Feather name="shield" size={16} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-2">
                  This entry is private and secure • Only visible to you
                </Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
