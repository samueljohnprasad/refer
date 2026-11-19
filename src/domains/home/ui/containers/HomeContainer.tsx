// ponytail: exact S Home orchestrator matching .agents/home.html — scene/header, mood check-in, CTA,
// "mine" reflections, help/account sheets, paywall-once + app-update wiring (relocated verbatim).
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, Pressable, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import { useAppUpdate } from '@/src/hooks/useAppUpdate';
import { UpdateModal } from '@/src/components/modals';
import SignInBottomSheet, { type SignInBottomSheetHandle } from '@/src/components/SignInBottomSheet';
import type { ReflectionData } from '@/src/domains/onboarding/domain/types';
import { ActingPose } from '@/src/domains/onboarding/ui/containers/happiPoses';
import { getMostRecent, WEEKLY_GOAL } from '@/src/domains/home/data/reflectionsStorage';
import { usePracticeCounts } from '@/src/domains/exercises/ui/containers/usePracticeCounts';
import { useHomeScene } from './useHomeScene';
import { HomeSceneHeader } from '../presentation/views/HomeSceneHeader';
import { MoodCheckInView } from '../presentation/views/MoodCheckInView';
import { ReflectionsSection } from '../presentation/views/ReflectionsSection';
import { HelpSheet } from '../presentation/views/HelpSheet';
import { AccountSheet } from '../presentation/views/AccountSheet';

const WELCOME_SHOWN_KEY = '@happy/home_welcome_shown';
const SIGNUP_LATER_KEY = '@happy/home_signup_later';

