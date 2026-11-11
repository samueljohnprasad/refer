import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
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
          {activeSheet === SheetType.Who && (
            <View>
              <Text className="text-t-lead font-bold text-happy-label mb-2">Who is Happi?</Text>
              <Text className="text-t-sub font-medium text-happy-label-2 leading-relaxed mb-4">
                Happi is a panda who likes slow mornings and noticing small things. Happi keeps you
                company while you practise the skills in Happy. Happi isn’t a therapist, coach, or judge.
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
