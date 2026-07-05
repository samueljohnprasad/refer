import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { Card } from '@/src/components/ui/Card';

type Pair = { left: string; right: string };

export const MatchingExercise = ({ payload, savedResponse, onInteraction }: any) => {
  const { prompt, pairs = [] } = payload.content || {};

  // State
  const [shuffledRights, setShuffledRights] = useState<Pair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  // Matches: map of leftIndex -> rightIndex
  const [matches, setMatches] = useState<Record<number, number>>(savedResponse?.matches || {});

  // Shuffle right items on mount
  useEffect(() => {
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setShuffledRights(shuffled);
  }, []);
  
  // Validation check
  const isReady = Object.keys(matches).length === pairs.length;

  useEffect(() => {
    if (savedResponse?.matches) {
      onInteraction({ matches: savedResponse.matches }, Object.keys(savedResponse.matches).length === pairs.length);
    }
  }, []);

  // We will add interaction handlers here...

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
       <Text>Matching Exercise Setup</Text>
    </ScrollView>
  );
};