export function HomeContainer(): React.JSX.Element {
  const { user, isAnonymous } = useAuth();
  const { presentPaywall } = useRevenueCat();
  const { showUpdateModal, currentVersion, latestVersion, hideModal } = useAppUpdate({ autoCheck: true });
  const signInSheetRef = useRef<SignInBottomSheetHandle>(null);

  const [mostRecent, setMostRecent] = useState<ReflectionData | null>(null);
  const [isFirstHomeVisit, setIsFirstHomeVisit] = useState(false);
  const [showClaimNudge, setShowClaimNudge] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: counts } = usePracticeCounts();
  const lifetimeCount = counts?.lifetime ?? 0;
  const weeklyCount = Math.min(counts?.thisWeek ?? 0, WEEKLY_GOAL);
  const [bubbleOverride, setBubbleOverride] = useState<string | null>(null);
  const [poseOverride, setPoseOverride] = useState<ActingPose | null>(null);

  const handleMoodAnswer = useCallback((say: string, moodPose: ActingPose) => {
    setBubbleOverride(say);
    setPoseOverride(moodPose);
  }, []);

  const refresh = useCallback(async () => {
    const recent = await getMostRecent();
    setMostRecent(recent);

    if (recent && isAnonymous) {
      const later = await AsyncStorage.getItem(SIGNUP_LATER_KEY);
      setShowClaimNudge(!later || Number(later) < Date.now());
    } else {
      setShowClaimNudge(false);
    }
  }, [isAnonymous]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const checkWelcome = async () => {
      const shown = await AsyncStorage.getItem(WELCOME_SHOWN_KEY);
      if (!shown) {
        setIsFirstHomeVisit(true);
        await AsyncStorage.setItem(WELCOME_SHOWN_KEY, 'true');
      }
    };
    void checkWelcome();
  }, []);

  // ponytail: present the remote RevenueCat paywall once, the first time Home is reached after onboarding —
  // relocated verbatim from the old JournalCalendarScreen.
  useEffect(() => {
    const presentOnceAfterOnboarding = async (): Promise<void> => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
        if (onboardingCompleted !== 'true') return;
        const alreadyShown = await AsyncStorage.getItem('@happy/paywall_shown_onboarding');
        if (alreadyShown) return;
        await AsyncStorage.setItem('@happy/paywall_shown_onboarding', 'true');
        await presentPaywall('onboarding_complete');
      } catch (e) {
        console.error('Error presenting post-onboarding paywall:', e);
      }
    };
    void presentOnceAfterOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const crisisActive = mostRecent?.trap === undefined && false; // ponytail: no crisis signal persisted on ReflectionData today
  const { night, pose, say } = useHomeScene({ mostRecent, isFirstHomeVisit, crisisActive });

  const handleCatchThought = useCallback(() => {
    router.push('/tabs/screens/thought-catcher');
  }, []);

  const handleSettingsPress = useCallback(() => router.push('/tabs/screens/settings'), []);
  const handleCapturePress = useCallback(() => router.push('/tabs/screens/record'), []);

  const handleAccountPress = useCallback(() => {
    if (isAnonymous) {
      signInSheetRef.current?.present();
    } else {
      setAccountOpen(true);
    }
  }, [isAnonymous]);

  const handleLater = useCallback(() => {
    void AsyncStorage.setItem(SIGNUP_LATER_KEY, String(Date.now() + 7 * 864e5));
    setShowClaimNudge(false);
  }, []);

  const isPersonal = mostRecent?.source === 'personal';
  const joinedLabel = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <View className="flex-1 bg-happy-bg">
      <Stack.Screen options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Header
        transparent
        style={{
          backgroundColor: 'transparent',
          color: '#142414',
          shadowColor: 'transparent',
        }}
      />
      <Stack.Toolbar placement="right" tintColor="#4b4b4b">
        <Stack.Toolbar.Button
          icon="plus"
          accessibilityLabel="Record a voice entry"
          tintColor="#4b4b4b"
          onPress={handleCapturePress}
        />
        <Stack.Toolbar.Button
          icon="gearshape"
          accessibilityLabel="Settings"
          tintColor="#4b4b4b"
          onPress={handleSettingsPress}
        />
      </Stack.Toolbar>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <HomeSceneHeader
          night={night}
          pose={poseOverride ?? pose}
          say={bubbleOverride ?? say}
          lifetimeCount={lifetimeCount}
          weeklyCount={weeklyCount}
          onHelpPress={() => setHelpOpen(true)}
          onAccountPress={handleAccountPress}
        />

        <View className="px-4 -mt-7 pt-8 pb-12 rounded-t-[28px] bg-happy-bg">
          <MoodCheckInView night={night} onAnswer={handleMoodAnswer} />

          <Pressable
            onPress={handleCatchThought}
            className="w-full min-h-14 mt-6 items-center justify-center rounded-pill bg-happy-ink border-b-4 border-b-sage-700 active:translate-y-0.5 active:border-b-2"
          >
            <Text className="text-white text-t-body font-bold">
              Catch a thought <Text className="font-normal opacity-80">· 2 min</Text>
            </Text>
          </Pressable>

          {mostRecent && (
            <ReflectionsSection
              mostRecent={mostRecent}
              count={lifetimeCount}
              isPersonal={isPersonal}
              showClaimNudge={showClaimNudge}
              onLater={handleLater}
              onSave={() => signInSheetRef.current?.present()}
            />
          )}

          <Pressable
            onPress={() => setHelpOpen(true)}
            className="flex-row items-center gap-2 min-h-13 mt-12 pt-4 border-t border-happy-sep"
          >
            <Text className="text-t-sub font-semibold text-happy-label-2">Need to talk to someone now?</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={helpOpen} transparent animationType="slide" onRequestClose={() => setHelpOpen(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-happy-bg rounded-t-3xl p-5 pb-8">
            <HelpSheet />
          </View>
        </View>
      </Modal>

      <Modal visible={accountOpen} transparent animationType="slide" onRequestClose={() => setAccountOpen(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-happy-surface-2 rounded-t-3xl max-h-[88%] pb-8">
            <ScrollView showsVerticalScrollIndicator={false}>
              <AccountSheet
                lifetimeCount={lifetimeCount}
                weeklyCount={weeklyCount}
                joinedLabel={joinedLabel}
                onDeleted={() => {
                  setAccountOpen(false);
                  router.replace('/tabs/screens/(onboarding)/premium-onboarding');
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <SignInBottomSheet ref={signInSheetRef} source="home" onSuccess={refresh} />

      <UpdateModal
        isVisible={showUpdateModal}
        onDismiss={hideModal}
        currentVersion={currentVersion}
        latestVersion={latestVersion}
      />
    </View>
  );
}
