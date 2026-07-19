---
target: My Coping Cards
total_score: 30
p0_count: 0
p1_count: 1
timestamp: 2026-07-18T18-48-07Z
slug: my-coping-cards
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Toast appears on `Archive` (`4s Undo`), but `Restore` (`handleUnarchive`) triggers silent removal with zero feedback. `opacity-60` on `Archived` tab makes cards look disabled, not archived. |
| 2 | Match System / Real World | 3 | CBT terms are clear (`ABC Analysis`, `Balanced thought`), but double state labels (`Saved` top vs `Starred` bottom) confuse the mental model. |
| 3 | User Control and Freedom | 3 | Segmented control toggles `Active`/`Archived` smoothly. Missing `Undo` / confirmation toast when unarchiving cards (`handleUnarchive`). |
| 4 | Consistency and Standards | 2 | `Cormorant` font is missing on the screen title. Vocabulary clash (`Saved` vs `Starred`). Touch targets (`36px`) violate `44px` mobile accessibility standard. |
| 5 | Error Prevention | 3 | Archiving is non-destructive (`Archived` tab). No permanent delete exposed here, protecting vulnerable CBT data. |
| 6 | Recognition Rather Than Recall | 4 | Exercise badges combine emoji + clear label (`EXERCISE_LABEL`). Action icons (`BookmarkCheck01Icon`, `Archive01Icon`) are cleanly paired with text labels. |
| 7 | Flexibility and Efficiency | 3 | 1-tap star (`handleToggleStar`) and archive with crisp haptic feedback. Instant client-side tab switch without re-fetch. |
| 8 | Aesthetic and Minimalist Design | 3 | Shadow-free cards follow `DESIGN.md` restraint. However, redundant `Saved` top chip adds visual noise when bottom `Starred` is already visible. |
| 9 | Error Recovery | 3 | Clear retry flow on query error (`"Failed to load your coping cards"` + `Try again` button). |
| 10 | Help and Documentation | 3 | `EmptyState` teaches the interface (`"Complete an exercise and tap 'Save as coping card'..."`), guiding users on how cards are collected. |
| **Total** | | **30/40** | **Good (Address weak areas, solid foundation)** |

#### Anti-Patterns Verdict

**Start here.** Does this look AI-generated?

**LLM assessment**: We have successfully eliminated the classic AI slop anti-patterns (`border + wide drop-shadow` ghost cards, over-rounded `32px+` radii, and double stacked all-caps tracked eyebrows). The card anatomy is calm, shadow-free, and restrained. However, several second-order layout and system tells remain: (1) **Double-labeling state with split vocabulary** (`Saved` badge at top vs `Starred` button at bottom for the exact same `card.starred` boolean); (2) **System font fallback** where `Stack.Screen` uses default iOS sans-serif instead of `Cormorant` for the page header; and (3) **Cramped touch targets (`36px`)** paired with low-contrast muted grays (`#AFAFAF`) and `opacity-60` tab dimming.

**Deterministic scan**: The automated CLI detector (`detect.mjs`) returned `0` findings across `CopingCardsScreen.tsx` and `CopingCardItem.tsx`. Both files cleanly pass the static/regex anti-pattern detector with zero false positives. They use NativeWind (`className`), centralized design tokens (`SAGE`, `INK`, `BRAND_CANVAS`), native iOS SwiftUI controls (`@expo/ui/swift-ui`), and `react-native-reanimated` transitions without generic web slop patterns.

**Visual overlays**: Skipped. The target files are components of a React Native Expo mobile application rendered via native iOS components (`View`, `FlatList`, `Pressable`, `@expo/ui/swift-ui` `Picker`) and evaluated via iOS Simulator screenshot. Browser live-server DOM injection (`detect.js`) applies strictly to web HTML/CSS targets and is not applicable here.

#### Overall Impression
A clean, shadow-free, and serene CBT card shelf that strictly adheres to `DESIGN.md` surfaces and tokens. It succeeds at eliminating generic AI web tropes, but needs targeted polish in contrast (`WCAG AA`), touch targets (`44px`), and state vocabulary (`Saved` vs `Starred`) to achieve true editorial distinction and mobile accessibility.

