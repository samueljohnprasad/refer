# Coping Cards iMessage Stack Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current quick-review UI inside `CopingCardsScreen.tsx` short Swift UI modal (`BottomSheet`) with a clean transparent template that renders the exact `<IMessageStack />` component from `src/animations/imessage-stack`.

**Architecture:** We import `IMessageStack` into `src/screens/CopingCardsScreen/CopingCardsScreen.tsx`. Inside the Swift UI `BottomSheet` modal (`Host` -> `BottomSheet` -> `Group` -> `RNHostView`), we render a transparent `SafeAreaView` and container displaying `<IMessageStack />`. We clean up unused `reviewIndex` state.

**Tech Stack:** React Native, Expo Router, `@expo/ui/swift-ui`, `react-native-reanimated`, TypeScript.

## Global Constraints

- TypeScript strict typing everywhere (`no any`).
- Use `@/` alias for root-relative imports.
- Use `@expo/ui/swift-ui` for the bottom sheet modal (`Host`, `BottomSheet`, `Group`, `RNHostView`).
- Maintain existing user work and surrounding file structure.

---

### Task 1: Render IMessageStack Demo inside Transparent Short Modal

**Files:**
- Modify: `src/screens/CopingCardsScreen/CopingCardsScreen.tsx`

**Interfaces:**
- Consumes: `IMessageStack` from `@/src/animations/imessage-stack`

- [ ] **Step 1: Check existing TypeScript types before edits**

Run: `npm run types`
Expected: PASS (`npx supabase gen types typescript` completes without errors)

- [ ] **Step 2: Modify `CopingCardsScreen.tsx` to import `IMessageStack`, remove `reviewIndex`, and update modal**

In `src/screens/CopingCardsScreen/CopingCardsScreen.tsx`:
1. Add `import { IMessageStack } from "@/src/animations/imessage-stack";` to the top imports.
2. Remove `const [reviewIndex, setReviewIndex] = useState(0);` and `setReviewIndex(0);` from `onPress`.
3. Replace the content inside `RNHostView` of the `BottomSheet` with the transparent `<IMessageStack />` container.

Complete Replacement for the modal block (`CopingCardsScreen.tsx` lines around 215-285):
```tsx
      {/* Short Flashcard Review Modal with IMessageStack Demo */}
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
                <View className="flex-1 items-center justify-center bg-transparent py-4">
                  <IMessageStack />
                </View>
              </SafeAreaView>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
```

And update the button `onPress`:
```tsx
              {viewMode === "active" && activeCards.length > 0 && (
                <Pressable
                  onPress={() => setIsReviewOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Start flashcard review session"
                  className="bg-sage-100/70 border border-sage-300/80 rounded-2xl p-4 mb-1 flex-row items-center justify-between active:opacity-85"
                >
```

- [ ] **Step 3: Verify TypeScript checking passes**

Run: `npm run types`
Expected: PASS without errors

- [ ] **Step 4: Commit changes**

```bash
git add src/screens/CopingCardsScreen/CopingCardsScreen.tsx
git commit -m "feat(copingCards): render exact IMessageStack demo in transparent short modal"
```
