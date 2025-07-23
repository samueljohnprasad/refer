import {
  BottomSheetContent,
  BottomSheetPortal,
} from "@/components/ui/botton-sheet";
import { useMemo } from "react";
import AnimatedLinearGradient from "./AnimatedLinearGradient";
import { StyleSheet } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";
import { performOAuth } from "@/lib/auth/google-auth";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import FirefliesParticles from "@/components/ui/FirefliesParticles";

export default () => {
  const snapPoints = useMemo(() => ["50%"], []);
  const router = useRouter();
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google OAuth flow...");
      await performOAuth({ replace: router.replace });
    } catch (error) {
      console.error("Google Sign-In error:", error);
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
    <BottomSheetPortal
      enableDynamicSizing
      snapPoints={snapPoints}
      android_keyboardInputMode="adjustResize"
      style={{ padding: 0, marginHorizontal: 0 }}
      containerStyle={{
        backgroundColor: "transparent",
        alignItems: "flex-end",
        borderRadius: 16,
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      }}
      handleStyle={{ display: "none" }}
      backgroundStyle={{
        borderRadius: 16,
        backgroundColor: "transparent",
        alignItems: "flex-end",
      }}
      bottomInset={0}
      enablePanDownToClose
    >
      <BottomSheetContent
        style={{
          backgroundColor: "transparent",
          borderRadius: 16,
          borderBottomStartRadius: 16,
          borderBottomEndRadius: 16,
          height: 370,
          paddingHorizontal: 12,
        }}
      >
        <FirefliesParticles eveningOnly={false} fireflyCount={12} />

        <VStack
          className="flex-1 bg-green rounded-2xl h-full px-6 "
          space="4xl"
          style={{
            backgroundColor: "white",
            borderRadius: 24,
            height: "100%",
            paddingTop: 24,
          }}
        >
          <AnimatedLinearGradient
            className="rounded-2xl"
            colors={["#f0efed", "#bdebf8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
          />
          <Heading size="3xl" className="text-left">
            I already have an account
          </Heading>
          <VStack space="xl" className="px-2">
            <Button
              onPress={handleGoogleSignIn}
              variant="solid"
              action="primary"
              size="xl"
              className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
            >
              <ButtonText>Sign In with Google</ButtonText>
            </Button>
            <Button
              onPress={handleGoogleSignIn}
              variant="solid"
              action="secondary"
              size="xl"
              className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
            >
              <ButtonText>Sign In with Apple</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </BottomSheetContent>
    </BottomSheetPortal>
  );
};
