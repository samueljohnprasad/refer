import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { performOAuth } from "../network/auth/google-auth";
import ShortBottomModal from "./ShortBottomModal";
import { forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default forwardRef<BottomSheetModal | null>((props, ref) => {
  const router = useRouter();
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await performOAuth({ replace: router.replace });
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
    <ShortBottomModal ref={ref}>
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
        <Heading size="3xl" className="text-left">
          Sign in 
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
});
