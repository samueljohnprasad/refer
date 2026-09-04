import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { SafeAreaView } from "@/src/components/tw";
import Animated from "react-native-reanimated";
import { PressableScale } from "@/src/components/ui/PressableScale";
import {
  useSignUpPromptModalViewModel,
  type SignUpPromptModalProps,
} from "../hooks/useSignUpPromptModalViewModel";

export interface SignUpPromptModalViewProps
  extends ReturnType<typeof useSignUpPromptModalViewModel> {}

/**
 * Presentational View component for SignUpPromptModal.
 * Strictly contains JSX code without internal hooks.
 */
export const SignUpPromptModalView = React.memo(
  function SignUpPromptModalView({
    cardStyle,
    backdropStyle,
    visible,
    guestXP,
    completedNodes,
    onSignUp,
    onDismiss,
  }: SignUpPromptModalViewProps): React.JSX.Element {
    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent
        onRequestClose={onDismiss}
      >
        <Animated.View
          style={[
            backdropStyle,
            { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
          ]}
        >
          <Pressable
            onPress={onDismiss}
            style={{ flex: 1 }}
            accessibilityLabel="Dismiss sign up prompt"
            accessibilityRole="button"
          />
        </Animated.View>

        <Animated.View
          style={[
            cardStyle,
            {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            },
          ]}
        >
          <SafeAreaView
            className="bg-brand-surface rounded-t-3xl px-6 pt-6 pb-4"
            edges={["bottom"]}
          >
            <View className="w-10 h-1 bg-slate-200 rounded-full self-center mb-5" />

            <View className="items-center mb-4">
              <View className="w-20 h-20 rounded-full bg-violet-50 items-center justify-center">
                <Text style={{ fontSize: 36 }}>🚀</Text>
              </View>
            </View>

            <Text className="text-2xl font-bold text-ink text-center mb-2">
              You're doing great!
            </Text>

            <Text className="text-base text-ink-soft text-center leading-6 mb-5 px-2">
              Sign up to save your progress and continue your journey.
            </Text>

            <View className="flex-row justify-center gap-6 mb-6">
              <View className="items-center">
                <Text className="text-2xl font-bold text-ink">
                  {completedNodes}
                </Text>
                <Text className="text-xs text-ink-muted">
                  {completedNodes === 1 ? "node done" : "nodes done"}
                </Text>
              </View>
              <View className="w-px bg-slate-200" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-ink">{guestXP}</Text>
                <Text className="text-xs text-ink-muted">IP earned</Text>
              </View>
            </View>

            <View className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6">
              <Text className="text-sm text-amber-700 text-center leading-5">
                ⚠️ Your progress will be lost if you leave without signing up
              </Text>
            </View>

            <PressableScale
              onPress={onSignUp}
              scale={0.97}
              hapticStyle="medium"
              style={{
                backgroundColor: "#7B61FF",
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 4,
                borderBottomColor: "#5B41DF",
                marginBottom: 12,
              }}
              accessibilityLabel="Sign up to save progress"
              accessibilityRole="button"
            >
              <Text className="text-base font-bold text-white">
                Sign Up & Save Progress
              </Text>
            </PressableScale>

            <Pressable
              onPress={onDismiss}
              className="py-3 items-center"
              accessibilityLabel="Maybe later"
              accessibilityRole="button"
            >
              <Text className="text-sm text-ink-muted">Maybe later</Text>
            </Pressable>
          </SafeAreaView>
        </Animated.View>
      </Modal>
    );
  },
);

/**
 * Container component for SignUpPromptModal.
 */
export default function SignUpPromptModal(
  props: SignUpPromptModalProps,
): React.JSX.Element {
  const viewModel = useSignUpPromptModalViewModel(props);
  return <SignUpPromptModalView {...viewModel} />;
}
export type { SignUpPromptModalProps };
