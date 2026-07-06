# Habit Tracker Feature - Product Requirements Document

## Overview

Add a habit tracking feature to the existing journaling app that allows users to create, manage, and track daily habits with satisfying check-in experiences.

---

## Problem Statement

Users want to build positive daily routines alongside their journaling practice. Currently, there's no way to track recurring habits or celebrate daily progress on personal goals.

---

## Goals

1. Enable users to create and track multiple daily habits
2. Provide pre-selected habit templates for easy onboarding
3. Create a satisfying, rewarding check-in experience
4. Integrate seamlessly with the existing app design and user experience

---

## User Stories

### As a user, I want to:

- Add new habits from a list of pre-selected options
- Create my own custom habits with a name and motivational description
- See my habits displayed every day going forward from creation
- Check-in/complete habits with a satisfying interaction
- View my habit completion history
- Feel motivated through positive feedback when completing habits

---

## Feature Requirements

### 1. Habit Creation Screen

#### 1.1 Access Point

- **Add Habit Button**: Floating action button or dedicated section on the main screen
- **Location**: Accessible from the Journal Calendar Screen or a new Habits tab

#### 1.2 Pre-Selected Habits

Provide a curated list of common habits for quick selection:

| Category         | Habits                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **Health**       | Drink 8 glasses of water, Exercise for 30 mins, Take vitamins, Get 8 hours of sleep, Meditate |
| **Productivity** | Read for 15 mins, No social media before noon, Complete top 3 tasks, Practice gratitude       |
| **Self-Care**    | Skincare routine, Stretch in the morning, Go for a walk, Practice deep breathing              |
| **Mindfulness**  | Journal entry, 5-minute meditation, Digital detox hour, Mindful eating                        |

#### 1.3 Custom Habit Creation

- **Habit Name**: Text input (required, max 50 characters)
- **Motivational Description**: Text input (optional, max 200 characters)
  - Prompt: "Why is this habit important to you?"
  - Example: "To feel more energized and focused throughout the day"
- **Icon Selection**: Choose from a set of icons (optional, default provided)
- **Color Selection**: Pick an accent color for the habit (optional)

#### 1.4 UI/UX Requirements

- Bottom sheet modal for habit creation
- Smooth animations when selecting pre-defined habits
- Haptic feedback on selection (Light impact)
- Premium, clean design matching existing app aesthetic

---

### 2. Habit Display & Check-In

#### 2.1 Daily Habit List

- **Location**: Dedicated section on the home/journal screen OR new Habits tab
- **Display**: Show all active habits for the current day
- **Persistence**: Habits appear every day from creation date forward
- **Order**: User-defined order or most recently completed first

#### 2.2 Habit Card Component

```
┌─────────────────────────────────────────┐
│  [Icon]  Habit Name                [✓]  │
│          Motivational description       │
│          Streak: 🔥 5 days              │
└─────────────────────────────────────────┘
```

**States:**

- **Uncompleted**: Default state, checkbox empty
- **Completed**: Checked state with visual celebration
- **Missed**: Only shown in history view (previous days)

#### 2.3 Check-In Interaction

When user taps to complete a habit:

1. **Haptic Feedback**: Heavy impact for satisfaction
2. **Visual Animation**:
   - Checkbox fills with animated checkmark
   - Brief confetti/particle effect (subtle)
   - Card briefly scales up and back (spring animation)
   - Background color shifts to success green momentarily
3. **Sound** (optional): Subtle completion sound
4. **Streak Update**: Increment and display updated streak

#### 2.4 Unchecking a Habit

- Allow users to uncheck if tapped by mistake
- Light haptic feedback
- Reverse animation (fade out checkmark)

---

### 3. Habit Management

#### 3.1 Edit Habit

- Long-press or swipe to access edit options
- Modify name, description, icon, color
- Cannot change creation date

#### 3.2 Delete Habit

- Swipe to delete or access from edit modal
- Confirmation dialog with warning haptic
- Soft delete (can restore within 7 days)

