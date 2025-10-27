# Notifications Module

This module contains all the components, hooks, and utilities for managing daily reminder notifications.

## Structure

```
notifications/
├── index.ts                    # Barrel export for all public APIs
├── types.ts                    # TypeScript type definitions
├── constants.ts                # Default data and color schemes
├── utils.ts                    # Utility functions
├── store.ts                    # Jotai atom for global state
├── ReminderCard.tsx            # Individual reminder card component
├── NotificationHeader.tsx      # Header section with animations
├── useReminderConfig.ts        # Custom hook for reminder logic
└── README.md                   # This file
```

## Files Overview

### `types.ts`
Defines all TypeScript types used across the module:
- `ReminderItem`: Shape of a reminder item
- `ReminderColorScheme`: Color scheme structure
- Icon type definitions

### `constants.ts`
Contains static data:
- `DEFAULT_REMINDERS`: Array of default reminder configurations
- `REMINDER_COLOR_MAP`: Color schemes for each reminder type
- `DEFAULT_COLOR_SCHEME`: Fallback colors

### `utils.ts`
Utility functions:
- `getColorForReminder()`: Returns color scheme for a reminder ID

### `store.ts`
Global state management:
- `cfgAtom`: Jotai atom for reminder configuration

### `ReminderCard.tsx`
Presentational component for individual reminder cards:
- Displays reminder icon, title, time
- Handles selection state with animations
- Color-coded based on reminder type
- Accessible with proper ARIA labels

### `NotificationHeader.tsx`
Header section component:
- Animated Lottie icon
- Motivational text
- Stats badge
- Entry animations

### `useReminderConfig.ts`
Custom hook that encapsulates all reminder logic:
- Loads saved configuration
- Manages editing state
- Handles time updates
- Toggles reminders on/off
- Requests permissions

## Usage

```tsx
import NotificationsUI from "@/src/components/NotificationsUI";

// Use the component
<NotificationsUI />
```

## Key Features

1. **Separation of Concerns**: Logic, presentation, and data are separated
2. **Reusability**: Components and hooks can be used independently
3. **Type Safety**: Full TypeScript coverage
4. **Maintainability**: Clear file structure and documentation
5. **Testability**: Pure functions and isolated components

## Adding a New Reminder

To add a new reminder type:

1. Add entry to `DEFAULT_REMINDERS` in `constants.ts`
2. Add color scheme to `REMINDER_COLOR_MAP` in `constants.ts`
3. The rest is handled automatically!

## Color Schemes

Each reminder has a unique color scheme:
- **Morning Reflection**: Amber/Yellow (#FEF3C7)
- **Midday Check-in**: Green (#D1FAE5)
- **Evening Wind-down**: Purple (#E9D5FF)

## State Management

The module uses Jotai for state management with a single atom (`cfgAtom`) that stores the reminder configuration. This is synced with AsyncStorage for persistence.
