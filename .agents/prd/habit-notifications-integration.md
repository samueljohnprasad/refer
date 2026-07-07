https://www.remoteopenclaw.com/skills/nexu-io/open-design/impeccable-design-polish


# Habit Notifications Integration Guide

## Overview

This guide explains how to integrate habit reminders/notifications into your app. Notifications are scheduled based on:

- Reminder enabled status
- Repeat pattern (daily, weekly, monthly, yearly, never)
- Scheduled time
- Repeat days (for weekly patterns)

## Files Created

1. **`src/utils/habitNotifications.ts`** - Core notification scheduling logic
2. **`src/utils/habitNotificationHandlers.ts`** - Handlers for create/update/delete operations

## Integration Steps

### 1. Add to HabitsSection.tsx

Add these imports at the top:

```tsx
import {
  handleHabitCreated,
  handleHabitUpdated,
  handleHabitDeleted,
} from "@/src/utils/habitNotificationHandlers";
```

Update the `handleCreateHabit` function:

```tsx
const handleCreateHabit = async (formData: CreateHabitFormData) => {
  const created = await createHabit(formData);
  if (created) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Schedule notification if reminder is enabled
    await handleHabitCreated(created);
  }
};
```

Update the `handleSaveScheduling` function:

```tsx
const handleSaveScheduling = async (
  habitId: string,
  schedulingData: HabitSchedulingData
) => {
  // Update habit with scheduling data
  await updateHabit(habitId, schedulingData);

  // Update notifications
  const updatedHabit = habits.find((h) => h.id === habitId);
  if (updatedHabit) {
    await handleHabitUpdated({
      ...updatedHabit,
      ...schedulingData,
    });
  }

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
```

### 2. Add to useHabits.ts (deleteHabit function)

Update the `deleteHabit` function to cancel notifications:

```tsx
import { handleHabitDeleted } from "@/src/utils/habitNotificationHandlers";

const deleteHabit = useCallback(
  async (habitId: string): Promise<boolean> => {
    if (!session?.user?.id) {
      setError("User not authenticated");
      return false;
    }

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId)
        .eq("user_id", session.user.id);

      if (deleteError) throw deleteError;

      // Cancel any scheduled notifications for this habit
      await handleHabitDeleted(habitId);

      // Update local state
      setHabits((prev) => prev.filter((habit) => habit.id !== habitId));

      return true;
    } catch (err) {
      console.error("Error deleting habit:", err);
      setError(err instanceof Error ? err.message : "Failed to delete habit");
      return false;
    }
  },
  [session?.user?.id]
);
```

### 3. Sync notifications on app start (optional but recommended)

In your main app component or HabitsSection, add an effect to sync notifications:

```tsx
import { syncHabitNotifications } from "@/src/utils/habitNotificationHandlers";
import { useEffect } from "react";

useEffect(() => {
  // Sync all habit notifications when the component mounts
  if (habits.length > 0) {
    syncHabitNotifications(habits);
  }
}, [habits]);
```

## How It Works

### Daily Notifications

- Schedules a repeating notification at the specified time every day
- Example: Reminder at 9:00 AM every day

### Weekly Notifications

- Schedules a repeating notification on specific days of the week
- Uses the first day in `repeatDays` array (0=Sunday, 6=Saturday)
- Example: Reminder every Monday at 7:00 AM

### Monthly Notifications

- Schedules a repeating notification on the same day of the month
- Example: Reminder on the 15th of every month at 10:00 AM

### Yearly Notifications

- Schedules a repeating notification on the same date every year
- Example: Reminder on January 1st at 8:00 AM

### One-time (Never)

- Schedules a single notification
- If the time has passed today, schedules for tomorrow

## Notification Lifecycle

1. **Create Habit**: When a habit is created with reminder enabled, a notification is scheduled
2. **Update Habit**: When scheduling data is saved, the old notification is cancelled and a new one is scheduled
3. **Delete Habit**: All notifications for that habit are cancelled
4. **Toggle Reminder**: Enabling creates a notification, disabling cancels it

## Permission Handling

The system automatically:

- Requests notification permissions when needed
- Creates an Android notification channel for habits
- Handles permission-denied gracefully (returns null)

## Testing

To test notifications:

1. Create a habit
2. Enable reminder
3. Set a time 1-2 minutes in the future
4. Select repeat pattern
5. Save the habit
6. Wait for the notification

To verify scheduled notifications:

```tsx
import * as Notifications from "expo-notifications";

// Check all scheduled notifications
const scheduled = await Notifications.getAllScheduledNotificationsAsync();
console.log("Scheduled notifications:", scheduled);
```

## Edge Cases Handled

✅ Permission denied - gracefully returns null  
✅ Multiple notifications for same habit - old ones are cancelled  
✅ Habit deletion - notifications are cancelled  
✅ Reminder disabled - notifications are cancelled  
✅ Time in the past - schedules for next occurrence  
✅ Invalid time format - handled with validation

## Future Enhancements

- [ ] Sound customization per habit
- [ ] Snooze functionality
- [ ] Notification action buttons (Complete/Dismiss)
- [ ] Notification history
- [ ] Smart reminders (adapt to user behavior)
