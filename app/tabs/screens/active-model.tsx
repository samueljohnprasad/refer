import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { LOCAL_MODELS } from '@/src/constants/models';
import { useLocalModelSetting } from '@/src/hooks/useLocalModelSetting';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tick01Icon } from '@hugeicons/core-free-icons';
import * as Haptics from 'expo-haptics';

export default function ActiveModelScreen() {
  const { modelUrl, setModel, isLoading } = useLocalModelSetting();

  const handleSelectModel = async (url: string) => {
    Haptics.selectionAsync();
    await setModel(url);
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  const modelOptions = [
    {
      id: 'Llama 3.2 1B Instruct',
      url: LOCAL_MODELS.LLAMA_3_2_1B_INSTRUCT_Q3,
      description: 'Llama 3.2 quantized for smaller size and fast generation.',
    },
    {
      id: 'Qwen 2.5 1.5B Instruct',
      url: LOCAL_MODELS.QWEN_1_5B_INSTRUCT,
      description: 'Highly capable instruction-following model.',
    },
    {
      id: 'LFM 2.5 VL 450M',
      url: LOCAL_MODELS.LFM_2_5_VL_450M,
      description: 'Liquid AI\'s very fast small model.',
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Active AI Model', headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="body" className="mb-6 text-gray-500">
          Select the local AI model to use when Apple Intelligence is unavailable or FORCE_LOCAL_LLM is enabled.
        </Text>

        <View style={styles.listContainer}>
          {modelOptions.map((option, index) => {
            const isSelected = modelUrl === option.url;
            return (
              <Pressable
                key={option.url}
                style={[
                  styles.item,
                  index === 0 && styles.itemFirst,
                  index === modelOptions.length - 1 && styles.itemLast,
                ]}
                onPress={() => handleSelectModel(option.url)}
              >
                <View style={styles.itemContent}>
                  <Text variant="label" className="text-base text-gray-900 mb-1">
                    {option.id}
                  </Text>
                  <Text variant="caption" className="text-gray-500">
                    {option.description}
                  </Text>
                </View>
                {isSelected && (
                  <HugeiconsIcon icon={Tick01Icon} size={24} color="#4ADE80" />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  itemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  itemContent: {
    flex: 1,
    paddingRight: 16,
  },
});
