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

  const handleOptionPress = (option: OptionItem) => {
    if (isProcessing || unmatchedConcepts.length === 0) return;
    
    const activeConcept = unmatchedConcepts[0];
    setIsProcessing(true);

    if (option.pairIndex === activeConcept.pairIndex) {
      // Correct match
      setMatchedId(option.id);
      
      setTimeout(() => {
        const newMatches = { ...matches, [activeConcept.pairIndex]: option.pairIndex };
        setMatches(newMatches);
        
        const nextConcepts = unmatchedConcepts.slice(1);
        const nextOptions = unmatchedOptions.filter(o => o.id !== option.id);
        
        setUnmatchedConcepts(nextConcepts);
        setUnmatchedOptions(nextOptions);
        setMatchedId(null);
        setIsProcessing(false);
        
        const isReady = nextConcepts.length === 0;
        onInteraction({ matches: newMatches }, isReady);
      }, 500);
    } else {
      // Incorrect match
      setSelectedWrongId(option.id);
      setTimeout(() => {
        setSelectedWrongId(null);
        setIsProcessing(false);
      }, 500);
    }
  };

  const activeConcept = unmatchedConcepts[0];

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

      {activeConcept ? (
        <View className="pb-12">
          {/* Active Concept Banner */}
          <View className="mb-6 bg-slate-100 border-2 border-slate-300 rounded-2xl p-5 items-center">
            <Text variant="body" className="font-bold text-center text-slate-800 text-lg">
              {activeConcept.text}
            </Text>
          </View>

          {/* Options List */}
          <View className="flex-col gap-4">
            {unmatchedOptions.map((option) => {
              const isMatched = matchedId === option.id;
              const isWrong = selectedWrongId === option.id;
              
              // We'll map visually via existing variants. 'answer-selected' (green/sage) for match, 
              // and standard 'answer' for neutral. For wrong, we can just use a slightly different border
              // or let standard handle it for now since we have safe failure.
              
              let variant: 'answer' | 'answer-selected' = 'answer';
              if (isMatched) variant = 'answer-selected';
              
              return (
                <Card
                  key={option.id}
                  variant={variant}
                  onPress={() => handleOptionPress(option)}
                  disabled={isProcessing}
                  contentClassName="p-4 min-h-[80px] justify-center"
                  className={isWrong ? 'opacity-70' : ''}
                >
                  <Text className="text-sm font-medium text-slate-700 text-center">
                    {option.text}
                  </Text>
                </Card>
              );
            })}
          </View>
        </View>
      ) : (
        <View className="pb-12 items-center justify-center py-10">
          <Text variant="h3" color="ink" className="text-center font-bold">
            All matched!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
