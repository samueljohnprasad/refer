// ponytail: exact .acctv matching .agents/home.html — signed-in hero + practice/weekly tiles + reminder
// toggle + data row + sign-out + delete (apart). Signed-out state is handled by the caller (SignInBottomSheet).
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import { SignOutConfirmationModal } from '@/src/components/modals/SignOutConfirmationModal';
import { HappiIcon } from '@/src/domains/onboarding/ui/presentation/components/HappiIcon';
import { ActingPose } from '@/src/domains/onboarding/ui/containers/happiPoses';
import { ProgressRing } from '../components/ProgressRing';
import { WEEKLY_GOAL } from '@/src/domains/home/data/reflectionsStorage';
import {
  ensureNotificationPermissions, scheduleDailyReminder, saveRemindersConfig, loadRemindersConfig, cancelReminder,
} from '@/src/components/lib/notification-reminders';

const REMINDER_SLOT = 'home_daily';

export interface AccountSheetProps {
  lifetimeCount: number;
  weeklyCount: number;
  joinedLabel: string;
  onDeleted: () => void;
}

export function AccountSheet({ lifetimeCount, weeklyCount, joinedLabel, onDeleted }: AccountSheetProps): React.JSX.Element {
  const { signOut } = useAuth();
  const deleteUserMutation = useDeleteUser();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    void loadRemindersConfig().then((cfg) => setReminderEnabled(!!cfg[REMINDER_SLOT]?.enabled));
  }, []);

  const handleToggleReminder = useCallback(async (next: boolean) => {
    const cfg = await loadRemindersConfig();
    if (!next) {
      await cancelReminder(cfg[REMINDER_SLOT]?.notifId);
      await saveRemindersConfig({ ...cfg, [REMINDER_SLOT]: { ...cfg[REMINDER_SLOT], enabled: false } });
      setReminderEnabled(false);
      return;
    }
    const granted = await ensureNotificationPermissions();
    if (!granted) return;
    const id = await scheduleDailyReminder(REMINDER_SLOT, 'Ready to catch one more thought?', { hour: 20, minute: 0 }, '2 minutes.');
    await saveRemindersConfig({ ...cfg, [REMINDER_SLOT]: { hour: 20, minute: 0, enabled: true, notifId: id } });
    setReminderEnabled(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    await deleteUserMutation.mutateAsync();
    setShowDeleteConfirm(false);
    onDeleted();
  }, [deleteUserMutation, onDeleted]);

  return (
    <View className="-mx-4">
      <View className="items-center gap-1 px-4 pb-5 bg-happy-tint">
        <View className="w-24 h-24 rounded-full overflow-hidden bg-happy-bg items-center justify-center">
          <HappiIcon pose={ActingPose.Content} size={96} />
        </View>
        <Text className="text-t-h font-bold text-happy-label mt-2">You're signed in</Text>
        <Text className="text-t-foot text-happy-label-2">Joined {joinedLabel}</Text>
      </View>

      <View className="px-4 pt-4">
        <Text className="text-t-foot font-medium text-happy-label-2 mb-2">Your practice</Text>
        <View className="flex-row gap-2">
          <View className="flex-1 px-4 py-4 rounded-2xl bg-happy-bg">
            <Text className="text-t-cap text-happy-label-2">Practices completed</Text>
            <Text className="font-display text-t-num font-semibold text-happy-label mt-0.5">{lifetimeCount}</Text>
          </View>
          <View className="flex-1 px-4 py-4 rounded-2xl bg-happy-bg">
            <Text className="text-t-cap text-happy-label-2">This week</Text>
            <View className="flex-row items-center gap-2 mt-0.5">
              <ProgressRing value={weeklyCount} goal={WEEKLY_GOAL} size={22} trackColor="#e5e5e5" />
              <Text className="font-display text-t-num font-semibold text-happy-label">{weeklyCount} of {WEEKLY_GOAL}</Text>
            </View>
          </View>
        </View>

        <Text className="text-t-foot font-medium text-happy-label-2 mt-4 mb-2">Reminders</Text>
        <View className="rounded-2xl bg-happy-bg px-4">
          <View className="flex-row items-center justify-between min-h-14 border-b-2 border-happy-sep">
            <Text className="text-t-body text-happy-label">Daily reminder</Text>
            <Switch value={reminderEnabled} onValueChange={handleToggleReminder} />
          </View>
        </View>

        <Text className="text-t-foot font-medium text-happy-label-2 mt-4 mb-2">Your data</Text>
        <View className="rounded-2xl bg-happy-bg px-4">
          <View className="flex-row items-center justify-between min-h-14">
            <Text className="text-t-body text-happy-label">Backup</Text>
            <Text className="text-t-sub font-medium text-happy-label-2">Backed up just now</Text>
          </View>
        </View>

        <Text className="text-t-foot font-medium text-happy-label-2 mt-4 mb-2">Account</Text>
        <View className="rounded-2xl bg-happy-bg px-4">
          <Pressable onPress={() => setShowSignOutConfirm(true)} className="min-h-14 justify-center">
            <Text className="text-t-body text-happy-label">Sign out</Text>
          </Pressable>
        </View>

        <View className="mt-4 rounded-2xl bg-happy-bg px-4">
          <Pressable onPress={() => setShowDeleteConfirm(true)} className="min-h-14 justify-center">
            <Text className="text-t-body text-happy-danger">Delete account</Text>
          </Pressable>
        </View>
      </View>

      <SignOutConfirmationModal
        isSignoutOPen={showSignOutConfirm}
        handleClose={() => setShowSignOutConfirm(false)}
        onConfirm={signOut}
      />

      {showDeleteConfirm && (
        <View className="absolute inset-0 items-center justify-center bg-black/40 px-6">
          <View className="w-full p-5 rounded-2xl bg-happy-bg">
            <Text className="text-t-h font-bold text-happy-label">Delete your account?</Text>
            <Text className="text-t-body text-happy-label-2 mt-2 mb-4">
              This removes your reflections from Happy, on this phone and in the cloud. It can't be undone.
            </Text>
            <Pressable
              onPress={handleConfirmDelete}
              disabled={deleteUserMutation.isPending}
              className="min-h-14 items-center justify-center rounded-pill bg-happy-danger mb-2"
            >
              <Text className="text-t-body font-bold text-white">
                {deleteUserMutation.isPending ? 'Deleting…' : 'Delete account'}
              </Text>
            </Pressable>
            <Pressable onPress={() => setShowDeleteConfirm(false)} className="min-h-11 items-center justify-center">
              <Text className="text-t-foot font-medium text-happy-label-3">Keep my account</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
