# 🔥 Streak System - Quick Start Guide

## 🚀 Setup (5 minutes)

### **Step 1: Database Migration**
```sql
-- Copy and run this in Supabase SQL Editor
-- File: supabase_migration_add_streak_fields.sql

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_journal_date DATE,
ADD COLUMN IF NOT EXISTS streak_freeze_count INTEGER DEFAULT 0;
```

### **Step 2: Verify Installation**
All code is already integrated! Just run the migration above.

### **Step 3: Test**
1. Create a journal entry
2. Check the home screen - you should see streak = 1
3. Check the discovery screen - streak should show in header

---

## 📋 What Was Implemented

### ✅ **Core Features**
- **Real-time streak calculation** - Updates immediately after journaling
- **Consecutive day tracking** - Increments for daily journaling
- **Streak break detection** - Resets if user misses a day
- **Longest streak tracking** - Remembers best achievement
- **Progress to milestones** - Shows next goal (3, 7, 14, 30, etc.)
- **Device timezone support** - Uses user's local time
- **App launch check** - Detects broken streaks when app opens

### ✅ **UI Updates**
- **JournalCalendarScreen** - Shows current streak with fire icon 🔥
- **DiscoveryScreen** - Displays streak in header
- **Animated progress bar** - Visual progress to next milestone
- **Dynamic milestones** - Next goal updates automatically

### ✅ **Premium Features (Foundation)**
- **Streak freeze** - Ready for premium users (not yet enabled)
- **Reminder system** - Helper functions ready for notifications

---

## 🎯 How It Works

### **When User Journals:**
1. Journal entry saved to database
2. Streak automatically calculated
3. Profile updated with new streak
4. UI refreshes to show new streak

### **Streak Rules:**
- **First journal ever** → Streak = 1
- **Journal today (already did)** → No change
- **Journal today (yesterday was last)** → Streak + 1
- **Missed 1+ days** → Streak resets to 1

### **On App Launch:**
- Checks if streak is broken (>1 day since last journal)
- If broken, resets streak to 0
- UI updates automatically

---

## 🧪 Quick Test

### **Test 1: Create First Journal**
```
1. Record a voice journal
2. Complete the analysis
3. Save the journal entry
4. Check home screen → Should show streak = 1 🔥
```

### **Test 2: Same Day (No Increment)**
```
1. Create another journal today
2. Check streak → Should still be 1 (not 2)
```

### **Test 3: Consecutive Days** (Manual Testing)
```
1. Have streak = 1
2. Change device date to tomorrow
3. Create journal entry
4. Check streak → Should be 2
```

---

## 📊 Database Check

### **View Your Streak Data:**
```sql
SELECT 
  display_name,
  current_streak,
  longest_streak,
  last_journal_date
FROM profiles
WHERE id = 'YOUR_USER_ID';
```

### **See All Active Streaks:**
```sql
SELECT 
  display_name,
  current_streak
FROM profiles
WHERE current_streak > 0
ORDER BY current_streak DESC;
```

---

## 🔧 Files Modified

### **New Files:**
- `hooks/data/useStreakCalculation.ts` - Core logic
- `hooks/data/useUpdateStreak.ts` - Database mutations
- `hooks/data/useSaveJournalEntry.ts` - Combined save + streak
- `supabase_migration_add_streak_fields.sql` - Database schema

### **Updated Files:**
- `database.types.ts` - Added streak types
- `hooks/data/useUserProfile.ts` - Fetch streak data
- `hooks/post/useSaveJournal.ts` - Update streak on save
- `src/context/AuthContext.tsx` - Check streak on launch
- `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx` - Display streak
- `src/screens/DiscoveryScreen/DiscoveryScreen.tsx` - Display streak

---

## 🎨 UI Locations

### **Home Screen (JournalCalendarScreen)**
```
┌─────────────────────────┐
│ Hi, User 👋             │
│                         │
│ ┌─────────────────────┐ │
│ │ Current Streak      │ │
│ │ 🔥 5                │ │
│ │                     │ │
│ │ Next Milestone: 7   │ │
│ │ ████████░░ 71%      │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### **Discovery Screen**
```
┌─────────────────────────┐
│ 1st discovery    🔥 5   │
│ ─────────────────────── │
│ 0/100 XP                │
│ ████████████░░░░ 74%    │
└─────────────────────────┘
```

---

## 🐛 Troubleshooting

### **Streak not showing?**
1. Check if migration ran: `SELECT * FROM profiles LIMIT 1;`
2. Look for `current_streak` column
3. Check console for errors

### **Streak not updating?**
1. Open browser console
2. Look for "Error updating streak"
3. Check Supabase logs

### **UI not refreshing?**
1. Force refresh the app
2. Check React Query DevTools
3. Verify `queryClient.invalidateQueries` is called

---

## 🚀 Next Steps

### **Immediate:**
1. ✅ Run database migration
2. ✅ Test journal creation
3. ✅ Verify streak displays correctly

### **Optional Enhancements:**
- Add push notifications for streak reminders
- Create achievement badges for milestones
- Add streak leaderboard
- Enable streak freeze for premium users
- Add streak calendar visualization

---

## 📞 Need Help?

Check these files for details:
- **Full Guide:** `STREAK_IMPLEMENTATION_GUIDE.md`
- **Migration:** `supabase_migration_add_streak_fields.sql`
- **Core Logic:** `hooks/data/useStreakCalculation.ts`

---

**Status:** ✅ Ready to Use
**Last Updated:** October 21, 2025