#### 3.3 Pause Habit

- Temporarily hide habit without deleting
- Maintains streak data
- Can be resumed anytime

#### 3.4 Reorder Habits

- Drag and drop to reorder
- Haptic feedback on pick up and drop

---

### 4. Habit History & Analytics

#### 4.1 Calendar View

- Visual representation of habit completion
- Color-coded dots for each habit
- Tap date to see detailed view

#### 4.2 Streak Tracking

- Current streak count
- Longest streak ever
- Streak restoration (if premium): Allow 1 missed day to not break streak

#### 4.3 Statistics

- Completion rate (percentage)
- Total completions
- Best performing habits
- Weekly/Monthly trends

---

## Database Schema

### Table: `habits`

| Column      | Type         | Description              |
| ----------- | ------------ | ------------------------ |
| id          | UUID         | Primary key              |
| user_id     | UUID         | Foreign key to users     |
| name        | VARCHAR(50)  | Habit name               |
| description | VARCHAR(200) | Motivational description |
| icon        | VARCHAR(50)  | Icon identifier          |
| color       | VARCHAR(7)   | Hex color code           |
| created_at  | TIMESTAMP    | Creation date            |
| is_active   | BOOLEAN      | Whether habit is active  |
| sort_order  | INTEGER      | Display order            |

### Table: `habit_completions`

| Column         | Type      | Description              |
| -------------- | --------- | ------------------------ |
| id             | UUID      | Primary key              |
| habit_id       | UUID      | Foreign key to habits    |
| user_id        | UUID      | Foreign key to users     |
| completed_date | DATE      | Date of completion       |
| completed_at   | TIMESTAMP | Exact time of completion |

---

## Technical Implementation

### Frontend Components

```
src/
├── screens/
│   └── HabitsScreen/
│       ├── HabitsScreen.tsx           # Main habits view
│       ├── HabitCard.tsx               # Individual habit card
│       ├── AddHabitModal.tsx           # Habit creation bottom sheet
│       ├── PresetHabits.tsx            # Pre-selected habits list
│       └── HabitHistoryView.tsx        # Calendar/history view
├── components/
│   └── habits/
│       ├── HabitCheckbox.tsx           # Animated checkbox
│       ├── StreakBadge.tsx             # Streak display
│       └── HabitCompletionAnimation.tsx # Celebration animation
└── hooks/
    └── data/
        ├── useHabits.ts                # Habit CRUD operations
        ├── useHabitCompletions.ts      # Completion tracking
        └── useHabitStreaks.ts          # Streak calculations
```

### State Management

- Use Jotai atoms for local state
- React Query for server state and caching
- Optimistic updates for instant feedback

### Animations (react-native-reanimated)

- Spring animations for check-in
- Fade/scale for card interactions
- Shared element transitions where applicable

### Haptics (expo-haptics)

| Action                   | Haptic Type                   |
| ------------------------ | ----------------------------- |
| Select pre-defined habit | Light                         |
| Complete habit           | Heavy                         |
| Uncomplete habit         | Light                         |
| Delete habit (confirm)   | Warning notification          |
| Drag reorder             | Light on pick, Medium on drop |

---

## Design Guidelines

### Visual Style

- Match existing app aesthetic (clean, minimal, premium)
- Use existing color palette with optional habit-specific accents
- Consistent typography (Cormorant for headers, system font for body)

### Micro-interactions

- Every interaction should feel responsive and satisfying
- Subtle animations that don't slow down the experience
- Clear visual feedback for all state changes

---

## Success Metrics

1. **Engagement**: % of users creating at least 1 habit
2. **Retention**: Daily habit check-in rate
3. **Streak Length**: Average and median streak lengths
4. **Feature Adoption**: % of journaling users also using habits

---

## Timeline & Phases

### Phase 1: MVP (Week 1-2)

