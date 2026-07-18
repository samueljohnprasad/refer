# Timeline iMessage Stack Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `@expo/ui/swift-ui` `BottomSheet` containing `IMessageStack` to `TimelinesScreen`, triggering when user taps any insight card across `Days`, `Weeks`, or `Months` timeline tabs.

**Architecture:** Top-level modal state (`isStackModalOpen`) lives inside `TimelinesScreen` (`app/tabs/screens/timelines.tsx`), mounting a single `<Host><BottomSheet ...><IMessageStack /></BottomSheet></Host>`. Callback `onOpenModal` is passed to `DaysTimelineTab`, `WeeksTimelineTab`, and `MonthsTimelineTab`, which attach it to `DailyInsightCard` via `Pressable`.

**Tech Stack:** React Native, Expo Router, TypeScript, `@expo/ui/swift-ui`, Tailwind CSS (`className`).

## Global Constraints

- TypeScript strict mode: keep all new/modified code strictly typed without `any`.
- Must use existing `@expo/ui/swift-ui` (`Host`, `BottomSheet`) and `modifiers` (`presentationDetents`, `presentationDragIndicator`).
- No placeholder code. Complete drop-in code required.

---

### Task 1: Add `onPress` to `DailyInsightCard`

**Files:**
- Modify: `src/screens/Timelines/components/DailyInsightCard.tsx:1-19`

**Interfaces:**
- Consumes: `insight: { summary: string }`
- Produces: `DailyInsightCardProps` interface accepting `onPress?: () => void`

- [ ] **Step 1: Check existing `DailyInsightCard.tsx` structure**

Run: `cat src/screens/Timelines/components/DailyInsightCard.tsx`
Expected: shows current `DailyInsightCard` component with `DailyInsightCardProps`.

- [ ] **Step 2: Implement `onPress` prop and `Pressable` wrapper in `DailyInsightCard.tsx`**

Replace the contents of `src/screens/Timelines/components/DailyInsightCard.tsx` with:

```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface DailyInsightCardProps {
  insight: {
    summary: string;
  };
  onPress?: () => void;
}

export const DailyInsightCard = ({ insight, onPress }: DailyInsightCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-80 active:scale-[0.995]"
    >
      <View className="bg-white rounded-[24px] p-6 dark:bg-gray-900">
        <Text className="text-[17px] font-normal text-[#1A1A1A] dark:text-gray-100 leading-[28px] tracking-tight">
          {insight.summary}
        </Text>
      </View>
    </Pressable>
  );
};
```

- [ ] **Step 3: Run TypeScript compiler to verify no type errors introduced**

Run: `npx tsc --noEmit`
Expected: PASS (`DailyInsightCard` compiled cleanly without type errors).

- [ ] **Step 4: Commit Task 1**

```bash
git add src/screens/Timelines/components/DailyInsightCard.tsx
git commit -m "feat(timelines): add onPress prop to DailyInsightCard for tap interactions"
```

---

### Task 2: Add `onOpenModal` to Timeline Tabs (`DaysTimelineTab`, `WeeksTimelineTab`, `MonthsTimelineTab`)

**Files:**
- Modify: `src/screens/Timelines/tabs/DaysTimelineTab.tsx:259-339`
- Modify: `src/screens/Timelines/tabs/WeeksTimelineTab.tsx:160-169`
- Modify: `src/screens/Timelines/tabs/MonthsTimelineTab.tsx:135-142`

**Interfaces:**
- Consumes: `DailyInsightCardProps` (`onPress?: () => void`)
- Produces: `DaysTimelineTab`, `WeeksTimelineTab`, `MonthsTimelineTab` accepting `onOpenModal?: () => void` prop.

- [ ] **Step 1: Update `DaysTimelineTab.tsx` to accept `onOpenModal` and pass to `DailyInsightCard`**

In `src/screens/Timelines/tabs/DaysTimelineTab.tsx`, update the component definition and `renderTimelineItem`:

```tsx
export interface TimelineTabProps {
  onOpenModal?: () => void;
}

export const DaysTimelineTab = ({ onOpenModal }: TimelineTabProps) => {
```

And inside `renderTimelineItem`:

```tsx
    if (item.aiInsight) {
      return <DailyInsightCard insight={item.aiInsight} onPress={onOpenModal} />;
    }
```

- [ ] **Step 2: Update `WeeksTimelineTab.tsx` to accept `onOpenModal` and pass to `DailyInsightCard`**

Check exact lines around export of `WeeksTimelineTab` in `src/screens/Timelines/tabs/WeeksTimelineTab.tsx`:
Run: `grep -n "export const WeeksTimelineTab" src/screens/Timelines/tabs/WeeksTimelineTab.tsx`

Add `TimelineTabProps` interface and pass `onPress={onOpenModal}` inside `renderTimelineItem` or JSX where `DailyInsightCard` is rendered in `WeeksTimelineTab.tsx`.

- [ ] **Step 3: Update `MonthsTimelineTab.tsx` to accept `onOpenModal` and pass to `DailyInsightCard`**

