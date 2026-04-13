# PRD: Config-Driven Journey Map with Sections, Units & Rich Node Types

**Date:** April 3, 2026
**Status:** Draft
**Scope:** Refactor journey map to be fully configuration-driven with Duolingo-style sections, unit dividers, rich node types, and a section overview screen.

---

## 1. Problem Statement

The current journey map implementation has several structural limitations:

1. **No Sections concept** — Duolingo organizes content into Sections (groups of units). Our app only has flat Units. There's no visual section divider, section header card, or section overview screen.

2. **Hardcoded node behavior** — Node types (LESSON, CHECKPOINT, CHEST) have hardcoded icons, colors, and rewards in `nodeFactory.ts` using if/else and Record maps. Adding a new node type (e.g. microphone, video, gamepad, headphones — all visible in the Duolingo screenshots) requires modifying factory code.

3. **No unit divider** — When scrolling between units, Duolingo shows a horizontal divider with the next unit's title (e.g. "Describe your family") and a "JUMP HERE?" badge. Our app shows nothing between units — they're separate pages.

4. **No section overview** — Duolingo has a scrollable overview screen (Image 2) showing all sections as cards with mascot, speech bubble, progress bar, and "JUMP HERE" link. Our app has no equivalent.

5. **Hardcoded colors & messages** — Unit colors, mascot messages, node icons, reward amounts are scattered across `constants.ts`, `nodeFactory.ts`, and `mockUnits.ts` as hardcoded values instead of being read from a single config.

---

## 2. Goal

Refactor the journey system so that **every visual and behavioral aspect is driven by a JSON configuration object** — no conditional if/else statements for node types, colors, icons, or rewards. Adding a new section, unit, node type, or mascot message should require **only a config change, zero code changes**.

---

## 3. Reference: Duolingo UI Analysis (from Screenshots)

### Image 1 — Unit Path (Section 1, Unit 1)
- **Header:** Green banner — "SECTION 1, UNIT 1 / Order in a cafe" with a guide-book icon button
- **Left sidebar icons:** XP counter (dumbbell "0/30"), heart icon, hourglass icon — these are persistent while scrolling
- **Zigzag path nodes with diverse icons:**
  - ⭐ Star (active, green glow + progress ring)
  - ⭐ Star (locked, grey)
  - 🎮 Gamepad (locked)
  - 🎤 Microphone (locked)
  - 📹 Video camera (locked)
  - 📦 Treasure chest (locked)
  - 🎧 Headphones (locked)
- **Mascot (owl):** Appears to the right of path with star rating badges
- **Key takeaway:** Each node has a **unique icon type** driven by the lesson's exercise type — NOT just star/lock/checkmark

### Image 2 — Section Overview Screen
- **Header:** "German" with close button
- **Section cards** stacked vertically:
  - Light blue background card
  - Mascot with speech bubble ("Hallo!", "Ich will Deutsch lernen.")
  - Section name: "Section 1", "Section 2"
  - Level/unit range: "5 to 9", "10 to 19"
  - Progress bar (grey, partially filled)
  - "JUMP HERE" link on sections ahead of current
- **Key takeaway:** Sections are a **grouping level above units**. Each section contains multiple units.

### Image 3 — Unit Divider / Jump Here
- **Horizontal divider line** with centered text: "Describe your family"
- **"JUMP HERE?" speech bubble** above a purple fast-forward ⏩ button
- **Scroll-to-top button** (↑ arrow) in bottom-right corner
- **Key takeaway:** Between units, there's a visual **unit divider** with title + optional "Jump Here" action for placement tests

### Image 4 — Unit 2 (Different Color)
- **Purple header** — "SECTION 1, UNIT 2 / Describe your family"
- **"JUMP HERE?" badge** with fast-forward button at the top of the new unit
- **Different node icons** (star, microphone, video, chest, headphones)
- **Key takeaway:** Each unit has its **own color scheme**, and the header dynamically changes color as you scroll between units

---

## 4. Data Model: Config-Driven Architecture

### 4.1 Core Principle

