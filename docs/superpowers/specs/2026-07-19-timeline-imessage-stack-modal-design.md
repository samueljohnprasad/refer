# Timeline iMessage Stack Modal Design

## Overview
Integrate the short `@expo/ui/swift-ui` `BottomSheet` containing `IMessageStack` into the AI Insights Timeline (`Days`, `Weeks`, `Months` tabs). Currently, tapping any completed insight card across any of these tabs will open the flashcard review modal. Real dynamic insight data will be bound to the stack cards in a subsequent task.

## Architecture & Data Flow

```
TimelinesScreen (app/tabs/screens/timelines.tsx)
  │  State: isStackModalOpen (boolean)
  │
  ├── Picker Header (Days / Weeks / Months)
  │
  ├── Active Tab Content
  │     ├── DaysTimelineTab   ───┐
  │     ├── WeeksTimelineTab  ───┼── receives `onOpenModal: () => void` prop
  │     └── MonthsTimelineTab ───┘
  │           │
  │           └── renders DailyInsightCard / WeeklyInsightCard / MonthlyInsightCard
  │                 │
  │                 └── Pressable (onPress = onOpenModal)
  │
  └── <Host>
        └── <BottomSheet isPresented={isStackModalOpen}>
              └── <View (transparent)>
                    └── <IMessageStack />
```

## Component Changes

### 1. `src/screens/Timelines/components/DailyInsightCard.tsx`
- Add optional `onPress?: () => void` to `DailyInsightCardProps`.
- Wrap outer `View` in `Pressable` with `onPress={onPress}` and subtle `active:opacity-80` / scale feedback so user feels tactile response when tapping.

### 2. `src/screens/Timelines/components/InsightCardWrapper.tsx`
- Ensure any wrapper around insight cards supports passing tap events if applicable.

### 3. Timeline Tabs (`DaysTimelineTab.tsx`, `WeeksTimelineTab.tsx`, `MonthsTimelineTab.tsx`)
- Add interface `TimelineTabProps { onOpenModal: () => void; }`.
- Update `DaysTimelineTab`, `WeeksTimelineTab`, and `MonthsTimelineTab` to accept `onOpenModal`.
- In each tab's item renderer (`renderTimelineItem` or inline map for weeks/months), pass `onPress={onOpenModal}` to the insight card (`DailyInsightCard` or equivalent card renderer).

### 4. Parent Screen (`app/tabs/screens/timelines.tsx`)
- Import `IMessageStack` from `@/src/animations/imessage-stack`.
- Import `Host`, `BottomSheet`, `presentationDetents`, `presentationDragIndicator` from `@expo/ui/swift-ui` and `@expo/ui/swift-ui/modifiers`.
- Declare state: `const [isStackModalOpen, setIsStackModalOpen] = useState(false);`.
- Pass `onOpenModal={() => setIsStackModalOpen(true)}` to `<DaysTimelineTab />`, `<WeeksTimelineTab />`, and `<MonthsTimelineTab />`.
- Mount `<Host>` containing `BottomSheet` with `presentationDetents(["medium", "large"])`, `presentationDragIndicator("visible")`, and `<IMessageStack />` centered inside.

## Error Handling & Edge Cases
- **Tab Switching:** If `isStackModalOpen` is open while tabs switch in background, modal remains stable since it is hosted at the parent (`TimelinesScreen`) level.
- **Loading / Shimmer States:** Shimmer items (`TimelineShimmer`) and "Generate Insight" buttons (`GenerateInsightCard`) do NOT trigger `onOpenModal`. Only completed insight cards trigger the modal.

## Verification & Testing
1. Run `npm run types` and `npx tsc --noEmit` to verify strict TypeScript adherence across tabs and cards.
2. Verify in iOS simulator / dev app by navigating to `Timelines` tab.
3. Tap on a completed insight card in `Days` tab -> modal opens smoothly at medium detent showing `IMessageStack`.
4. Switch to `Weeks` tab -> tap on weekly card -> modal opens smoothly.
5. Switch to `Months` tab -> tap on monthly card -> modal opens smoothly.
