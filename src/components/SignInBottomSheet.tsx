import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { performOAuth } from "../network/auth/google-auth";
import ShortBottomModal from "./ShortBottomModal";
import { forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  signInWithApple,
  signInWithAppleOAuth,
} from "../network/auth/apple-auth";
import { isIOS } from "../utils/mood";

export default forwardRef<BottomSheetModal | null>((props, ref) => {
  const router = useRouter();
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await performOAuth({ router: router });
    } catch (error) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>Google Sign-In failed. Please try again.</ToastTitle>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <ShortBottomModal ref={ref} snapPoints={["35%"]}>
      <View className="flex-1 px-6 pt-4 pb-8 justify-between bg-white rounded-[24px]">
        <View>
          <Text
            className="text-3xl text-gray-900 mb-2"
            style={{ fontFamily: "CormorantSemiBold" }}
          >
            Welcome Back
          </Text>
          <Text className="text-gray-500 text-base leading-5">
            Sign in to sync your journals, moods, and calories across all your
            devices.
          </Text>
        </View>

        <View className="gap-3">
          <TouchableOpacity
            onPress={() => {
              if (isIOS) {
                return signInWithApple();
              }
              signInWithAppleOAuth();
            }}
            className="w-full bg-gray-900 h-14 rounded-full items-center justify-center flex-row"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg">
              Sign in with Apple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className="w-full bg-white border border-gray-200 h-14 rounded-full items-center justify-center flex-row"
            activeOpacity={0.8}
          >
            <Text className="text-gray-900 font-semibold text-lg">
              Sign in with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ShortBottomModal>
  );
});