**Everything is a lookup table.** Node types, icons, colors, rewards, mascot messages — all defined in a central `JourneyConfig` object. Components read from the config using keys. Zero if/else in rendering logic.

### 4.2 New Type: `NodeVariant` (replaces hardcoded NodeType behavior)

```typescript
/**
 * A node variant defines the visual and behavioral properties of a node type.
 * Adding a new node type = adding a new entry to the config. Zero code changes.
 */
interface NodeVariantConfig {
  /** Unique key for this variant (e.g. 'star', 'microphone', 'video', 'gamepad') */
  key: string;
  /** Display label for accessibility */
  label: string;
  /** Icon configs per status — SVG name, emoji, or icon-library key */
  icons: Record<NodeStatus, NodeIconConfig>;
  /** Colors per status */
  colors: Record<NodeStatus, NodeColorConfig>;
  /** Default rewards per status (only 'completed' typically has rewards) */
  rewards: JourneyReward[];
  /** Size override (dp). Falls back to global NODE_SIZE.regular if omitted */
  size?: number;
  /** Animation variant: 'breathing' | 'shine' | 'shake' | 'none' */
  activeAnimation: string;
  /** Whether this node shows a progress ring when active */
  showProgressRing: boolean;
}

interface NodeIconConfig {
  /** Icon type: 'svg' | 'emoji' | 'hugeicons' | 'sf-symbol' */
  type: 'svg' | 'emoji' | 'hugeicons';
  /** Value: SVG asset key, emoji string, or icon component name */
  value: string;
  /** Optional tint color override */
  tintColor?: string;
}

interface NodeColorConfig {
  /** Fill / background color */
  fill: string;
  /** Border / stroke color */
  border: string;
  /** Shadow / glow color (active state) */
  glow?: string;
}
```

### 4.3 New Type: `SectionConfig` (groups of units)

```typescript
/**
 * A Section groups multiple Units together, matching Duolingo's hierarchy:
 * Course → Section → Unit → Node
 */
interface SectionConfig {
  id: string;
  /** Display number (e.g. 1, 2, 3) */
  sectionNumber: number;
  /** Section title shown in overview cards */
  title: string;
  /** Unit range label (e.g. "5 to 9") */
  unitRangeLabel: string;
  /** Background color for the section overview card */
  cardBackgroundColor: string;
  /** Mascot config for the overview card */
  mascot: SectionMascotConfig;
  /** IDs of units belonging to this section */
  unitIds: string[];
}

interface SectionMascotConfig {
  /** Asset key for the mascot image */
  imageKey: string;
  /** Speech bubble message */
  message: string;
  /** Which side of the card to show mascot */
  side: 'left' | 'right';
}
```

### 4.4 Enhanced `UnitConfig` (replaces current UnitData for config)

```typescript
/**
 * A unit configuration. Runtime state (node statuses, progress) is separate.
 * This is the static blueprint.
 */
interface UnitConfig {
  id: string;
  unitNumber: number;
  /** Short title for the header (e.g. "Order in a cafe") */
  title: string;
  description: string;
  /** Key into the color theme registry */
  colorThemeKey: string;
  /** Section this unit belongs to */
  sectionId: string;
  /** Node blueprint — ordered list of node variant keys */
  nodes: UnitNodeConfig[];
  /** Mascot placements within this unit */
  mascotPlacements: MascotPlacementConfig[];
  /** Unit divider config (shown between previous unit and this one) */
  divider: UnitDividerConfig;
}

interface UnitNodeConfig {
  /** Key into the NodeVariantConfig registry */
  variantKey: string;
  /** Task ID linking to the exercise/lesson content */
  taskId: string;
  /** Task type for routing: which exercise screen to open */
  taskType: string;
  /** Override rewards for this specific node (optional) */
  rewardOverrides?: JourneyReward[];
  /** Override label (e.g. "START", "BOSS") */
  label?: string;
}

interface UnitDividerConfig {
  /** Title text shown in the divider (e.g. "Describe your family") */
  title: string;
  /** Whether to show "JUMP HERE?" badge */
  showJumpHere: boolean;
  /** Color of the jump button (inherits unit color by default) */
  jumpButtonColor?: string;
}

interface MascotPlacementConfig {
  afterNodeIndex: number;
  side: 'left' | 'right';
  /** Key into a message registry, or literal string */
  messageKey: string;
  /** Optional: star rating to show next to mascot (e.g. 2 gold stars) */
  starRating?: number;
}
```

