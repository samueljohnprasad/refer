# Coping Cards iMessage Stack Demo — Design Spec

## 1. Goal
Replace current quick-review UI inside `CopingCardsScreen.tsx` short Swift UI modal (`BottomSheet`) with a clean transparent template that renders the exact `<IMessageStack />` component used in `test-charts.tsx`.

## 2. Architecture & Components
- **Target File**: `src/screens/CopingCardsScreen/CopingCardsScreen.tsx`
- **Imports to Add**: `import { IMessageStack } from "@/src/animations/imessage-stack";`
- **Modal Structure**:
  ```tsx
  <Host>
    <BottomSheet
      isPresented={isReviewOpen}
      onIsPresentedChange={(val) => {
        if (!val) setIsReviewOpen(false);
      }}
    >
      <Group
        modifiers={[
          presentationDetents(["medium", "large"]),
          presentationDragIndicator("visible"),
        ]}
      >
        <RNHostView>
          <SafeAreaView
            edges={["bottom"]}
            style={{ flex: 1, backgroundColor: "transparent" }}
          >
            <View className="flex-1 items-center justify-center bg-transparent">
              <IMessageStack />
            </View>
          </SafeAreaView>
        </RNHostView>
      </Group>
    </BottomSheet>
  </Host>
  ```

## 3. Data Flow & State
- `isReviewOpen` boolean state continues to control `BottomSheet` visibility (`isPresented`).
- `reviewIndex` state will be cleaned up/removed since `IMessageStack` manages its own internal `scrollOffset` Reanimated state.
- `IMessageStack` renders its internal `CARDS` array (`10` colored cards) driven by a paging `Animated.ScrollView`.

## 4. Testing & Verification
- Verify `npm run types` passes with zero errors.
- Verify modal opens smoothly on tapping "Review Reframes".
- Verify transparent background reveals `IMessageStack` cleanly inside the Swift UI sheet.
