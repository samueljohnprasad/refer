# 🚀 Advanced Features Implementation Guide

## Overview

This guide covers the implementation of four major features:
1. **Push Notifications** - Streak reminders
2. **Achievements System** - Badges for milestones
3. **Streak Recovery** - Premium feature to restore broken streaks
4. **Streak Insights** - Analytics and patterns

---

## 📋 Table of Contents

- [Setup Instructions](#setup-instructions)
- [Feature 1: Push Notifications](#feature-1-push-notifications)
- [Feature 2: Achievements System](#feature-2-achievements-system)
- [Feature 3: Streak Recovery](#feature-3-streak-recovery)
- [Feature 4: Streak Insights](#feature-4-streak-insights)
- [Integration Guide](#integration-guide)
- [Testing](#testing)

---

## 🛠️ Setup Instructions

### Step 1: Database Migrations

Run this SQL in your Supabase SQL Editor:

```sql
-- File: supabase_migrations_achievements.sql
-- Copy and paste the entire file contents
```

This creates:
- `achievements` table - All available achievements
- `user_achievements` table - User progress tracking
- Default achievements (25+ badges)
- Helper function `check_and_award_achievements()`

### Step 2: Install Dependencies

```bash
npm install expo-notifications
# or
yarn add expo-notifications
```

### Step 3: Configure app.json

Ensure you have notification permissions in `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "defaultChannel": "default"
        }
      ]
    ]
  }
}
```

---

## Feature 1: Push Notifications

### 📁 Files Created

- `hooks/notifications/useStreakReminders.ts` - Main notification hook

### 🎯 Features

#### **Daily Reminders**
- Schedule recurring notifications at user's preferred time
- Reminds users to maintain their streak

#### **Streak Warnings**
- Evening notifications if user hasn't journaled
- Prevents streak breaks

#### **Milestone Celebrations**
- Automatic notifications for achievements (3, 7, 30, 100 days, etc.)

#### **Immediate Reminders**
- On-demand reminder if user hasn't journaled today

### 💻 Usage

```typescript
import { useStreakReminders } from "@/hooks/notifications/useStreakReminders";

function SettingsScreen() {
  const {
    scheduleStreakReminder,
    sendImmediateReminder,
    sendStreakWarning,
    sendMilestoneNotification,
    cancelAllStreakReminders,
  } = useStreakReminders();

  // Schedule daily reminder at 9 AM
  const handleSetReminder = async () => {
    await scheduleStreakReminder({
      hour: 9,
      minute: 0,
      enabled: true,
    });
  };

  // Send immediate reminder
  const handleRemindNow = async () => {
    await sendImmediateReminder();
  };

  // Celebrate milestone
  const handleMilestone = async () => {
    await sendMilestoneNotification(7); // 7 day milestone
  };
}
```

### 🔔 Notification Types

| Type | Trigger | Example |
|------|---------|---------|
| Daily Reminder | Scheduled time | "Don't break your streak! 🔥" |
| Streak Warning | Evening, no entry | "⚠️ Your streak is about to break!" |
| Milestone | Achievement unlocked | "🎉 7 Day Milestone!" |
| Immediate | Manual trigger | "Your streak is waiting! 🔥" |

### 📱 Testing Notifications

```typescript
// Test immediate notification
await sendImmediateReminder();

// Test milestone notification
await sendMilestoneNotification(3);

// Check scheduled notifications
const scheduled = await getScheduledReminders();
console.log("Scheduled:", scheduled);
```

---

## Feature 2: Achievements System

### 📁 Files Created

- `hooks/data/useAchievements.ts` - Achievement hooks
- `src/components/AchievementBadge.tsx` - Badge UI component
- `src/screens/AchievementsScreen/AchievementsScreen.tsx` - Full screen
- `supabase_migrations_achievements.sql` - Database schema

### 🏆 Achievement Categories

#### **Streak Achievements** (11 badges)
- First Step (1 day)
- Getting Started (3 days)
- Week Warrior (7 days)
- Monthly Master (30 days)
- Century Club (100 days)
- Year Long Legend (365 days)

#### **Entry Count Achievements** (5 badges)
- Prolific Writer (10 entries)
- Dedicated Diarist (50 entries)
- Journal Master (100 entries)
- Reflection Expert (250 entries)
- Wisdom Keeper (500 entries)

#### **Consistency Achievements** (3 badges)
- Early Bird (7 morning entries)
- Night Owl (7 evening entries)
- Weekend Warrior (10 weekend entries)

#### **Special Achievements** (4 badges)
- Comeback Kid (rebuild after break)
- Frozen in Time (use streak freeze)
- Milestone Hunter (5 achievements)
- Achievement Master (10 achievements)

### 💻 Usage

```typescript
import {
  useUserAchievements,
  useAchievementsWithProgress,
  useCheckAchievements,
  useClaimAchievement,
} from "@/hooks/data/useAchievements";

function AchievementsScreen() {
  const { data: achievements } = useAchievementsWithProgress();
  const checkMutation = useCheckAchievements();
  const claimMutation = useClaimAchievement();

  // Check for new achievements after journaling
  const handleCheckAchievements = async () => {
    const newAchievements = await checkMutation.mutateAsync();
    
    if (newAchievements && newAchievements.length > 0) {
      // Show celebration modal
      showAchievementModal(newAchievements);
    }
  };

  // Claim achievement (mark as seen)
  const handleClaimAchievement = async (achievementId: number) => {
    await claimMutation.mutateAsync(achievementId);
  };
}
```

### 🎨 UI Components

```typescript
<AchievementBadge
  icon="🔥"
  name="Week Warrior"
  description="Maintain a 7-day streak"
  unlocked={true}
  progress={7}
  progressPercentage={100}
  badgeColor="#3B82F6"
  onPress={() => handleBadgePress()}
/>
```

### 🔄 Auto-Check Achievements

Integrate with journal save:

```typescript
// In useSaveJournal.ts
import { useCheckAchievements } from "@/hooks/data/useAchievements";

const saveJournal = async (input: InsightsType) => {
  // Save journal entry
  const entry = await supabase.from("journal_entries").insert(row);
  
  // Update streak
  await updateStreak();
  
  // Check for new achievements
  const checkAchievements = useCheckAchievements();
  const newAchievements = await checkAchievements.mutateAsync();
  
  // Show notifications for new achievements
  if (newAchievements) {
    newAchievements.forEach((achievement) => {
      sendMilestoneNotification(achievement.requirement_value);
    });
  }
};
```

---

## Feature 3: Streak Recovery

### 📁 Files Created

- `hooks/data/useStreakRecovery.ts` - Recovery logic
- `src/components/StreakRecoveryModal.tsx` - Recovery UI

### 💎 Recovery Options

#### **Premium Recovery**
- Available to premium/pro users
- Restore streak up to 3 days back
- Unlimited uses

#### **Streak Freeze**
- Use one freeze token
- Protect streak for 1 day
- Limited quantity (premium users get 3)

### 💻 Usage

```typescript
import {
  useCanRecoverStreak,
  useRecoverStreak,
  useStreakRecoveryOptions,
} from "@/hooks/data/useStreakRecovery";

function HomeScreen() {
  const { canRecover, brokenStreak, availableOptions } = useCanRecoverStreak();
  const recoverMutation = useRecoverStreak();

  // Show recovery modal if streak is broken
  if (canRecover) {
    return <StreakRecoveryModal visible={true} onClose={() => {}} />;
  }

  // Recover streak
  const handleRecover = async (optionId: string) => {
    const result = await recoverMutation.mutateAsync({
      recoveryOptionId: optionId,
      targetStreak: brokenStreak.streak_value,
    });
    
    console.log(result.message); // "Streak recovered! You're back to 7 days."
  };
}
```

### 🎯 Recovery Rules

- Can only recover if streak broke within last 3 days
- Premium users: unlimited recoveries
- Free users: can use streak freezes (if available)
- Each recovery option can only be used once per broken streak

### 🔐 Premium Check

```typescript
// Check if user is premium
const { data: profile } = await supabase
  .from("profiles")
  .select("subscription_plan")
  .eq("id", userId)
  .single();

const isPremium = profile?.subscription_plan === "premium" || 
                  profile?.subscription_plan === "pro";
```

---

## Feature 4: Streak Insights

### 📁 Files Created

- `hooks/data/useStreakInsights.ts` - Analytics logic
- `src/screens/InsightsScreen/InsightsScreen.tsx` - Insights UI

### 📊 Insights Provided

#### **Journaling Patterns**
- Best time of day (morning/afternoon/evening/night)
- Most active day of week
- Average entries per week
- Most productive hour
- Consistency score (0-100)

#### **Mood Trends**
- 7-day mood chart
- Average mood this week
- Mood patterns over time

#### **Personalized Insights**
- Success messages ("You're on fire!")
- Warnings ("Tough week?")
- Tips ("Try journaling in the morning")
- Milestone reminders

#### **Weekly Summary**
- Total entries this week
- Average mood
- Top emotions
- Week date range

### 💻 Usage

```typescript
import { useStreakInsights, useWeeklySummary } from "@/hooks/data/useStreakInsights";

function InsightsScreen() {
  const { data: insights } = useStreakInsights();
  const { data: weeklySummary } = useWeeklySummary();

  return (
    <View>
      {/* Stats */}
      <Text>Total Entries: {insights.total_entries}</Text>
      <Text>Consistency: {insights.journaling_pattern.consistency_score}%</Text>
      
      {/* Best time */}
      <Text>Best Time: {insights.journaling_pattern.best_time}</Text>
      <Text>Best Day: {insights.journaling_pattern.best_day}</Text>
      
      {/* Mood trends */}
      {insights.mood_trends.map((trend) => (
        <View key={trend.date}>
          <Text>{trend.date}: {trend.average_mood.toFixed(1)}</Text>
        </View>
      ))}
      
      {/* Personalized insights */}
      {insights.insights.map((insight) => (
        <View key={insight.title}>
          <Text>{insight.icon} {insight.title}</Text>
          <Text>{insight.message}</Text>
        </View>
      ))}
    </View>
  );
}
```

### 📈 Insight Types

| Type | Color | Example |
|------|-------|---------|
| success | Green | "You're on fire! 🔥" |
| warning | Yellow | "Tough week?" |
| info | Blue | "Your best time is morning" |
| tip | Purple | "Try journaling at same time" |

---

## 🔗 Integration Guide

### Step 1: Update Journal Save Flow

```typescript
// In useSaveJournal.ts
import { useCheckAchievements } from "@/hooks/data/useAchievements";
import { useStreakReminders } from "@/hooks/notifications/useStreakReminders";

const saveJournal = async (input: InsightsType) => {
  // 1. Save journal entry
  const entry = await supabase.from("journal_entries").insert(row);
  
  // 2. Update streak
  await updateStreak();
  
  // 3. Check achievements
  const newAchievements = await checkAchievements.mutateAsync();
  
  // 4. Send milestone notifications
  if (newAchievements) {
    for (const achievement of newAchievements) {
      await sendMilestoneNotification(achievement.requirement_value);
    }
  }
  
  return entry;
};
```

### Step 2: Add to Settings Screen

```typescript
// Add notification settings
<View>
  <Text>Daily Reminder</Text>
  <Switch
    value={reminderEnabled}
    onValueChange={async (enabled) => {
      if (enabled) {
        await scheduleStreakReminder({
          hour: 9,
          minute: 0,
          enabled: true,
        });
      } else {
        await cancelAllStreakReminders();
      }
    }}
  />
</View>
```

### Step 3: Show Recovery Modal

```typescript
// In HomeScreen or JournalCalendarScreen
import { StreakRecoveryModal } from "@/src/components/StreakRecoveryModal";
import { useCanRecoverStreak } from "@/hooks/data/useStreakRecovery";

function HomeScreen() {
  const { canRecover } = useCanRecoverStreak();
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    if (canRecover) {
      setShowRecovery(true);
    }
  }, [canRecover]);

  return (
    <>
      {/* Your screen content */}
      <StreakRecoveryModal
        visible={showRecovery}
        onClose={() => setShowRecovery(false)}
      />
    </>
  );
}
```

### Step 4: Add Achievements Button

```typescript
// In navigation or profile screen
<TouchableOpacity onPress={() => router.push("/achievements")}>
  <View>
    <Text>🏆 Achievements</Text>
    {unclaimedCount > 0 && (
      <View style={styles.badge}>
        <Text>{unclaimedCount}</Text>
      </View>
    )}
  </View>
</TouchableOpacity>
```

---

## 🧪 Testing

### Test Push Notifications

```typescript
// Test 1: Request permissions
const hasPermission = await requestNotificationPermissions();
console.log("Permission:", hasPermission);

// Test 2: Send immediate notification
await sendImmediateReminder();

// Test 3: Schedule daily reminder
await scheduleStreakReminder({ hour: 9, minute: 0, enabled: true });

// Test 4: Check scheduled notifications
const scheduled = await getScheduledReminders();
console.log("Scheduled:", scheduled.length);

// Test 5: Send milestone notification
await sendMilestoneNotification(7);
```

### Test Achievements

```typescript
// Test 1: Check for achievements
const newAchievements = await checkAchievements.mutateAsync();
console.log("New achievements:", newAchievements);

// Test 2: Get all achievements with progress
const { data } = useAchievementsWithProgress();
console.log("Total achievements:", data?.length);
console.log("Unlocked:", data?.filter(a => a.unlocked).length);

// Test 3: Claim achievement
await claimAchievement.mutateAsync(1);

// Test 4: Get unclaimed count
const unclaimedCount = useUnclaimedAchievementsCount();
console.log("Unclaimed:", unclaimedCount);
```

### Test Streak Recovery

```typescript
// Test 1: Check if can recover
const { canRecover, brokenStreak } = useCanRecoverStreak();
console.log("Can recover:", canRecover);
console.log("Broken streak:", brokenStreak);

// Test 2: Get recovery options
const { data: options } = useStreakRecoveryOptions();
console.log("Available options:", options?.filter(o => o.available));

// Test 3: Recover streak
const result = await recoverStreak.mutateAsync({
  recoveryOptionId: "premium-recovery",
  targetStreak: 7,
});
console.log(result.message);
```

### Test Insights

```typescript
// Test 1: Get insights
const { data: insights } = useStreakInsights();
console.log("Total entries:", insights?.total_entries);
console.log("Consistency:", insights?.journaling_pattern.consistency_score);

// Test 2: Get weekly summary
const { data: summary } = useWeeklySummary();
console.log("This week:", summary?.entries_count);
console.log("Avg mood:", summary?.average_mood);

// Test 3: Check patterns
console.log("Best time:", insights?.journaling_pattern.best_time);
console.log("Best day:", insights?.journaling_pattern.best_day);
```

---

## 📝 API Reference

### Notifications

```typescript
useStreakReminders()
  .scheduleStreakReminder(schedule: ReminderSchedule): Promise<void>
  .sendImmediateReminder(): Promise<void>
  .sendStreakWarning(): Promise<void>
  .sendMilestoneNotification(milestone: number): Promise<void>
  .cancelAllStreakReminders(): Promise<void>
  .getScheduledReminders(): Promise<Notification[]>
```

### Achievements

```typescript
useUserAchievements(): Query<UserAchievement[]>
useAllAchievements(): Query<Achievement[]>
useAchievementsWithProgress(): Query<AchievementWithProgress[]>
useCheckAchievements(): Mutation<number[]>
useClaimAchievement(): Mutation<void>
useUnclaimedAchievementsCount(): number
useAchievementStats(): { total, unlocked, percentage }
```

### Streak Recovery

```typescript
useCanRecoverStreak(): { canRecover, brokenStreak, availableOptions }
useStreakRecoveryOptions(): Query<StreakRecoveryOption[]>
useRecoverStreak(): Mutation<{ success, message, new_streak }>
useStreakHistory(): Query<StreakHistory[]>
```

### Insights

```typescript
useStreakInsights(): Query<StreakAnalytics>
useWeeklySummary(): Query<WeeklySummary>
```

---

## ✅ Checklist

### Database
- [ ] Run achievements migration SQL
- [ ] Verify tables created
- [ ] Test `check_and_award_achievements()` function

### Notifications
- [ ] Install expo-notifications
- [ ] Configure app.json
- [ ] Test permission request
- [ ] Test immediate notification
- [ ] Test scheduled notification

### Achievements
- [ ] Verify 25+ achievements in database
- [ ] Test achievement checking
- [ ] Test achievement claiming
- [ ] Test progress tracking

### Streak Recovery
- [ ] Test premium check
- [ ] Test recovery options
- [ ] Test streak recovery
- [ ] Test freeze usage

### Insights
- [ ] Test pattern detection
- [ ] Test mood trends
- [ ] Test personalized insights
- [ ] Test weekly summary

---

## 🎉 Success Criteria

- [ ] Users receive daily streak reminders
- [ ] Milestone notifications sent automatically
- [ ] Achievements unlock and display correctly
- [ ] Premium users can recover broken streaks
- [ ] Insights show accurate patterns
- [ ] All features work together seamlessly
- [ ] No console errors
- [ ] Smooth animations

---

**Implementation Date:** October 21, 2025  
**Status:** ✅ Complete - Ready for Testing