#### What's Working
1. **Calm, shadow-free card anatomy & spacing**: Adheres strictly to `DESIGN.md` / `PRODUCT.md` anti-slop rules by avoiding `border + box-shadow` ghost cards, capping radius at `20px` (`rounded-2xl`), using subtle tonal differentiation (`SAGE[50]` vs `#ffffff`), and placing the user's reframe text at the top of the visual hierarchy.
2. **Context-aware educational empty state**: `EmptyState` turns zero cards into warm, instructional onboarding guidance (`"Complete an exercise and tap 'Save as coping card'..."`), demystifying the CBT flow connection.
3. **Optimized instant switching with haptics**: Fetching all cards once (`useCopingCards(true)`) enables zero-latency client-side filtering between `Active` and `Archived` tabs, paired with crisp haptic feedback (`selectionAsync`, `impactAsync`) and native `@expo/ui/swift-ui` `Picker` controls.

#### Priority Issues

1. **[P1] What: WCAG AA contrast failures on `Archive` text/icons and `opacity-60` `Archived` tab dimming.**
   - **Why it matters**: `INK_MUTED` (`#AFAFAF`) on `Archive` button (`CopingCardItem.tsx:171`) and date (`:104`) yields `~2.16:1` contrast against `#ffffff` / `SAGE[50]` (`WCAG AA` fail). Furthermore, the `Archived` tab wraps all cards in `opacity-60` (`CopingCardsScreen.tsx:140`), dropping `INK_SOFT` (`#767676`) to `~2.4:1` and `INK_MUTED` (`#AFAFAF`) to `~1.4:1`. This is illegible for low-vision users (`Sam` persona).
   - **Fix**: Replace `INK_MUTED` on interactive button text and icons with `INK_SOFT` (`#767676` / `text-ink-soft`). Remove the `opacity-60` wrapper on the `Archived` tab (`:140`); distinguish archived cards by using `BRAND_SURFACE_SOFT` (`#F7F7F7`) as the card background while keeping text at full opacity (`text-ink`).
   - **Suggested command**: `$impeccable colorize`

2. **[P2] What: Cramped touch target heights (`36px`) on card action buttons (`Star` and `Archive`).**
   - **Why it matters**: `Pressable` components for Star (`CopingCardItem.tsx:147`) and Archive (`:166`) use `min-h-[36px] py-1`. Mobile usability standards (`DESIGN.md` / `coding-standards.fe.md`) require `>= 44x44dp`. A `36px` target near the bottom corner causes frequent misclicks on mobile devices (`Casey` persona).
   - **Fix**: Change `min-h-[36px] py-1` to `min-h-[44px] py-2` on both action `Pressable` components (`CopingCardItem.tsx:147,166`). Add horizontal padding/gap (`px-2`) so touch zones stay comfortably distinct.
   - **Suggested command**: `$impeccable adapt`

3. **[P2] What: Redundant double-badge (`Saved` top pill + `Starred` bottom button) with conflicting vocabulary.**
   - **Why it matters**: Starred cards render a `Saved` badge (`CopingCardItem.tsx:99-101`) AND a `Starred` (`BookmarkCheck` icon) button in the action bar (`:158`). Using two different words (`Saved` vs `Starred`) for the exact same boolean `card.starred` creates visual noise and mental friction (`Did I star it or save it?`).
   - **Fix**: Remove the top `card.starred && <View className="bg-sage-200/50..."> <Text...>Saved</Text> </View>` pill (`CopingCardItem.tsx:98-102`). Let the `SAGE[50]` background, `SAGE[300]` border, and bottom `[BookmarkCheck icon] Starred` button (`text-sage-600 font-semibold`) cleanly signal the starred state without double labeling.
   - **Suggested command**: `$impeccable distill`

