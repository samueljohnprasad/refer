import React from 'react';
import { View, Text, Modal, Pressable, Linking } from 'react-native';
import { SheetType } from '../../../domain/enums';

export interface OnboardingSheetsModalProps {
  activeSheet: SheetType | null;
  onClose: () => void;
  onLeaveConfirm: () => void;
  onSignInPress: () => void;
}

// ponytail: presentation modal for onboarding bottom sheets with zero crisis logic
export function OnboardingSheetsModal({
  activeSheet,
  onClose,
  onLeaveConfirm,
  onSignInPress,
}: OnboardingSheetsModalProps): React.JSX.Element {
  if (!activeSheet) {
    return <></>;
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-black/40 justify-end">
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-happy-surface rounded-t-3xl p-6 pt-5">
          {activeSheet === SheetType.Help && (
            <View>
              <Text className="text-t-lead font-bold text-happy-label mb-2">
                If you’re thinking about hurting yourself, you deserve support now.
              </Text>
              <Text className="text-t-sub font-medium text-happy-label-2 mb-4">
                988 Suicide &amp; Crisis Lifeline · call or text 988
              </Text>
              <Pressable
                onPress={(): void => { Linking.openURL('tel:988'); }}
                className="w-full min-h-[52px] bg-happy-ink rounded-pill items-center justify-center mb-2 active:opacity-90"
                accessibilityRole="button"
              >
                <Text className="text-white font-bold text-base">Call 988</Text>
              </Pressable>
              <Text className="text-t-foot font-medium text-happy-label-2 mb-4">
                Happy isn’t an emergency service. If you might act on these thoughts, call now.
              </Text>
              <Pressable
                onPress={onClose}
                className="w-full min-h-[48px] bg-happy-surface-2 rounded-pill items-center justify-center active:opacity-80"
                accessibilityRole="button"
              >
                <Text className="text-happy-label font-semibold text-base">Keep writing</Text>
              </Pressable>
            </View>
          )}

          {activeSheet === SheetType.Who && (
            <View>
              <Text className="text-t-lead font-bold text-happy-label mb-2">Who is Happi?</Text>
              <Text className="text-t-sub font-medium text-happy-label-2 leading-relaxed mb-4">
                Happi is a panda who likes slow mornings and noticing small things. Happi keeps you
                company while you practise the skills in Happy. Happi isn’t a therapist, a coach or a
                judge, and never grades how you feel. When you write, Happi looks at your words, not at
                you. When things get serious, Happi steps aside so real people can help. Happi doesn’t
                need anything from you. You’re welcome here any time.
              </Text>
              <Text className="text-t-foot font-medium text-happy-label-2 mb-4">
                Happy helps you practise CBT skills. It isn’t therapy and doesn’t replace professional care.
              </Text>
              <Pressable
                onPress={onClose}
                className="w-full min-h-[52px] bg-happy-ink rounded-pill items-center justify-center active:opacity-90"
                accessibilityRole="button"
                accessibilityLabel="Got it"
              >
                <Text className="text-white font-bold text-base">Got it</Text>
              </Pressable>
            </View>
          )}

          {activeSheet === SheetType.Leave && (
            <View>
              <Text className="text-t-lead font-bold text-happy-label mb-2">Leave this practice?</Text>
              <Text className="text-t-sub font-medium text-happy-label-2 mb-4">Nothing is saved yet.</Text>
              <Pressable
                onPress={onClose}
                className="w-full min-h-[52px] bg-happy-ink rounded-pill items-center justify-center mb-2 active:opacity-90"
                accessibilityRole="button"
                accessibilityLabel="Keep going"
              >
                <Text className="text-white font-bold text-base">Keep going</Text>
              </Pressable>
              <Pressable
                onPress={onLeaveConfirm}
                className="w-full min-h-[48px] bg-happy-surface-2 rounded-pill items-center justify-center mt-2 active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="Leave"
              >
                <Text className="text-happy-label font-semibold text-base">Leave</Text>
              </Pressable>
            </View>
          )}

          {activeSheet === SheetType.SignIn && (
            <View>
              <Text className="text-t-lead font-bold text-happy-label mb-2">Welcome back</Text>
              <Text className="text-t-sub font-medium text-happy-label-2 mb-4">
                Sign in to pick up where you left off.
              </Text>
              <Pressable
                onPress={onSignInPress}
                className="w-full min-h-[52px] bg-happy-label rounded-pill items-center justify-center mb-2 active:opacity-90"
                accessibilityRole="button"
                accessibilityLabel="Continue"
              >
                <Text className="text-white font-bold text-base">Continue</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