### 4.5 Color Theme Registry

```typescript
/**
 * All colors resolved by key. No hex codes in components.
 */
interface ColorThemeConfig {
  /** Unique key (e.g. 'green', 'purple', 'blue', 'orange', 'pink') */
  key: string;
  /** Header gradient pair */
  headerGradient: [string, string];
  /** Header text color */
  headerTextColor: string;
  /** Path active color */
  pathActiveColor: string;
  /** Divider accent color */
  dividerColor: string;
  /** Jump button background color */
  jumpButtonColor: string;
}
```

### 4.6 Master Config Object

```typescript
/**
 * The single source of truth. Loaded from JSON (local file or remote API).
 * Components NEVER use hardcoded colors, icons, or node types.
 */
interface JourneyConfig {
  /** All node variants, keyed by variant key */
  nodeVariants: Record<string, NodeVariantConfig>;
  /** All color themes, keyed by theme key */
  colorThemes: Record<string, ColorThemeConfig>;
  /** All sections in order */
  sections: SectionConfig[];
  /** All units in order (referenced by sections via unitIds) */
  units: UnitConfig[];
  /** Mascot message registry, keyed by message key */
  mascotMessages: Record<string, string>;
  /** Global settings */
  settings: JourneySettingsConfig;
}

interface JourneySettingsConfig {
  /** Default node size (dp) */
  defaultNodeSize: number;
  /** Chest node size (dp) */
  chestNodeSize: number;
  /** Vertical gap between nodes (dp) */
  verticalGap: number;
  /** Zigzag amplitude factor */
  amplitudeFactor: number;
  /** Wave frequency */
  waveFrequency: number;
  /** Path stroke width */
  pathStrokeWidth: number;
  /** Path inactive color */
  pathInactiveColor: string;
}
```

---

## 5. Component Architecture

### 5.1 Config Provider

A new `JourneyConfigProvider` context wraps the journey screen. All components read config via `useJourneyConfig()` hook instead of importing constants directly.

```
JourneyConfigProvider (loads config JSON)
  └── JourneyMapContainer (state + business logic)
       └── JourneyMapPresentation (pure UI)
            ├── StickyUnitHeader (changes color per unit)
            ├── OfflineBanner
            ├── ScrollView
            │    ├── UnitDivider (between units)
            │    ├── PathConnector (SVG path)
            │    ├── ConfigDrivenNode (reads NodeVariantConfig)
            │    ├── MascotBubble
            │    └── JumpHereBadge
            └── ScrollToActiveButton
```

### 5.2 Config-Driven Node Renderer

**Current problem:** `PathNode.tsx` has hardcoded SVG XML strings, conditional color logic, and status-based icon selection.

**Solution:** A new `ConfigDrivenNode` component that:
1. Receives `variantKey` + `status` as props
2. Looks up `NodeVariantConfig` from context
3. Reads `icons[status]`, `colors[status]`, `size`, `activeAnimation`
4. Renders the correct icon/color/animation — zero if/else

```typescript
// Pseudocode — no conditionals for node type
function ConfigDrivenNode({ variantKey, status, ... }) {
  const config = useJourneyConfig();
  const variant = config.nodeVariants[variantKey];
  const iconConfig = variant.icons[status];
  const colorConfig = variant.colors[status];

  return (
    <NodeShell size={variant.size} colors={colorConfig} animation={variant.activeAnimation}>
      <NodeIcon config={iconConfig} />
      {variant.showProgressRing && status === 'active' && <ProgressRing />}
    </NodeShell>
  );
}
```

### 5.3 Section Overview Screen

New screen accessible from the header's guide-book button (visible in Image 1, top-right of green banner). Displays all sections as cards (Image 2).

