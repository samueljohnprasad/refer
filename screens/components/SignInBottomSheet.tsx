import AnimatedLinearGradient from "./AnimatedLinearGradient";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";
import { performOAuth } from "@/lib/auth/google-auth";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import ShortBottomModal from "@/components/ui/short-bottom-modal";
import { StyleSheet } from "react-native";

export default () => {
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
    <ShortBottomModal>
      <VStack
        className="flex-1  rounded-2xl h-full px-6 "
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
    </ShortBottomModal>
  );
};
