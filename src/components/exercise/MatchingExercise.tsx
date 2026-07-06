import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { Card } from '@/src/components/ui/Card';

type Pair = { left: string; right: string };

const EMPTY_PAIRS: Pair[] = [];

interface MatchingExerciseProps {
  payload: {
    title?: string;
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

type ConceptItem = { id: string; text: string; pairIndex: number };
type OptionItem = { id: string; text: string; pairIndex: number };

export const MatchingExercise = ({ payload, savedResponse, onInteraction }: MatchingExerciseProps): React.ReactElement => {
  const { prompt, pairs = EMPTY_PAIRS } = payload.content || {};

  // State
  const [unmatchedConcepts, setUnmatchedConcepts] = useState<ConceptItem[]>([]);
  const [unmatchedOptions, setUnmatchedOptions] = useState<OptionItem[]>([]);
  const [matches, setMatches] = useState<Record<number, number>>({});
  
  // Feedback state
  const [selectedWrongId, setSelectedWrongId] = useState<string | null>(null);
  const [matchedId, setMatchedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize and shuffle options on mount
  useEffect(() => {
    if (pairs.length === 0) return;

    let initialMatches: Record<number, number> = {};
    if (savedResponse?.matches) {
      initialMatches = savedResponse.matches;
      setMatches(initialMatches);
      
      const isReadyOnLoad = Object.keys(initialMatches).length === pairs.length;
      onInteraction({ matches: initialMatches }, isReadyOnLoad);
    }

    // Build concepts and options excluding already matched ones
    const concepts: ConceptItem[] = [];
    const options: OptionItem[] = [];
    
    pairs.forEach((pair, index) => {
      if (initialMatches[index] === undefined) {
        concepts.push({ id: `concept-${index}`, text: pair.left, pairIndex: index });
        options.push({ id: `option-${index}`, text: pair.right, pairIndex: index });
      }
    });

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    setUnmatchedConcepts(concepts);
    setUnmatchedOptions(options);
  }, [pairs, savedResponse]);

  const updateMatches = (newMatchedIndices: Set<number>) => {
    setMatchedIndices(newMatchedIndices);
    
    // Construct the matches record (mapping pairIndex -> pairIndex)
    const matchesRecord: Record<number, number> = {};
    newMatchedIndices.forEach(index => {
      matchesRecord[index] = index;
    });

    const isReady = pairs.length > 0 && newMatchedIndices.size === pairs.length;
    onInteraction({ matches: matchesRecord }, isReady);
  };

  const handleTilePress = (tile: Tile) => {
    if (matchedIndices.has(tile.pairIndex)) return;

    if (selectedTileId === null) {
      // First selection
      setSelectedTileId(tile.id);
    } else if (selectedTileId === tile.id) {
      // Deselect
      setSelectedTileId(null);
    } else {
      // Second selection, check for match
      const selectedTile = tiles.find(t => t.id === selectedTileId);
      if (selectedTile && selectedTile.pairIndex === tile.pairIndex) {
        // Match!
        const newMatchedIndices = new Set(matchedIndices);
        newMatchedIndices.add(tile.pairIndex);
        updateMatches(newMatchedIndices);
        setSelectedTileId(null);
      } else {
        // Mismatch - just switch selection to the new tile (or could show error state)
        setSelectedTileId(tile.id);
      }
    }
  };

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Match the Concepts"}
        </Text>
      </View>

      {prompt && (
        <View className="flex-row items-start mb-8">
          <View className="mr-4 mt-2 z-10">
            <Mascot state="panda-happy" size={80} />
          </View>
          <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-slate-200 relative">
            <View 
              className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200 rounded-bl-[4px] rotate-45" 
            />
            <Text variant="body" color="ink" className="leading-relaxed text-base font-medium">
              {prompt}
            </Text>
          </View>
        </View>
      )}

      <View className="flex-row flex-wrap justify-between pb-12">
        {tiles.map((tile) => (
          <MatchCard
            key={tile.id}
            text={tile.text}
            isSelected={selectedTileId === tile.id}
            isMatched={matchedIndices.has(tile.pairIndex)}
            onPress={() => handleTilePress(tile)}
          />
        ))}
      </View>
    </ScrollView>
  );
};