4. **[P2] What: Missing `Cormorant` editorial font on screen title (`Stack.Screen options={{ title: "My Coping Cards" }}`).**
   - **Why it matters**: `DESIGN.md` explicitly mandates: `Use Cormorant for page titles, reflective completion moments, and occasional emotional emphasis.` The default iOS `Stack.Screen` header uses system sans-serif (`Geist`/SF Pro), diluting Happy Journals' signature calm editorial aesthetic on a core reflective screen.
   - **Fix**: Configure `Stack.Screen` `headerTitle` with a custom component (or render a custom header row above `FlatList`) using `<Text variant="title" className="text-ink font-serif font-medium text-[24px]">My Coping Cards</Text>` (`Cormorant Garamond`).
   - **Suggested command**: `$impeccable typeset`

5. **[P3] What: Silent removal on restore when unarchiving cards directly (`handleUnarchive`).**
   - **Why it matters**: Archiving (`handleArchive`) triggers a `4s` `Animated.View` toast with an `Undo` action. But inside the `Archived` tab, tapping `Restore` (`handleUnarchive`, `CopingCardsScreen.tsx:56-62`) causes the card to instantly vanish from the list without any toast or confirmation, triggering anxiety (`Did the card restore or delete?`).
   - **Fix**: Update `handleUnarchive` (`:56-62`) to trigger toast confirmation (`setToastConfig({ id, visible: true, message: "Card restored to Active" })` using a unified toast state) when called from `CopingCardItem`.
   - **Suggested command**: `$impeccable harden`

#### Persona Red Flags

- **Alex (Power User)**:
  - Red Flag: Zero gesture shortcuts (`react-native-gesture-handler` / `Swipeable`) or bulk action mode (`Select All` / `Archive Selected`). Alex must tap every card's `36px` bottom button individually to clean up or archive `10+` cards.
- **Jordan (First-Timer)**:
  - Red Flag: Seeing a `Saved` pill at the top AND a `Starred` button at the bottom on the same `ABC Analysis` card causes doubt (`Did I star it or save it? Is saving different from starring?`).
- **Sam (Accessibility-Dependent User)**:
  - Red Flag: `text-ink-muted` (`#AFAFAF`) on the `Archive` button and date fails WCAG AA (`~2.16:1`).
  - Red Flag: In the `Archived` tab, the `opacity-60` wrapper drops text contrast below `2:1`. Screen magnification and low-vision reading are compromised.
  - Red Flag: `Pressable` action targets (`36px`) fall below the `44px` accessible minimum.
- **Casey (Distracted Mobile User)**:
  - Red Flag: `36px` bottom-right action targets require careful thumb aiming when walking one-handed.
  - Red Flag: Restoring a card inside the `Archived` tab (`handleUnarchive`) triggers an instant vanish with zero toast, forcing Casey to switch tabs to verify the card did not disappear permanently.

#### Minor Observations
- `CopingCardItem.tsx:72`: `handleTextLayout = useCallback((e: any) => ...)` uses `any` type (`(e: any)`). `coding-standards.common.md` mandates: `strictly use typescript everywhere... dont use any type.` This should be typed explicitly (`import type { NativeSyntheticEvent, TextLayoutEventData } from "react-native"`).
- `Pressable` on `reframe_text` (`handleToggleExpand`, `CopingCardItem.tsx:118-139`) wraps the entire text block and button. When `expanded` is true, button text changes to `Show less` (`:136`). However, `onTextLayout` checks `lines.length >= MAX_LINES_COLLAPSED` only when `!expanded` (`if (!expanded) setIsTruncated(...)`). If orientation/window size changes while expanded, `isTruncated` state stays stale until collapsed.

#### Questions to Consider
1. *What if coping cards felt more like tangible index cards on a sage writing table, rather than standard vertical list items?* Could a subtle top border accent (`2px solid SAGE[400]`) or subtle paper texture token elevate the editorial feel without relying on drop shadows?
2. *Why require two separate tabs (`Active` vs `Archived`) when a single unified stream with a collapsible `Archived (N)` drawer at the bottom could keep the user's CBT history inside one continuous, calm timeline?*
3. *Could the `Star` button be replaced by a simple bookmark corner / heart icon directly next to the reframe label, leaving only `Archive` (or a swipe gesture) in the action bar to eliminate action row clutter?*
