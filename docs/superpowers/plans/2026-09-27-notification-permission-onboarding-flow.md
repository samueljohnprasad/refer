# Notification Permission & Onboarding Reminders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Suppress premature notification permission dialogs on app startup / first screen, set all reminder times (Morning, Midday, Evening) as enabled by default in onboarding, and show the system notification permission prompt only when the user explicitly clicks "Continue" on the notification permission onboarding step.

**Architecture:** 
1. Make `registerPushToken` in `src/utils/pushTokenRegistration.ts` passive by default (`requestPermission: boolean = false`), preventing `_layout.tsx` / `usePushNotificationSetup` from triggering the OS prompt on app boot.
2. In `useReminderConfig.ts`, initialize all default reminder slots as enabled (`enabled: true`), and add `requestPermissionsOnToggle: false` option so switch toggling during onboarding remains local.
3. In `OnboardingScreen.tsx`, trigger OS permission prompt via `handleNotificationPermissionOnContinue` when the user clicks the "Continue" CTA on `notification_permission` step. Save the complete configured reminders schedule to Supabase on completion.

**Tech Stack:** React Native (Expo Router, expo-notifications, expo-device), Jotai, Supabase, TypeScript

## Global Constraints

- No React component, hook, or helper file may exceed 300 lines (`OnboardingScreen.tsx` must stay <= 300 lines).
- Do not use raw `console.log` or `console.error` in Expo frontend code; use `createLogger` from `@/src/lib/logger`.
- Strictly typed TypeScript; no `any` widening.
- Minimal code, YAGNI, tag intentional simplifications with `// ponytail:` comments.
- Do not use simulator or emulator tools unnecessarily.
- Update knowledge graph via `graphify update .` after changes.

---

### Task 1: Passive Push Token Registration on App Startup

**Files:**
- Modify: `src/utils/pushTokenRegistration.ts`

**Interfaces:**
- Consumes: `Notifications.getPermissionsAsync`, `Notifications.requestPermissionsAsync`, `createLogger`
- Produces: `registerPushToken(userId: string, requestPermission?: boolean): Promise<string | null>`

- [ ] **Step 1: Inspect current permission check in `registerPushToken`**

Check line 20-26 of `src/utils/pushTokenRegistration.ts`. Notice that `Notifications.requestPermissionsAsync()` is currently invoked unconditionally whenever `existingStatus !== "granted"`.

- [ ] **Step 2: Add `requestPermission: boolean = false` parameter and passive guard**

Update `registerPushToken` in `src/utils/pushTokenRegistration.ts`:

```typescript
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { getLocales } from "expo-localization";
import { supabase } from "@/src/network/auth/supabase";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("PushToken");

const PROJECT_ID = "b87a1855-bf48-4992-9004-1ec817a4a5de";

/**
 * Register for push notifications and store the Expo push token in Supabase.
 * Passive by default: will only register if permissions are ALREADY granted.
 * Pass requestPermission: true only on explicit user actions (e.g. Onboarding Continue).
 */
export async function registerPushToken(
    userId: string,
    requestPermission: boolean = false
): Promise<string | null> {
    try {
        if (!Device.isDevice) {
            log.info("Push notifications require a physical device");
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // ponytail: never prompt for permission on app start or passive sync
        if (existingStatus !== "granted") {
            if (!requestPermission) {
                log.debug("Push notification permission not granted yet (passive check skipped)");
                return null;
            }
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            log.info("Push notification permission not granted by user");
            return null;
        }

        // Set up Android notification channel for remote notifications
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("push", {
                name: "Push Notifications",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#7B61FF",
            });
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: PROJECT_ID,
        });

        const expoPushToken = tokenData.data;
        const platform = Platform.OS as "ios" | "android";
        const timezone = getLocales()[0]?.regionCode
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : "UTC";

        // Upsert token to Supabase
        const { error } = await supabase.from("push_tokens").upsert(
            {
                user_id: userId,
                expo_push_token: expoPushToken,
                platform,
                is_valid: true,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,expo_push_token" }
        );

        if (error) {
            log.error("Error storing push token in Supabase:", error);
            return null;
        }

        // Also update timezone in user_preferences
        await supabase.from("user_preferences").upsert(
            {
                user_id: userId,
                timezone,
            },
            { onConflict: "user_id" }
        );

        log.info("Push token registered successfully:", expoPushToken);
        return expoPushToken;
    } catch (error) {
        log.error("Error registering push token:", error);
        return null;
    }
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit | grep -E "pushTokenRegistration" || true
```
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/utils/pushTokenRegistration.ts
git commit -m "fix(notifications): make push token registration passive on startup"
```

---

### Task 2: Enable All Reminders by Default & Defer OS Prompt on Toggle

**Files:**
- Modify: `src/components/notifications/useReminderConfig.ts`
- Modify: `src/screens/OnboardingScreen/steps/NotificationPermissionStep.tsx`

**Interfaces:**
- Consumes: `DEFAULT_REMINDERS`, `loadRemindersConfig`, `ensureNotificationPermissions`
- Produces: `useReminderConfig(defaultItems, options?: { requestPermissionsOnToggle?: boolean })`

- [ ] **Step 1: Update `useReminderConfig.ts` defaults and toggle check**

In `src/components/notifications/useReminderConfig.ts`:
1. Add `options?: { requestPermissionsOnToggle?: boolean }`.
2. In initial state loader, set `enabled: true` for all default items (`defaultItems.forEach(it => { initialCfg[it.id] = { ...it, enabled: true }; })`).
3. In `toggleSelected`: only call `ensureNotificationPermissions()` when `requestPermissionsOnToggle` is `true`.

```typescript
interface UseReminderConfigOptions {
  requestPermissionsOnToggle?: boolean;
}