### 5.4 Unit Divider Component

Renders between units inside the ScrollView. Shows the next unit's title and optional "JUMP HERE?" badge (Images 3 & 4).

### 5.5 Sticky Unit Header

The colored header banner (green for Unit 1, purple for Unit 2) sticks to the top. When the user scrolls past a unit boundary, the header animates to the next unit's color theme.

---

## 6. Migration Strategy

### Phase 1: Config types + provider (no visual changes)
Create config types, build the default config JSON from existing constants, wire up the provider. All existing components continue working.

### Phase 2: Config-driven node renderer
Replace `PathNode.tsx` with `ConfigDrivenNode.tsx` that reads from config. Add new node variants (microphone, video, gamepad, headphones).

### Phase 3: Sections + Unit dividers
Add Section data model, section overview screen, unit divider component, and sticky header color transitions.

### Phase 4: "Jump Here" + placement test flow
Wire up the "Jump Here" button to a placement test or skip mechanism.

---

## 7. Task Breakdown

---

### TASK 1: Define Config Types & Interfaces
**File:** `src/types/journey/config.ts`
**Effort:** S (< 1 day)

**Subtasks:**
- 1.1 — Create `NodeVariantConfig`, `NodeIconConfig`, `NodeColorConfig` interfaces
- 1.2 — Create `SectionConfig`, `SectionMascotConfig` interfaces
- 1.3 — Create `UnitConfig`, `UnitNodeConfig`, `UnitDividerConfig`, `MascotPlacementConfig` interfaces
- 1.4 — Create `ColorThemeConfig` interface
- 1.5 — Create `JourneyConfig`, `JourneySettingsConfig` master interfaces
- 1.6 — Export all from `src/types/journey/index.ts` barrel

**Acceptance criteria:**
- All interfaces are strictly typed (no `any`)
- All config fields documented with JSDoc comments
- Barrel export updated

---

### TASK 2: Build Default Config JSON
**File:** `src/data/journey/journeyConfig.ts`
**Effort:** M (1–2 days)

**Subtasks:**
- 2.1 — Define `NODE_VARIANT_REGISTRY`: migrate existing star/lock/checkmark/chest variants
- 2.2 — Add new node variants: `microphone`, `video`, `gamepad`, `headphones` (with appropriate icons per status)
- 2.3 — Define `COLOR_THEME_REGISTRY`: green, blue, purple, orange, pink
- 2.4 — Define `MASCOT_MESSAGE_REGISTRY`: keyed version of existing `MASCOT_MESSAGES`
- 2.5 — Define `SECTION_CONFIGS`: Section 1 (units 1–3), Section 2 (placeholder)
- 2.6 — Define `UNIT_CONFIGS`: rewrite UNIT_1, UNIT_2, UNIT_3 as config objects (replace `createNodeSequence` with `UnitNodeConfig[]`)
- 2.7 — Define `JOURNEY_SETTINGS`: migrate values from `PATH_LAYOUT`, `NODE_SIZE` constants
- 2.8 — Compose all into a single `DEFAULT_JOURNEY_CONFIG: JourneyConfig` export

**Acceptance criteria:**
- Config is a pure data object — no functions, no imports of component code
- All existing node types, colors, and messages are represented
- New node variants (microphone, video, gamepad, headphones) defined with placeholder SVG/emoji icons
- Existing mock units faithfully reproduced as config-based definitions

---

### TASK 3: JourneyConfigProvider Context
**Files:** `src/context/JourneyConfigContext.tsx`, `src/hooks/useJourneyConfig.ts`
**Effort:** S (< 1 day)

**Subtasks:**
- 3.1 — Create `JourneyConfigContext` with `JourneyConfig` value type
- 3.2 — Create `JourneyConfigProvider` component that loads `DEFAULT_JOURNEY_CONFIG` (future: fetch from API)
- 3.3 — Create `useJourneyConfig()` hook with error if used outside provider
- 3.4 — Create helper hooks:
  - `useNodeVariant(variantKey: string): NodeVariantConfig`
  - `useColorTheme(themeKey: string): ColorThemeConfig`
  - `useSectionConfig(sectionId: string): SectionConfig`
