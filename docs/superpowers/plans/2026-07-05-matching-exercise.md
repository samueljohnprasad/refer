# Matching Exercise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the MatchingExercise screen using a two-column, tap-to-match interaction pattern with numerical badges for paired items.

**Architecture:** We will replace the placeholder in `MatchingExercise.tsx` with a fully functional UI that leverages local state to track selections and matches, randomizes the right-side options on mount, and communicates with `NodeEngine` when all matches are correctly paired.

**Tech Stack:** React Native, NativeWind (Tailwind), React Hooks.

## Global Constraints

- Must use existing UI components (`Text`, `Card`, `Mascot`).
- Code must be written in TypeScript with proper typing.
- Layout must be mobile-friendly and accessible (no complex drag-and-drop).
- The `isReady` flag must only be true when all pairs have been matched.

---

### Task 1: Setup State and Helper Functions

**Files:**
- Modify: `src/components/exercise/MatchingExercise.tsx:1-27`

**Interfaces:**
- Consumes: `payload.content.pairs` (array of `{ left: string, right: string }`).
- Produces: State management for `selectedLeft`, `selectedRight`, `matches`, and `shuffledRights`.

- [ ] **Step 1: Replace placeholder code with full imports and initial state setup**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/exercise/MatchingExercise.tsx
git commit -m "feat: setup state for MatchingExercise"
```

---

### Task 2: Implement Interaction Handlers

**Files:**
- Modify: `src/components/exercise/MatchingExercise.tsx`

**Interfaces:**
- Consumes: State variables.
- Produces: Functions `handleLeftPress` and `handleRightPress` to manage pairing logic.

- [ ] **Step 1: Add interaction logic**

Insert these functions right before the `return` statement:

```tsx
  const updateMatches = (newMatches: Record<number, number>) => {
    setMatches(newMatches);
    const ready = Object.keys(newMatches).length === pairs.length;
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
    const keys = Object.keys(matches).map(Number).sort();
    const pos = keys.indexOf(leftIndex);
    return pos >= 0 ? pos + 1 : null;
  };
```

- [ ] **Step 2: Commit**

```bash
git add src/components/exercise/MatchingExercise.tsx
git commit -m "feat: add selection and pairing logic for MatchingExercise"
```

---

### Task 3: Render the UI Layout

**Files:**
- Modify: `src/components/exercise/MatchingExercise.tsx`

**Interfaces:**
- Consumes: Helper functions and state.
- Produces: The final visual rendering of the Mascot and two-column grid.

- [ ] **Step 1: Replace the return block with the full UI**

```tsx
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
              className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200 rounded-bl-[4px]" 
              style={{ transform: [{ rotate: '45deg' }] }} 
            />
            <Text variant="body" color="ink" className="leading-relaxed text-base font-medium">
              {prompt}
            </Text>
          </View>
        </View>
      )}

      <View className="flex-row gap-4 pb-12">
        {/* Left Column */}
        <View className="flex-1 flex-col gap-4">
          {pairs.map((pair: Pair, index: number) => {
            const isSelected = selectedLeft === index;
            const matchNumber = getMatchNumber(index);
            const isMatched = matchNumber !== null;

            return (
              <Card
                key={`left-${index}`}
                variant={isSelected ? 'answer-selected' : isMatched ? 'secondary' : 'answer'}
                onPress={() => handleLeftPress(index)}
                contentClassName="p-4 relative min-h-[100px] justify-center"
              >
                <Text className={`text-sm font-medium ${isMatched ? 'text-slate-500' : 'text-slate-700'}`}>
                  {pair.left}
                </Text>
                {isMatched && (
                  <View className="absolute -top-2 -right-2 w-6 h-6 bg-sage-500 rounded-full items-center justify-center border-2 border-white">
                    <Text className="text-white text-xs font-bold">{matchNumber}</Text>
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        {/* Right Column */}
        <View className="flex-1 flex-col gap-4">
          {shuffledRights.map((pair: Pair, index: number) => {
            const isSelected = selectedRight === index;
            // Find if this right item is matched to any left item
            const matchedLeftIndex = Object.keys(matches).find(k => matches[Number(k)] === index);
            const isMatched = matchedLeftIndex !== undefined;
            const matchNumber = isMatched ? getMatchNumber(Number(matchedLeftIndex)) : null;

            return (
              <Card
                key={`right-${index}`}
                variant={isSelected ? 'answer-selected' : isMatched ? 'secondary' : 'answer'}
                onPress={() => handleRightPress(index)}
                contentClassName="p-4 relative min-h-[100px] justify-center"
              >
                <Text className={`text-sm font-medium ${isMatched ? 'text-slate-500' : 'text-slate-700'}`}>
                  {pair.right}
                </Text>
                {isMatched && (
                  <View className="absolute -top-2 -right-2 w-6 h-6 bg-sage-500 rounded-full items-center justify-center border-2 border-white">
                    <Text className="text-white text-xs font-bold">{matchNumber}</Text>
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
```

- [ ] **Step 2: Commit**

```bash
git add src/components/exercise/MatchingExercise.tsx
git commit -m "feat: build UI rendering for MatchingExercise"
```
