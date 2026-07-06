# Journey Map API Reference

All Supabase RPCs and mutations used to render and interact with the journey map.

---

## Table of Contents

1. [Read APIs (Rendering)](#phase-1-read-apis-rendering-the-map)
   - [`get_section_map`](#api-1--get_section_map)
   - [`get_node_content`](#api-2--get_node_content)
   - [`get_journey_catalog`](#api-3--get_journey_catalog)
2. [Write APIs (Interactions)](#phase-2-write-apis-user-interactions)
   - [`complete_journey_node`](#api-4--complete_journey_node)
   - [`replay_completed_journey_node`](#api-5--replay_completed_journey_node)
   - [`user_node_progress` update](#api-6--user_node_progress-table-update)
   - [Enrollment](#api-7--enrollment)
3. [Request Flow Diagram](#request-flow-diagram)
4. [Sample Test Data](#sample-test-data)

---

## Phase 1: Read APIs (Rendering the Map)

### API 1 — `get_section_map`

The **primary API** for rendering the journey map. Returns one section's worth of lightweight node stubs (no content JSONB) plus the user's progress.

| Detail              | Value                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------- |
| **Client function** | `fetchSectionMap()` in `src/lib/api/journeyApi.ts:412`                                  |
| **Supabase RPC**    | `get_section_map`                                                                       |
| **Consumed by**     | `useSectionData` hook → `JourneyMapContainer` → `sectionMapBridge` → FlashList pipeline |
| **Caching**         | In-memory Map atom (5min freshness) + AsyncStorage (24h TTL)                            |

**Request params:**

```ts
{
  p_slug: string;             // e.g. 'anxiety-toolkit'
  p_unit_number?: number;     // omit = user's current section
  p_view_mode?: 'active' | 'completed' | 'preview';
}
```

**Response type — `SectionMapResponse`** (`src/types/journey/sectionMap.ts:204`):

```ts
interface SectionMapResponse {
  viewMode: "active" | "completed" | "preview";
  focusNodeId: string | null;
  journey: SectionJourneyMeta;
  section: SectionData;
  progress: SectionNodeProgress[];
  enrollment: SectionEnrollment | null;
  sectionList: SectionListItem[];
}
```

#### Sub-types

**`SectionJourneyMeta`**:

```ts
interface SectionJourneyMeta {
  id: string;
  slug: string;
  title: string;
  version: number; // for cache invalidation
  colorScheme: string;
  totalSections: number;
}
```

**`SectionData`**:

```ts
interface SectionData {
  id: string;
  unitNumber: number; // 1-indexed (legacy alias)
  sectionNumber: number; // 1-indexed
  title: string;
  description: string;
  colorScheme: UnitColorScheme;
  mascotPlacements: unknown[];
  unlockRule: string; // 'sequential' | 'placement_test' | 'immediate'
  unitCount: number;
  nodes: NodeStub[]; // flat list of all node stubs
  units: SectionUnitData[]; // nested unit groupings
}
```

**`NodeStub`** (each node in `section.nodes` — excludes heavy content JSONB):

```ts
interface NodeStub {
  id: string;
  unitId: string;
  unitNumber: number;
  globalUnitNumber: number;
  nodeIndex: number; // 0-indexed position within the unit
  nodeType: string; // 'learn' | 'exercise' | 'quiz' | 'checkpoint' | 'chest' | 'mood_check' | etc.
  taskId: string;
  variantKey: string;
  title: string | null;
  iconKey: string | null;
  xpReward: number;
  estimatedMinutes: number;
  rewards: JourneyReward[];
  isTrophy: boolean;
  canInteract: boolean;
}
```

**`SectionUnitData`**:

```ts
interface SectionUnitData {
  id: string;
  sectionId: string;
  sectionNumber: number;
  unitNumber: number; // within section
  globalUnitNumber: number; // across journey
  title: string;
  description: string;
  colorScheme: UnitColorScheme;
  mascotPlacements: unknown[];
  unlockRule: string;
  nodes: NodeStub[];
}
```

**`SectionNodeProgress`** (each item in `progress`):

```ts
interface SectionNodeProgress {
  nodeId: string;
  status: "completed" | "active";
  progress: number; // 0.0–1.0
  rewardClaimed: boolean;
  completedAt: string | null; // ISO timestamp
}
```

**`SectionEnrollment`**:

```ts
interface SectionEnrollment {
  id: string;
  currentUnitNumber: number;
  currentSectionNumber: number;
  currentSectionUnitNumber: number;
  currentSectionId?: string | null;
  currentUnitId?: string | null;
  status: "active" | "completed" | "abandoned";
  templateVersion: number;
}
```

**`SectionListItem`** (used for sticky header tabs):

```ts
interface SectionListItem {
  unitNumber: number;
  sectionNumber?: number;
  title: string;
  colorScheme: string;
  nodeCount: number;
  unitCount?: number;
}
```

**Data flow:**

1. `useSectionData(slug, viewMode)` → calls `fetchSectionMap()`
2. Result stored in `currentSectionMapAtom` (Jotai)
3. `sectionMapBridge` converts `SectionMapResponse` → `JourneyState` + `UnitData[]`
4. `useJourneyFlashList` builds flat `JourneyFlashListItem[]` with positions, SVG paths, dividers, mascots
5. `JourneyMapFlashList` renders via cell recycling

---

### API 2 — `get_node_content`

**On-demand API** — only called when a user taps a node. Returns the full JSONB content for rendering the lesson/exercise/quiz.

| Detail              | Value                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Client function** | `fetchNodeContent()` in `src/lib/api/journeyApi.ts:469`                                                      |
| **Supabase RPC**    | `get_node_content`                                                                                           |
| **Consumed by**     | `useNodeContent` hook → `JourneyMapContainer` (pre-fetch on tap) → `TaskScreen` (renders via `NodeRenderer`) |
| **Caching**         | In-memory `Map` ref (per hook instance) + AsyncStorage (24h TTL)                                             |

**Request params:**

```ts
{
  p_node_id: string;
} // UUID of the node
```

**Response type — `NodeContentResponse`** (`src/types/journey/sectionMap.ts:226`):

```ts
interface NodeContentResponse {
  id: string;
  nodeType: string; // routes to correct renderer
  title: string | null;
  description: string | null;
  content: Record<string, unknown>; // JSONB — shape depends on nodeType
}
```

The `content` field shape varies by `nodeType`:

| nodeType     | Content Type        | Description                              |
| ------------ | ------------------- | ---------------------------------------- |
| `learn`      | `LearnContent`      | Array of cards with text/image/animation |
| `exercise`   | `ExerciseContent`   | Steps, inputs, prompts                   |
| `quiz`       | `QuizContent`       | Questions, options, explanations         |
| `journal`    | `JournalContent`    | Prompts, format                          |
| `mood_check` | `MoodCheckContent`  | Emoji scale, follow-up                   |
| `checkpoint` | `CheckpointContent` | Badge, skills recap, mood comparison     |
| `chest`      | `ChestContent`      | Rewards breakdown                        |

**Data flow:**

1. User taps a node → `JourneyMapContainer.handleNodePressInner()` calls `fetchNodeContent(nodeId)`
2. Content cached to AsyncStorage
3. Router navigates to `TaskScreen` with `nodeId` param
4. `TaskScreen` calls `useNodeContent().fetchContent(nodeId)` → instant AsyncStorage cache hit
5. `NodeRenderer` dispatches to the correct sub-renderer based on `nodeType`

---

### API 3 — `get_journey_catalog`

Returns all available journeys with enrollment status for the journey picker.

| Detail              | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| **Client function** | `fetchJourneyCatalog()` in `src/lib/api/journeyApi.ts:376` |
| **Supabase RPC**    | `get_journey_catalog`                                      |
| **Consumed by**     | Journey picker / switcher screens                          |

**Request params:** None.

**Response type — `JourneyListItem[]`** (`src/types/journey/template.ts:80`):

```ts
interface JourneyListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconUrl: string | null;
  colorScheme: string;
  totalNodes: number;
  completedNodes: number;
  isEnrolled: boolean;
  enrollmentStatus: "active" | "completed" | null;
}
```

---

## Phase 2: Write APIs (User Interactions)

### API 4 — `complete_journey_node`

Atomically completes a node server-side — validates the node is active, marks it completed, unlocks the next node, and grants XP/gems/hearts rewards — all in one DB transaction.

| Detail              | Value                                                                      |
| ------------------- | -------------------------------------------------------------------------- |
| **Client function** | `completeNodeApi()` in `src/lib/api/journeyApi.ts:182`                     |
| **Supabase RPC**    | `complete_journey_node`                                                    |
| **Called from**     | `TaskScreen.handleComplete()` and `JourneyMapContainer.handleChestClaim()` |

**Request params:**

```ts
{
  p_enrollment_id: string;
  p_node_id: string;
}
```

**Response type — `CompleteNodeResponse`** (`src/types/journey/progress.ts:67`):

```ts
interface CompleteNodeResponse {
  success: boolean;
  error?: string;
  rewards?: {
    xp: number;
    gems: number;
    hearts: number;
  };
}
```

**Post-completion flow:**

1. Client applies optimistic local update via `completeNode()` action
2. Calls `completeNodeApi()` on server
3. On success, re-fetches `get_section_map` to refresh the map with server-authoritative state

---

### API 5 — `replay_completed_journey_node`

Same as API 4 but for re-visiting already-completed nodes in "completed" journey mode.

| Detail              | Value                                                            |
| ------------------- | ---------------------------------------------------------------- |
| **Client function** | `replayCompletedNodeApi()` in `src/lib/api/journeyApi.ts:217`    |
| **Supabase RPC**    | `replay_completed_journey_node`                                  |
| **Called from**     | `TaskScreen.handleComplete()` when `journeyMode === 'completed'` |

Same request/response shape as API 4.

---

### API 6 — `user_node_progress` table update

Direct Supabase table mutation (not RPC) for updating the progress float (0–1) during a task. Fire-and-forget.

| Detail              | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Client function** | `updateNodeProgress()` in `src/lib/api/journeyApi.ts:142` |
| **Table**           | `user_node_progress`                                      |
| **Called from**     | `JourneyMapContainer.handleUpdateProgress()`              |

**Payload:**

```ts
{
  enrollmentId: string;
  nodeId: string;
  progress: number;
}
```

**Response:**

```ts
{
  data: {
    nodeId: string;
    progress: number;
  }
  success: boolean;
}
```

---

### API 7 — Enrollment

Creates a new enrollment + first active node progress row when user starts a journey.

| Detail              | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| **Client function** | `enrollInJourney()` in `src/lib/api/journeyApi.ts:264`             |
| **Tables**          | `user_journey_enrollments` (insert), `user_node_progress` (insert) |
| **Post-action**     | Re-fetches via `get_user_journey_progress` to return clean state   |

**Payload:**

```ts
{
  journeyId: string;
  templateVersion: number;
  firstNodeId: string;
}
```

---

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   MAP RENDERING                      │
│                                                      │
│  1. get_section_map(slug)                            │
│     └→ SectionMapResponse                            │
│        ├─ section.nodes[]  → FlashList cells         │
│        ├─ progress[]       → node status/colors      │
│        ├─ enrollment       → gate logic              │
│        └─ sectionList[]    → sticky header tabs      │
│                                                      │
│  2. get_node_content(nodeId)  ← on tap               │
│     └→ NodeContentResponse                           │
│        └─ content{}  → NodeRenderer dispatch         │
├──────────────────────────────────────────────────────┤
│                   INTERACTIONS                        │
│                                                      │
│  3. complete_journey_node(enrollmentId, nodeId)       │
│     └→ { success, rewards? }                         │
│     └→ re-fetch get_section_map to refresh map       │
│                                                      │
│  4. user_node_progress.update(progress: 0.0–1.0)    │
│     └→ fire-and-forget progress ring updates         │
└──────────────────────────────────────────────────────┘
```

---

## Sample Test Data

### `get_section_map` — Sample Response

```json
{
  "viewMode": "active",
  "focusNodeId": "node-003",
  "journey": {
    "id": "journey-001",
    "slug": "anxiety-toolkit",
    "title": "Anxiety Toolkit",
    "version": 3,
    "colorScheme": "teal",
    "totalSections": 4
  },
  "section": {
    "id": "section-001",
    "unitNumber": 1,
    "sectionNumber": 1,
    "title": "Understanding Anxiety",
    "description": "Learn the basics of how anxiety works and build your first coping tools.",
    "colorScheme": "teal",
    "mascotPlacements": [
      {
        "afterNodeIndex": 2,
        "side": "left",
        "message": "You're doing great! Keep going."
      }
    ],
    "unlockRule": "sequential",
    "unitCount": 2,
    "nodes": [
      {
        "id": "node-001",
        "unitId": "unit-001",
        "unitNumber": 1,
        "globalUnitNumber": 1,
        "nodeIndex": 0,
        "nodeType": "learn",
        "taskId": "task-learn-001",
        "variantKey": "default",
        "title": "What Is Anxiety?",
        "iconKey": "brain",
        "xpReward": 15,
        "estimatedMinutes": 3,
        "rewards": [{ "type": "xp", "amount": 15 }],
        "isTrophy": false,
        "canInteract": true
      },
      {
        "id": "node-002",
        "unitId": "unit-001",
        "unitNumber": 1,
        "globalUnitNumber": 1,
        "nodeIndex": 1,
        "nodeType": "exercise",
        "taskId": "task-exercise-001",
        "variantKey": "breathing",
        "title": "Box Breathing",
        "iconKey": "lungs",
        "xpReward": 20,
        "estimatedMinutes": 5,
        "rewards": [{ "type": "xp", "amount": 20 }],
        "isTrophy": false,
        "canInteract": true
      },
      {
        "id": "node-003",
        "unitId": "unit-001",
        "unitNumber": 1,
        "globalUnitNumber": 1,
        "nodeIndex": 2,
        "nodeType": "quiz",
        "taskId": "task-quiz-001",
        "variantKey": "default",
        "title": "Quick Check",
        "iconKey": "clipboard",
        "xpReward": 10,
        "estimatedMinutes": 2,
        "rewards": [{ "type": "xp", "amount": 10 }],
        "isTrophy": false,
        "canInteract": true
      },
      {
        "id": "node-004",
        "unitId": "unit-002",
        "unitNumber": 2,
        "globalUnitNumber": 2,
        "nodeIndex": 0,
        "nodeType": "journal",
        "taskId": "task-journal-001",
        "variantKey": "default",
        "title": "Anxiety Journal",
        "iconKey": "pencil",
        "xpReward": 15,
        "estimatedMinutes": 5,
        "rewards": [{ "type": "xp", "amount": 15 }],
        "isTrophy": false,
        "canInteract": true
      },
      {
        "id": "node-005",
        "unitId": "unit-002",
        "unitNumber": 2,
        "globalUnitNumber": 2,
        "nodeIndex": 1,
        "nodeType": "mood_check",
        "taskId": "task-mood-001",
        "variantKey": "default",
        "title": "How Are You Feeling?",
        "iconKey": "smile",
        "xpReward": 5,
        "estimatedMinutes": 1,
        "rewards": [{ "type": "xp", "amount": 5 }],
        "isTrophy": false,
        "canInteract": true
      },
      {
        "id": "node-006",
        "unitId": "unit-002",
        "unitNumber": 2,
        "globalUnitNumber": 2,
        "nodeIndex": 2,
        "nodeType": "checkpoint",
        "taskId": "task-checkpoint-001",
        "variantKey": "trophy",
        "title": "Section 1 Complete!",
        "iconKey": "trophy",
        "xpReward": 50,
        "estimatedMinutes": 2,
        "rewards": [
          { "type": "xp", "amount": 50 },
          { "type": "gems", "amount": 10 }
        ],
        "isTrophy": true,
        "canInteract": true
      }
    ],
    "units": [
      {
        "id": "unit-001",
        "sectionId": "section-001",
        "sectionNumber": 1,
        "unitNumber": 1,
        "globalUnitNumber": 1,
        "title": "The Basics",
        "description": "Learn what anxiety is and try your first breathing exercise.",
        "colorScheme": "teal",
        "mascotPlacements": [],
        "unlockRule": "sequential",
        "nodes": ["(same as section.nodes filtered by unitId = unit-001)"]
      },
      {
        "id": "unit-002",
        "sectionId": "section-001",
        "sectionNumber": 1,
        "unitNumber": 2,
        "globalUnitNumber": 2,
        "title": "Reflect & Review",
        "description": "Journal about your experience and check in on your mood.",
        "colorScheme": "teal",
        "mascotPlacements": [],
        "unlockRule": "sequential",
        "nodes": ["(same as section.nodes filtered by unitId = unit-002)"]
      }
    ]
  },
  "progress": [
    {
      "nodeId": "node-001",
      "status": "completed",
      "progress": 1.0,
      "rewardClaimed": true,
      "completedAt": "2026-04-15T10:30:00Z"
    },
    {
      "nodeId": "node-002",
      "status": "completed",
      "progress": 1.0,
      "rewardClaimed": true,
      "completedAt": "2026-04-15T10:45:00Z"
    },
    {
      "nodeId": "node-003",
      "status": "active",
      "progress": 0.0,
      "rewardClaimed": false,
      "completedAt": null
    }
  ],
  "enrollment": {
    "id": "enrollment-001",
    "currentUnitNumber": 1,
    "currentSectionNumber": 1,
    "currentSectionUnitNumber": 1,
    "currentSectionId": "section-001",
    "currentUnitId": "unit-001",
    "status": "active",
    "templateVersion": 3
  },
  "sectionList": [
    {
      "unitNumber": 1,
      "sectionNumber": 1,
      "title": "Understanding Anxiety",
      "colorScheme": "teal",
      "nodeCount": 6,
      "unitCount": 2
    },
    {
      "unitNumber": 2,
      "sectionNumber": 2,
      "title": "Coping Strategies",
      "colorScheme": "blue",
      "nodeCount": 8,
      "unitCount": 2
    },
    {
      "unitNumber": 3,
      "sectionNumber": 3,
      "title": "Building Resilience",
      "colorScheme": "purple",
      "nodeCount": 7,
      "unitCount": 2
    },
    {
      "unitNumber": 4,
      "sectionNumber": 4,
      "title": "Maintaining Progress",
      "colorScheme": "green",
      "nodeCount": 5,
      "unitCount": 1
    }
  ]
}
```

**What this tells the UI:**

- User is on Section 1 ("Understanding Anxiety") of the "Anxiety Toolkit" journey
- 6 nodes total in 2 units: The Basics (3 nodes) and Reflect & Review (3 nodes)
- Nodes 1–2 are completed, node 3 ("Quick Check" quiz) is the active node
- Nodes 4–6 are locked (no progress entries = LOCKED status in the bridge)
- `focusNodeId: "node-003"` tells FlashList to auto-scroll to the active quiz
- 4 sections total are available in the sticky header tab bar

---

### `get_node_content` — Sample Responses

#### Learn Node

```json
{
  "id": "node-001",
  "nodeType": "learn",
  "title": "What Is Anxiety?",
  "description": "Understanding the science behind your body's alarm system.",
  "content": {
    "cards": [
      {
        "id": "card-1",
        "type": "text",
        "heading": "Your Brain's Alarm System",
        "body": "Anxiety is your brain's natural response to perceived threats. It activates the 'fight or flight' system, releasing adrenaline and cortisol.",
        "imageUrl": null
      },
      {
        "id": "card-2",
        "type": "image",
        "heading": "The Anxiety Cycle",
        "body": "Thoughts, physical sensations, and behaviors feed into each other, creating a cycle that can feel overwhelming.",
        "imageUrl": "https://cdn.example.com/images/anxiety-cycle.png"
      },
      {
        "id": "card-3",
        "type": "text",
        "heading": "Key Takeaway",
        "body": "Anxiety isn't a flaw — it's a feature. The goal isn't to eliminate it, but to manage it so it doesn't manage you.",
        "imageUrl": null
      }
    ]
  }
}
```

#### Exercise Node

```json
{
  "id": "node-002",
  "nodeType": "exercise",
  "title": "Box Breathing",
  "description": "A simple 4-4-4-4 breathing technique used by Navy SEALs.",
  "content": {
    "exerciseType": "boxBreathing",
    "steps": [
      {
        "id": "step-1",
        "instruction": "Find a comfortable position and close your eyes.",
        "durationSeconds": null,
        "inputType": null
      },
      {
        "id": "step-2",
        "instruction": "Breathe in slowly for 4 seconds.",
        "durationSeconds": 4,
        "inputType": "timer"
      },
      {
        "id": "step-3",
        "instruction": "Hold your breath for 4 seconds.",
        "durationSeconds": 4,
        "inputType": "timer"
      },
      {
        "id": "step-4",
        "instruction": "Exhale slowly for 4 seconds.",
        "durationSeconds": 4,
        "inputType": "timer"
      },
      {
        "id": "step-5",
        "instruction": "Hold for 4 seconds before repeating.",
        "durationSeconds": 4,
        "inputType": "timer"
      }
    ],
    "repeatCount": 4,
    "completionMessage": "Great job! Regular practice makes this technique more effective."
  }
}
```

#### Quiz Node

```json
{
  "id": "node-003",
  "nodeType": "quiz",
  "title": "Quick Check",
  "description": "Test what you've learned so far.",
  "content": {
    "questions": [
      {
        "id": "q1",
        "text": "What system does anxiety activate in your body?",
        "options": [
          { "id": "a", "text": "Digestive system" },
          { "id": "b", "text": "Fight or flight system" },
          { "id": "c", "text": "Immune system" },
          { "id": "d", "text": "Circulatory system" }
        ],
        "correctOptionId": "b",
        "explanation": "Anxiety activates the sympathetic nervous system, commonly known as the 'fight or flight' response."
      },
      {
        "id": "q2",
        "text": "What is the goal of anxiety management?",
        "options": [
          { "id": "a", "text": "Eliminate all anxiety" },
          { "id": "b", "text": "Suppress anxious thoughts" },
          { "id": "c", "text": "Manage it so it doesn't manage you" },
          { "id": "d", "text": "Avoid all stressful situations" }
        ],
        "correctOptionId": "c",
        "explanation": "The goal isn't to eliminate anxiety (it's a natural response), but to develop tools to manage it effectively."
      }
    ],
    "passingScore": 0.5,
    "showExplanations": true
  }
}
```

#### Journal Node

```json
{
  "id": "node-004",
  "nodeType": "journal",
  "title": "Anxiety Journal",
  "description": "Reflect on your relationship with anxiety.",
  "content": {
    "prompts": [
      {
        "id": "p1",
        "text": "Describe a recent situation where you felt anxious. What was happening?",
        "placeholder": "I felt anxious when...",
        "minLength": 20
      },
      {
        "id": "p2",
        "text": "What physical sensations did you notice in your body?",
        "placeholder": "I noticed...",
        "minLength": 10
      },
      {
        "id": "p3",
        "text": "Looking back, what would you tell yourself in that moment?",
        "placeholder": "I would say...",
        "minLength": 10
      }
    ],
    "saveToJournal": true,
    "journalCategory": "anxiety"
  }
}
```

#### Mood Check Node

```json
{
  "id": "node-005",
  "nodeType": "mood_check",
  "title": "How Are You Feeling?",
  "description": "A quick check-in on your current mood.",
  "content": {
    "scale": [
      { "value": 1, "label": "Awful", "emoji": "😣" },
      { "value": 2, "label": "Bad", "emoji": "😞" },
      { "value": 3, "label": "Okay", "emoji": "😐" },
      { "value": 4, "label": "Good", "emoji": "😊" },
      { "value": 5, "label": "Great", "emoji": "😄" }
    ],
    "followUpPrompt": "What's contributing to how you feel right now?",
    "trackOverTime": true
  }
}
```

#### Checkpoint Node (Trophy)

```json
{
  "id": "node-006",
  "nodeType": "checkpoint",
  "title": "Section 1 Complete!",
  "description": "You've finished Understanding Anxiety.",
  "content": {
    "badge_key": "anxiety-basics",
    "badge_name": "Anxiety Explorer",
    "badge_description": "Completed the Understanding Anxiety section",
    "skills_recap": [
      "Understand how anxiety works",
      "Practice box breathing",
      "Reflect through journaling"
    ],
    "show_mood_comparison": true
  }
}
```

---

### `complete_journey_node` — Sample Response

**Request:**

```json
{
  "p_enrollment_id": "enrollment-001",
  "p_node_id": "node-003"
}
```

**Response:**

```json
{
  "success": true,
  "rewards": {
    "xp": 10,
    "gems": 0,
    "hearts": 0
  }
}
```

---

### `get_journey_catalog` — Sample Response

```json
[
  {
    "id": "journey-001",
    "slug": "anxiety-toolkit",
    "title": "Anxiety Toolkit",
    "description": "Build practical tools to understand and manage anxiety.",
    "iconUrl": "https://cdn.example.com/icons/anxiety.png",
    "colorScheme": "teal",
    "totalNodes": 26,
    "completedNodes": 2,
    "isEnrolled": true,
    "enrollmentStatus": "active"
  },
  {
    "id": "journey-002",
    "slug": "sleep-better",
    "title": "Sleep Better",
    "description": "Improve your sleep quality with CBT-I techniques.",
    "iconUrl": "https://cdn.example.com/icons/sleep.png",
    "colorScheme": "indigo",
    "totalNodes": 20,
    "completedNodes": 0,
    "isEnrolled": false,
    "enrollmentStatus": null
  },
  {
    "id": "journey-003",
    "slug": "self-esteem",
    "title": "Building Self-Esteem",
    "description": "Challenge negative self-beliefs and build confidence.",
    "iconUrl": "https://cdn.example.com/icons/esteem.png",
    "colorScheme": "amber",
    "totalNodes": 22,
    "completedNodes": 22,
    "isEnrolled": true,
    "enrollmentStatus": "completed"
  }
]
```