export const useReminderConfig = (
  defaultItems: ReminderItem[],
  options?: UseReminderConfigOptions
): UseReminderConfigReturn => {
  const requestPermissionsOnToggle = options?.requestPermissionsOnToggle ?? true;
  const [items, setItems] = useState<ReminderItem[]>(defaultItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cfg, setCfg] = useAtom(cfgAtom);

  useEffect(() => {
    let active = true;

    (async () => {
      const stored = await loadRemindersConfig();
      if (!active) return;

      let initialCfg = { ...stored };

      // ponytail: default all reminders to enabled locally
      if (Object.keys(stored).length === 0) {
        defaultItems.forEach((it) => {
          initialCfg[it.id] = {
            hour: it.hour,
            minute: it.minute,
            enabled: true,
            title: it.title,
            body: it.notificationBody,
          };
        });
      }

      setCfg(initialCfg);

      setItems((prev) =>
        prev.map((it) => {
          const c = initialCfg[it.id];
          return c?.hour !== undefined
            ? { ...it, hour: c.hour, minute: c.minute, enabled: c.enabled }
            : it;
        })
      );
    })();

    return () => {
      active = false;
    };
  }, []);
```

And in `toggleSelected`:
```typescript
    // Turn ON - request permissions first if requested
    if (requestPermissionsOnToggle) {
      const granted = await ensureNotificationPermissions();
      if (!granted) {
        Alert.alert(
          "Notification Permission Needed",
          "Please enable notification access in Settings to receive reminders.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openURL("app-settings:"),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }
    }
```

- [ ] **Step 2: Update `NotificationPermissionStep.tsx` to pass `{ requestPermissionsOnToggle: false }`**

In `src/screens/OnboardingScreen/steps/NotificationPermissionStep.tsx`:

```typescript
  // ponytail: do not prompt OS dialog while toggling in onboarding; prompt on Continue click
  const {
    items,
    cfg,
    handleTimeChange,
    toggleSelected,
  } = useReminderConfig(DEFAULT_REMINDERS, { requestPermissionsOnToggle: false });
```

- [ ] **Step 3: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit | grep -E "(useReminderConfig|NotificationPermissionStep)" || true
```
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/notifications/useReminderConfig.ts src/screens/OnboardingScreen/steps/NotificationPermissionStep.tsx
git commit -m "feat(onboarding): enable all reminders by default and defer OS prompt"
```

---

### Task 3: Create Onboarding Notification Continue Action Helper

**Files:**
- Create: `src/screens/OnboardingScreen/utils/onboardingNotifications.ts`

**Interfaces:**
- Consumes: `ensureNotificationPermissions`, `scheduleDailyReminder`, `saveRemindersConfig`, `registerPushToken`
- Produces: `handleNotificationPermissionOnContinue(userId?: string, remindersCfg: RemindersConfig): Promise<void>`

- [ ] **Step 1: Create `onboardingNotifications.ts` helper**

Write `src/screens/OnboardingScreen/utils/onboardingNotifications.ts`:

```typescript
import {
  ensureNotificationPermissions,
  scheduleDailyReminder,
  saveRemindersConfig,
  type RemindersConfig,
} from "@/src/components/lib/notification-reminders";
import { registerPushToken } from "@/src/utils/pushTokenRegistration";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("OnboardingNotifications");

/**
 * Executes when user taps "Continue" on the notification_permission onboarding step.
 * Requests OS notification permissions, registers push token, and schedules enabled daily reminders.
 */
export async function handleNotificationPermissionOnContinue(
  userId: string | undefined,
  remindersCfg: RemindersConfig
): Promise<void> {
  try {
    log.info("Requesting notification permissions on continue click...");
    const granted = await ensureNotificationPermissions();
    if (granted) {
      log.info("Notification permissions granted, setting up reminders and push token...");
      if (userId) {
        registerPushToken(userId, true).catch((err) =>
          log.error("Failed to register push token in onboarding:", err)
        );
      }
      for (const [id, item] of Object.entries(remindersCfg)) {
        if (item.enabled) {
          await scheduleDailyReminder(
            id,
            item.title ?? "Daily Reminder",
            { hour: item.hour, minute: item.minute },
            item.body
          );
        }
      }
      await saveRemindersConfig(remindersCfg);
    } else {
      log.info("Notification permissions not granted by user in onboarding");
    }
  } catch (err) {
    log.error("Error during notification permission flow in onboarding:", err);
  }
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit | grep -E "onboardingNotifications" || true
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/OnboardingScreen/utils/onboardingNotifications.ts
git commit -m "feat(onboarding): create notification continue action helper"
```

---

### Task 4: Integrate Notification Prompt on Continue in OnboardingScreen

**Files:**
- Modify: `src/screens/OnboardingScreen/OnboardingScreen.tsx`

**Interfaces:**
- Consumes: `handleNotificationPermissionOnContinue`, `cfgAtom`, `useAuth`
- Produces: Updated `OnboardingScreen` with permission trigger and real reminder config persistence.

- [ ] **Step 1: Import atom and notification helper in `OnboardingScreen.tsx`**

```typescript
import { useAtomValue } from "jotai";
import { cfgAtom } from "@/src/components/notifications/store";
import { handleNotificationPermissionOnContinue } from "./utils/onboardingNotifications";
import { useAuth } from "@/src/context/AuthContext";
```

- [ ] **Step 2: Read `user` and `remindersCfg` in component body**

```typescript
  const { user } = useAuth();
  const remindersCfg = useAtomValue(cfgAtom);
```

- [ ] **Step 3: Call `handleNotificationPermissionOnContinue` in `handleContinue`**

```typescript
      if (currentStep === "notification_permission" && !skipped) {
        await handleNotificationPermissionOnContinue(user?.id, remindersCfg);
      }
```

- [ ] **Step 4: Update `markCompleted` to persist real configured reminders**

```typescript
      if (isLastStep) {
        try {
          setLoading(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // ponytail: save real configured reminders from onboarding, fallback to motivation time
          const finalCfg =
            Object.keys(remindersCfg).length > 0
              ? remindersCfg
              : buildReminderConfig(formData.notificationTime);
          const hasAnyEnabled = Object.values(finalCfg).some((c) => c.enabled);

          await markCompleted({
            name: "",
            reasons: formData.motivation ? [formData.motivation] : [],
            cfg: finalCfg,
            reminderEnabled: hasAnyEnabled,
            motivation: formData.motivation,
          });

          await updateUserStreak();
          await xp?.awardXP(XPActionType.EXERCISE_COMPLETE, {
            customAmount: 15,
            customDescription: "First step on your journey",
          });

          await onComplete(skipped);
        } catch (error) {
          console.error("[Onboarding] Failed to complete:", error);
        } finally {
          setLoading(false);
        }
        return;
      }
```

- [ ] **Step 5: Verify line count rule (< 300 lines)**

Run:
```bash
wc -l src/screens/OnboardingScreen/OnboardingScreen.tsx
```
Expected: <= 300 lines.

- [ ] **Step 6: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit | grep -E "OnboardingScreen" || true
```
Expected: 0 errors in `OnboardingScreen.tsx`.

- [ ] **Step 7: Commit**

```bash
git add src/screens/OnboardingScreen/OnboardingScreen.tsx
git commit -m "feat(onboarding): trigger notification permission prompt only on continue click"
```

---

### Task 5: End-to-End Verification & Knowledge Graph Update

**Files:**
- Refresh: `graphify-out/graph.json`

- [ ] **Step 1: Run comprehensive TypeScript check on modified files**

Run:
```bash
npx tsc --noEmit | grep -E "(pushTokenRegistration|useReminderConfig|NotificationPermissionStep|onboardingNotifications|OnboardingScreen\.tsx)" || true
```
Expected: No errors returned for touched files.

- [ ] **Step 2: Update graphify knowledge graph**

Run:
```bash
graphify update .
```
Expected: AST extraction completes 100%, graph updated.

- [ ] **Step 3: Commit final plan documentation**

```bash
git add docs/superpowers/plans/2026-09-27-notification-permission-onboarding-flow.md
git commit -m "docs: add notification permission and onboarding reminder implementation plan"
```
