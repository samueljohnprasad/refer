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

export const MatchingExercise = ({ payload, savedResponse, onInteraction }: MatchingExerciseProps): React.ReactElement => {
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
  const isReady = pairs.length > 0 && Object.keys(matches).length === pairs.length;

  useEffect(() => {
    if (savedResponse?.matches) {
      const isReadyOnLoad = pairs.length > 0 && Object.keys(savedResponse.matches).length === pairs.length;
      onInteraction({ matches: savedResponse.matches }, isReadyOnLoad);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMatches = (newMatches: Record<number, number>) => {
    setMatches(newMatches);
    const ready = pairs.length > 0 && Object.keys(newMatches).length === pairs.length;
    onInteraction({ matches: newMatches }, ready);
  };

  const handleLeftPress = (index: number) => {
    // If it's already matched, unmatch it
    if (matches[index] !== undefined) {
      const newMatches = { ...matches };
      delete newMatches[index];
      updateMatches(newMatches);
      setSelectedLeft(null);
      return;
    }

    if (selectedRight !== null) {
      // Pair them!
      const newMatches = { ...matches, [index]: selectedRight };
      updateMatches(newMatches);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setSelectedLeft(index === selectedLeft ? null : index);
    }
  };

  const handleRightPress = (index: number) => {
    // Find if this right item is already matched
    const matchedLeftIndex = Object.keys(matches).find(k => matches[Number(k)] === index);
    if (matchedLeftIndex !== undefined) {
      const newMatches = { ...matches };
      delete newMatches[Number(matchedLeftIndex)];
      updateMatches(newMatches);
      setSelectedRight(null);
      return;
    }

    if (selectedLeft !== null) {
      // Pair them!
      const newMatches = { ...matches, [selectedLeft]: index };
      updateMatches(newMatches);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setSelectedRight(index === selectedRight ? null : index);
    }
  };

  // Helper to get match sequence number (1-based)
  const getMatchNumber = (leftIndex: number) => {
    const keys = Object.keys(matches).map(Number).sort((a, b) => a - b);
    const pos = keys.indexOf(leftIndex);
    return pos >= 0 ? pos + 1 : null;
  };
  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
       <Text>Matching Exercise Setup</Text>
    </ScrollView>
  );
};