Check exact lines around export of `MonthsTimelineTab` in `src/screens/Timelines/tabs/MonthsTimelineTab.tsx`:
Run: `grep -n "export const MonthsTimelineTab" src/screens/Timelines/tabs/MonthsTimelineTab.tsx`

Add `TimelineTabProps` interface and pass `onPress={onOpenModal}` inside `renderTimelineItem` or JSX where `DailyInsightCard` is rendered in `MonthsTimelineTab.tsx`.

- [ ] **Step 4: Run TypeScript compiler to verify tabs compile cleanly**

Run: `npx tsc --noEmit`
Expected: PASS (all 3 tabs support `onOpenModal` without type errors).

- [ ] **Step 5: Commit Task 2**

```bash
git add src/screens/Timelines/tabs/DaysTimelineTab.tsx src/screens/Timelines/tabs/WeeksTimelineTab.tsx src/screens/Timelines/tabs/MonthsTimelineTab.tsx
git commit -m "feat(timelines): connect onOpenModal prop to insight cards across Days, Weeks, and Months tabs"
```

---

### Task 3: Integrate `@expo/ui/swift-ui` `BottomSheet` and `IMessageStack` into `TimelinesScreen`

**Files:**
- Modify: `app/tabs/screens/timelines.tsx:1-59`

**Interfaces:**
- Consumes: `DaysTimelineTab`, `WeeksTimelineTab`, `MonthsTimelineTab` (`onOpenModal` prop), `IMessageStack` from `@/src/animations/imessage-stack`
- Produces: `TimelinesScreen` with interactive flashcard review modal.

- [ ] **Step 1: Check existing imports and layout of `app/tabs/screens/timelines.tsx`**

Run: `cat app/tabs/screens/timelines.tsx`
Expected: shows `TimelinesScreen` with tabs mapping and header.

- [ ] **Step 2: Update `app/tabs/screens/timelines.tsx` to host modal and pass `onOpenModal`**

Replace the contents of `app/tabs/screens/timelines.tsx` with:

```tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { Host, Picker, Text as SwiftUIText, BottomSheet } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint, presentationDetents, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
import { SAGE } from "@/lib/tokens";
import { IMessageStack } from "@/src/animations/imessage-stack";

import { DaysTimelineTab } from "@/src/screens/Timelines/tabs/DaysTimelineTab";
import { WeeksTimelineTab } from "@/src/screens/Timelines/tabs/WeeksTimelineTab";
import { MonthsTimelineTab } from "@/src/screens/Timelines/tabs/MonthsTimelineTab";

export default function TimelinesScreen() {
  const [activeTab, setActiveTab] = useState<"days" | "weeks" | "months">(
    "days",
  );
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);

  const handleSelectionChange = (selection: unknown) => {
    if (typeof selection === "string") {
      if (selection === "Days") setActiveTab("days");
      if (selection === "Weeks") setActiveTab("weeks");
      if (selection === "Months") setActiveTab("months");
    }
  };

  const selectedLabel =
    activeTab === "days" ? "Days" : activeTab === "weeks" ? "Weeks" : "Months";

  const handleOpenModal = () => {
    setIsStackModalOpen(true);
  };

  return (
    <View className="flex-1 bg-brand-surface">
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
          headerTitle: () => (
            <View className="items-center justify-center pt-2">
              <Host style={{ width: 220, height: 32 }}>
                <Picker
                  modifiers={[pickerStyle("segmented"), tint(SAGE[600])]}
                  selection={selectedLabel}
                  onSelectionChange={handleSelectionChange}
                >
                  <SwiftUIText modifiers={[tag("Days")]}>Days</SwiftUIText>
                  <SwiftUIText modifiers={[tag("Weeks")]}>Weeks</SwiftUIText>
                  <SwiftUIText modifiers={[tag("Months")]}>Months</SwiftUIText>
                </Picker>
              </Host>
            </View>
          ),
        }}
      />
      <View className="flex-1">
        {activeTab === "days" && <DaysTimelineTab onOpenModal={handleOpenModal} />}
        {activeTab === "weeks" && <WeeksTimelineTab onOpenModal={handleOpenModal} />}
        {activeTab === "months" && <MonthsTimelineTab onOpenModal={handleOpenModal} />}
      </View>

      <Host>
        <BottomSheet
          isPresented={isStackModalOpen}
          onIsPresentedChange={setIsStackModalOpen}
          modifiers={[
            presentationDetents(["medium", "large"]),
            presentationDragIndicator("visible"),
          ]}
        >
          <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
            <IMessageStack />
          </View>
        </BottomSheet>
      </Host>
    </View>
  );
}
```

- [ ] **Step 3: Run TypeScript check and type validation**

Run: `npx tsc --noEmit && npm run types`
Expected: PASS without errors.

- [ ] **Step 4: Commit Task 3**

```bash
git add app/tabs/screens/timelines.tsx
git commit -m "feat(timelines): integrate iMessage stack modal into TimelinesScreen"
```