- 3.5 — Wrap `JourneyMapContainer` in `JourneyConfigProvider` (in the route file)

**Acceptance criteria:**
- Context provides full `JourneyConfig` object
- Helper hooks throw descriptive errors for missing keys
- Provider is at the route level, not inside the container

---

### TASK 4: Config Resolver — Transform Config → Runtime State
**File:** `src/hooks/useJourneyState.ts` (refactor), `src/utils/journey/configResolver.ts`
**Effort:** M (1–2 days)

**Subtasks:**
- 4.1 — Create `resolveUnitFromConfig(unitConfig, userProgress): UnitData` — builds runtime `UnitData` (with node statuses) from static `UnitConfig` + user progress data
- 4.2 — Create `resolveNodeFromConfig(nodeConfig, variantConfig, status): PathNodeData` — builds a single runtime node by merging config + variant + status
- 4.3 — Create `resolveAllUnits(journeyConfig, userProgress): UnitData[]` — resolves all units
- 4.4 — Refactor `journeyStore.ts` to use config resolver instead of `MOCK_UNITS` directly
- 4.5 — Ensure `loadJourneyState` / `saveJourneyState` work with resolved state (user progress stored separately from config)

**Acceptance criteria:**
- Runtime `UnitData` / `PathNodeData` types are unchanged (components don't need to change yet)
- Node status (LOCKED/ACTIVE/COMPLETED) is derived from user progress, not baked into config
- Config can be swapped (e.g. for A/B testing) without affecting stored progress

---

### TASK 5: ConfigDrivenNode Component
**File:** `src/components/journey/ConfigDrivenNode.tsx`
**Effort:** L (2–3 days)

**Subtasks:**
- 5.1 — Create `NodeShell` component: handles size, background color, border, glow, shadow based on `NodeColorConfig`
- 5.2 — Create `NodeIconRenderer` component: renders the correct icon based on `NodeIconConfig.type` ('svg' | 'emoji' | 'hugeicons')
  - SVG: lookup from a registered SVG map
  - Emoji: render as Text
  - Hugeicons: render the matching HugeiconsIcon component
- 5.3 — Create animation resolver: given `activeAnimation` string, return the correct reanimated animation config (breathing, shine, shake, none). Use a `Record<string, AnimationFactory>` — no if/else.
- 5.4 — Create `ConfigDrivenNode` wrapper that composes Shell + Icon + ProgressRing + Label + Animation
- 5.5 — Integrate into `JourneyMapPresentation` — replace `PathNode` usage with `ConfigDrivenNode`
- 5.6 — Register all SVG assets (star, lock, checkmark, chest, microphone, video, gamepad, headphones) in a `NODE_SVG_REGISTRY`

**Acceptance criteria:**
- **ZERO if/else or switch statements** for node type, status, icon, or color
- All visuals driven by config lookups
- New node types can be added by editing config JSON only
- Existing animations preserved (breathing, glow, tooltip bounce, completion pop)
- Accessibility labels read from config `variant.label` + `status`

---

### TASK 6: Unit Divider Component
**File:** `src/components/journey/UnitDivider.tsx`
**Effort:** S (< 1 day)

**Subtasks:**
- 6.1 — Create `UnitDivider` presentational component:
  - Horizontal line with centered unit title text
  - Optional "JUMP HERE?" speech bubble badge
  - Optional fast-forward ⏩ button (color from config)
- 6.2 — Props interface driven by `UnitDividerConfig`
- 6.3 — Integrate into `JourneyMapPresentation` — render between units in the ScrollView

**Acceptance criteria:**
- Divider text, colors, and "Jump Here" visibility all from config
- Animation on the jump button (pulse or bounce)
- Accessible: "Jump to Unit {N}: {title}" label

---

### TASK 7: Sticky Unit Header with Dynamic Color
**File:** `src/components/journey/StickyUnitHeader.tsx`
**Effort:** M (1–2 days)

**Subtasks:**
- 7.1 — Refactor `JourneyHeader` to be a **sticky header** that stays at the top of the scroll view
- 7.2 — Track which unit is currently visible based on scroll position
- 7.3 — Animate header gradient color transition when scrolling between units (e.g. green → purple)
- 7.4 — Header shows: "SECTION {N}, UNIT {M}" + unit title + guide-book button
- 7.5 — Colors come from `ColorThemeConfig` via config lookup — no hardcoded hex in component

**Acceptance criteria:**
- Header color smoothly transitions between unit color themes
- Section + Unit number are dynamic from config
- Guide-book button navigates to section overview screen

---

### TASK 8: Section Overview Screen
**Files:** `src/screens/SectionOverviewScreen/SectionOverviewContainer.tsx`, `SectionOverviewPresentation.tsx`
**Effort:** M (1–2 days)

**Subtasks:**
- 8.1 — Create `SectionOverviewContainer`: loads sections from config, computes progress per section
- 8.2 — Create `SectionOverviewPresentation`: scrollable list of section cards
- 8.3 — Create `SectionCard` component:
  - Card background color from `SectionConfig.cardBackgroundColor`
  - Mascot image + speech bubble message
  - Section title + unit range label
  - Progress bar (% of units completed in this section)
  - "JUMP HERE" link on sections ahead of current
- 8.4 — Add route: navigate from header guide-book button → section overview
- 8.5 — "JUMP HERE" tap scrolls main journey map to that section's first unit

**Acceptance criteria:**
- All section data (title, color, mascot, message) from config
- Progress calculated from user state, not config
- Smooth modal or push navigation from header button
- Close button returns to journey map

---

### TASK 9: Multi-Unit Scrollable Path
**File:** Refactor `JourneyMapContainer.tsx` + `JourneyMapPresentation.tsx`
**Effort:** L (2–3 days)

**Subtasks:**
- 9.1 — Render ALL units in a single scrollable path (currently only renders `currentUnit`)
- 9.2 — Insert `UnitDivider` between each unit
- 9.3 — Insert `JumpHereBadge` at the start of units ahead of the user's current progress
- 9.4 — Compute node positions across all units (not just one unit)
- 9.5 — Update `useJourneyLayout` to handle multi-unit position calculation
- 9.6 — Update `useScrollToActive` to work with the full multi-unit scroll height
- 9.7 — Performance: virtualize nodes far off-screen or use `FlatList` with sections

**Acceptance criteria:**
- User can scroll through ALL sections and units in one continuous path
- Only current + completed units are interactive; future units are locked/greyed
- Dividers appear between units with correct titles
- "Jump Here" buttons appear on appropriate units
- Performance: 60fps on iPhone 12 with 50+ nodes

---

### TASK 10: Side Progress Icons (Left Rail)
**File:** `src/components/journey/SideProgressRail.tsx`
**Effort:** S–M (1 day)

**Subtasks:**
- 10.1 — Create `SideProgressRail` component showing persistent side icons:
  - XP counter (dumbbell icon + "0/30" style progress)
  - Hearts icon + count
  - Streak/hourglass icon
- 10.2 — Position on the left side of the screen, floating over the scroll content
- 10.3 — Icons and values driven by `JourneyStats` + config
- 10.4 — Tapping an icon opens the relevant detail (XP history, hearts shop, etc.)

**Acceptance criteria:**
- Rail stays visible while scrolling
- Values update in real-time as user progresses
- Icons from config (type + color)

---

### TASK 11: Node SVG Asset Registry
**File:** `src/data/journey/svgRegistry.ts`
**Effort:** S (< 1 day)

**Subtasks:**
- 11.1 — Create a `Record<string, string>` mapping variant keys to SVG XML strings
- 11.2 — Migrate existing SVG XMLs from `PathNode.tsx` into the registry
- 11.3 — Add new SVGs for: microphone, video, gamepad, headphones (create simple, consistent SVG icons)
- 11.4 — Each SVG supports 3 color states (locked grey, active colored, completed gold) via fill color props

**Acceptance criteria:**
- SVGs are pure data (strings), not component code
- `ConfigDrivenNode` looks up SVG from registry by `iconConfig.value`
- Adding a new icon = adding one entry to the registry

---

### TASK 12: Remove Hardcoded Constants Migration
**File:** Multiple files — cleanup
**Effort:** M (1–2 days)

**Subtasks:**
- 12.1 — Remove `NODE_COLORS`, `UNIT_GRADIENTS`, `CHEST_COLORS` from `constants.ts` (now in config)
- 12.2 — Remove `COMPLETED_ICON_MAP`, `ACTIVE_ICON_MAP`, `REWARD_MAP` from `nodeFactory.ts` (now in config)
- 12.3 — Deprecate `createNodeSequence` — replace with config resolver (Task 4)
- 12.4 — Update `JourneyHeader` to read colors from `useColorTheme()` instead of importing `UNIT_GRADIENTS`
- 12.5 — Update `PathConnector` to read path colors from config settings
- 12.6 — Update `ChestNode` to read chest colors from `NodeVariantConfig` for the 'chest' variant
- 12.7 — Ensure all existing tests still pass
- 12.8 — Remove `mockUnits.ts` — replace with config-based unit resolution

**Acceptance criteria:**
- No component imports from `constants.ts` for colors or icons (only for animation timing and sizing that remain global)
- No hardcoded hex color strings in any journey component
- All visual properties resolved through config context

---

## 8. Task Dependency Graph

```
TASK 1 (Types)
  ↓
TASK 2 (Default Config)
  ↓
TASK 3 (Config Provider) ──────────────────┐
  ↓                                         │
TASK 4 (Config Resolver)                    │
  ↓                                         │
TASK 11 (SVG Registry)                      │
  ↓                                         │
TASK 5 (ConfigDrivenNode) ←─────────────────┘
  ↓
TASK 12 (Remove Hardcoded) ←── TASK 7 (Sticky Header)
  ↓                                ↑
TASK 9 (Multi-Unit Path)  ←── TASK 6 (Unit Divider)
  ↓
TASK 8 (Section Overview)
  ↓
TASK 10 (Side Rail)
```

**Critical path:** Tasks 1 → 2 → 3 → 4 → 11 → 5 → 9

---

## 9. Effort Summary

| Task | Description | Size | Days |
|------|------------|------|------|
| 1 | Config types & interfaces | S | 0.5 |
| 2 | Default config JSON | M | 1.5 |
| 3 | Config provider + hooks | S | 0.5 |
| 4 | Config resolver (config → runtime state) | M | 1.5 |
| 5 | ConfigDrivenNode component | L | 2.5 |
| 6 | Unit divider component | S | 0.5 |
| 7 | Sticky header with dynamic color | M | 1.5 |
| 8 | Section overview screen | M | 1.5 |
| 9 | Multi-unit scrollable path | L | 2.5 |
| 10 | Side progress rail | S–M | 1.0 |
| 11 | SVG asset registry | S | 0.5 |
| 12 | Remove hardcoded constants | M | 1.5 |
| **Total** | | | **~15 days** |

---

## 10. Success Criteria

1. **Zero if/else for node rendering** — Adding a new node type (e.g. "writing") requires only:
   - One entry in `nodeVariants` config
   - One SVG in the SVG registry
   - Reference the variant key in a unit's `nodes[]` array

2. **Section overview screen** matches Duolingo Image 2 — cards with mascot, progress, and "Jump Here"

3. **Unit dividers** match Duolingo Images 3 & 4 — title text, Jump Here badge, fast-forward button

4. **Continuous scrollable path** — all units rendered in one scroll view with smooth transitions

5. **Dynamic header** — color transitions as user scrolls between units of different color themes

6. **Config hot-swappable** — changing `DEFAULT_JOURNEY_CONFIG` at runtime (or from API) changes all visuals without app restart

---

## 11. Out of Scope

- Remote config fetching (future: load config from Supabase/API)
- A/B testing framework for config variants
- Placement test flow for "Jump Here" (placeholder navigation for now)
- Content authoring tool / CMS
- New exercise types (breathing, body scan) — covered in separate PRD