- [ ] Database schema and Supabase setup
- [ ] Basic habit CRUD operations
- [ ] Habit display on daily view
- [ ] Simple check-in functionality with haptics

### Phase 2: Enhanced Experience (Week 3)

- [ ] Pre-selected habits library
  - [x] Create `presetHabits.json` with habit definitions
  - [x] Implement `PresetsList` component to display presets
  - [x] Integrate presets into `AddHabitModal`
- [ ] Animations and celebrations
  - [ ] Add confetti animation on habit completion
  - [ ] Optional completion sound effect
- [ ] Streak tracking
  - [ ] Extend habit schema with `currentStreak` and `longestStreak` fields
  - [ ] Create `StreakBadge` component to display streaks
  - [ ] Show streak information on `HabitCard` and streak overview screen
- [ ] Habit reordering
  - [ ] Implement drag-and-drop list using `reanimated-draggable`
  - [ ] Persist `sort_order` in Supabase database
  - [ ] Add UI affordance for entering reordering mode

### Phase 3: Analytics & Polish (Week 4)

- [ ] History calendar view
- [ ] Statistics and insights
- [ ] Edit/delete/pause functionality
- [ ] Final polish and testing

---

## Open Questions

1. Should habits sync with device reminders/notifications?
2. Should there be a limit on number of habits?
3. Premium-only features (streak restore, advanced analytics)?
4. Integration with existing mood/journal insights?

---

## Dependencies

- Existing Supabase infrastructure
- react-native-reanimated (already installed)
- expo-haptics (already installed)
- @gorhom/bottom-sheet (already installed)

---

## Appendix: Pre-Selected Habits JSON

```json
{
  "presetHabits": [
    {
      "category": "Health",
      "habits": [
        {
          "name": "Drink 8 glasses of water",
          "icon": "droplet",
          "description": "Stay hydrated for better energy and focus"
        },
        {
          "name": "Exercise for 30 mins",
          "icon": "activity",
          "description": "Move your body, clear your mind"
        },
        {
          "name": "Take vitamins",
          "icon": "pill",
          "description": "Support your body's daily needs"
        },
        {
          "name": "Get 8 hours of sleep",
          "icon": "moon",
          "description": "Rest is essential for recovery"
        },
        {
          "name": "Meditate",
          "icon": "brain",
          "description": "Find your calm and center"
        }
      ]
    },
    {
      "category": "Productivity",
      "habits": [
        {
          "name": "Read for 15 mins",
          "icon": "book",
          "description": "Expand your mind daily"
        },
        {
          "name": "No social media before noon",
          "icon": "smartphone-off",
          "description": "Protect your morning focus"
        },
        {
          "name": "Complete top 3 tasks",
          "icon": "check-square",
          "description": "Prioritize what matters most"
        },
        {
          "name": "Practice gratitude",
          "icon": "heart",
          "description": "Appreciate the good in your life"
        }
      ]
    },
    {
      "category": "Self-Care",
      "habits": [
        {
          "name": "Skincare routine",
          "icon": "sparkles",
          "description": "Take care of your skin"
        },
        {
          "name": "Stretch in the morning",
          "icon": "sun",
          "description": "Wake up your body gently"
        },
        {
          "name": "Go for a walk",
          "icon": "footprints",
          "description": "Fresh air and movement"
        },
        {
          "name": "Deep breathing exercises",
          "icon": "wind",
          "description": "Calm your nervous system"
        }
      ]
    },
    {
      "category": "Mindfulness",
      "habits": [
        {
          "name": "Write a journal entry",
          "icon": "edit",
          "description": "Reflect on your thoughts and feelings"
        },
        {
          "name": "5-minute meditation",
          "icon": "lotus",
          "description": "A moment of peace"
        },
        {
          "name": "Digital detox hour",
          "icon": "power",
          "description": "Disconnect to reconnect"
        },
        {
          "name": "Mindful eating",
          "icon": "utensils",
          "description": "Savor every bite"
        }
      ]
    }
  ]
}
```
