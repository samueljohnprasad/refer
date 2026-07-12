import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/src/components/ui/Text';

interface AILoadingIndicatorProps {
  readonly isGenerating: boolean;
  readonly downloadProgress?: number;
  readonly label?: string;
}

export const AILoadingIndicator: React.FC<AILoadingIndicatorProps> = ({
  isGenerating,
  downloadProgress = 0,
  label = 'Crafting options…',
}) => {
  if (!isGenerating) return null;

  const isDownloadingModel = downloadProgress > 0 && downloadProgress < 1;
  const pct = downloadProgress > 1 ? downloadProgress / 100 : downloadProgress;
  const totalGB = 1.72;
  const downloadedGB = (pct * totalGB).toFixed(2);
  
  const loadingText = isDownloadingModel
    ? `Downloading AI model (${downloadedGB}GB / ${totalGB}GB)…`
    : label;

  return (
    <View className="flex-row items-center mb-4">
      <ActivityIndicator size="small" color="#94A3B8" />
      <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
        {loadingText}
      </Text>
    </View>
  );
};
