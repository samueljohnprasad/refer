import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { Card } from '@/src/components/ui/Card';

type Pair = { left: string; right: string };

const EMPTY_PAIRS: Pair[] = [];

interface MatchingExerciseProps {
  payload: {
    content?: {
      prompt?: string;
      pairs?: Pair[];
    };
  };
  savedResponse?: {
    matches?: Record<number, number>;
  };
  onInteraction: (response: { matches: Record<number, number> }, isReady: boolean) => void;
}

export const MatchingExercise = ({ payload, savedResponse, onInteraction }: MatchingExerciseProps) => {
  const { prompt, pairs = EMPTY_PAIRS } = payload.content || {};

  // State
  const [shuffledRights, setShuffledRights] = useState<Pair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  // Matches: map of leftIndex -> rightIndex
  const [matches, setMatches] = useState<Record<number, number>>(savedResponse?.matches || {});

  // Shuffle right items on mount or when pairs change
  useEffect(() => {
    const shuffled = [...pairs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledRights(shuffled);
  }, [pairs]);
  
  // Validation check
  const isReady = Object.keys(matches).length === pairs.length;

  useEffect(() => {
    if (savedResponse?.matches) {
      onInteraction({ matches: savedResponse.matches }, Object.keys(savedResponse.matches).length === pairs.length);
    }
  }, [savedResponse?.matches, onInteraction, pairs.length]);

  // We will add interaction handlers here...

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
       <Text>Matching Exercise Setup</Text>
    </ScrollView>
  );
};
