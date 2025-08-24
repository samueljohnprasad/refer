import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnalysisProgress } from '@/utils/textAnalysisService';
import { Box } from '@/components/ui/box';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { CheckIcon, CloudIcon, BrainIcon, LightBulbIcon, XIcon } from '@/assets/Icons';

interface ProcessingStageIndicatorProps {
  progress: AnalysisProgress;
}

const ProcessingStageIndicator: React.FC<ProcessingStageIndicatorProps> = ({ progress }) => {
  const getStageIcon = () => {
    switch (progress.stage) {
      case 'transcribing':
        return <CloudIcon size={24} color="#4299E1" />;
      case 'analyzing':
        return <BrainIcon size={24} color="#4299E1" />;
      case 'generating-insights':
        return <LightBulbIcon size={24} color="#4299E1" />;
      case 'complete':
        return <CheckIcon size={24} color="#48BB78" />;
      case 'error':
        return <XIcon size={24} color="#E53E3E" />;
      default:
        return null;
    }
  };

  const getStageTitle = () => {
    switch (progress.stage) {
      case 'transcribing':
        return 'Transcribing';
      case 'analyzing':
        return 'Analyzing';
      case 'generating-insights':
        return 'Generating Insights';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  const getProgressColor = () => {
    switch (progress.stage) {
      case 'complete':
        return '#48BB78'; // green
      case 'error':
        return '#E53E3E'; // red
      default:
        return '#4299E1'; // blue
    }
  };

  return (
    <Box className="rounded-lg bg-white/90 p-4 my-4 shadow-sm w-full">
      <Box className="flex flex-row items-center mb-2">
        <Box className="mr-3">
          {getStageIcon()}
        </Box>
        <Box className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {getStageTitle()}
          </Text>
          <Text className="text-sm text-gray-600">{progress.message}</Text>
        </Box>
      </Box>
      
      <Progress 
        value={progress.progress} 
        max={100} 
        className="h-2 rounded-full overflow-hidden bg-gray-200"
      >
        <ProgressFilledTrack 
          style={{ backgroundColor: getProgressColor() }}
        />
      </Progress>
      
      {progress.error && (
        <Box className="mt-2 p-3 bg-red-50 rounded border-l-4 border-red-500">
          <Text className="text-red-700">{progress.error}</Text>
        </Box>
      )}
    </Box>
  );
};

export default ProcessingStageIndicator;
