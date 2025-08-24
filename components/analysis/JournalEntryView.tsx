import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

interface JournalEntryViewProps {
  title?: string;
  date?: Date;
  transcripts?: string[];
  onClose?: () => void;
  onEdit?: () => void;
}

const JournalEntryView: React.FC<JournalEntryViewProps> = ({
  title = 'Stomach Ache',
  date = new Date(),
  transcripts = ['I am not feeling good.', 'My stomach is hurting.'],
  onClose,
  onEdit
}) => {
  const insets = useSafeAreaInsets();
  
  // Format time for display
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  // Count words in transcript
  const wordCount = transcripts?.join(' ').split(/\\s+/).filter(word => word.length > 0).length || 0;

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
        style={[styles.audioControls, { paddingBottom: insets.bottom ? insets.bottom + 8 : 20 }]}
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
    <Box style={[
      styles.container, 
      { 
        paddingTop: insets.top,
        paddingBottom: 80, // Extra space for audio controls
      }
    ]}>
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
      
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
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
          {title} <Text>🤢😅</Text>
        </Text>
        
        {/* Feeling Tags */}
        {renderFeelingTags()}
        
        {/* Photos Section */}
        {renderPhotosSection()}
        
        {/* Transcript Section */}
        {renderTranscriptSection()}
        
        {/* Extra padding for audio controls */}
        <Box style={{ height: 80 }} />
      </ScrollView>
      
      {/* Audio Controls */}
      {renderAudioControls()}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EE',
    borderRadius: 30,
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
    }),
  },
  emoji: {
    fontSize: 36,
  },
  audioControls: {
    backgroundColor: '#F5F3EE',
    borderTopWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.05)',
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
    }),
  },
});

export default JournalEntryView;
