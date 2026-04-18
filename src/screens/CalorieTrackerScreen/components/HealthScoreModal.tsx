import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getScoreBgClass = (score: number): string => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

const getScoreTextClass = (score: number): string => {
  if (score >= 80) return 'text-green-700';
  if (score >= 60) return 'text-yellow-700';
  return 'text-red-700';
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface HealthScoreModalProps {
  visible: boolean;
  score: number;
  reasoning: string;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({
  visible,
  score,
  reasoning,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity
      className="flex-1 bg-black/50 justify-center items-center px-5"
      activeOpacity={1}
      onPress={onClose}
    >
      {/* Inner card — stops tap propagation */}
      <TouchableOpacity
        className="bg-white rounded-3xl p-6 w-full max-w-md"
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
      >
        {/* Title Row */}
        <View className="flex-row justify-between items-center mb-4">
          <Text
            style={{ fontSize: 22, fontFamily: 'CormorantSemiBold', color: '#1f2937' }}
          >
            Health Score Analysis
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Score Circle */}
        <View className="items-center py-4">
          <View
            className={`w-24 h-24 rounded-full items-center justify-center ${getScoreBgClass(score)}`}
          >
            <Text className={`text-4xl font-bold ${getScoreTextClass(score)}`}>
              {score}
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mt-2">out of 100</Text>
        </View>

        {/* Reasoning */}
        <View className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Text className="text-gray-900 font-semibold mb-2">Why this score?</Text>
          <Text className="text-gray-700 leading-6">{reasoning}</Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          className="bg-[#7B61FF] rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold">Got it!</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);
