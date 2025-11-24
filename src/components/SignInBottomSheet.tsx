import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { performOAuth } from "../network/auth/google-auth";
import ShortBottomModal from "./ShortBottomModal";
import { forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { handleApple } from "../network/auth/apple-auth";
import { supabase } from "../network/auth/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
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
          {/* <Button
            onPress={handleApple}
            variant="solid"
            action="secondary"
            size="xl"
            className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
          >
            <ButtonText>Sign In with Apple</ButtonText>
          </Button> */}
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={5}
            style={{ width: 200, height: 64 }}
            onPress={async () => {
              try {
                const credential = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                });
                console.log("credential ", credential);
                // Sign in via Supabase Auth.
                if (credential.identityToken) {
                  const {
                    error,
                    data: { user },
                  } = await supabase.auth.signInWithIdToken({
                    provider: "apple",
                    token: credential.identityToken,
                  });
                  console.log(JSON.stringify({ error, user }, null, 2));
                  if (!error) {
                    // Apple only provides the user's full name on the first sign-in
                    // Save it to user metadata if available
                    if (credential.fullName) {
                      const nameParts = [];
                      if (credential.fullName.givenName)
                        nameParts.push(credential.fullName.givenName);
                      if (credential.fullName.middleName)
                        nameParts.push(credential.fullName.middleName);
                      if (credential.fullName.familyName)
                        nameParts.push(credential.fullName.familyName);
                      const fullName = nameParts.join(" ");
                      await supabase.auth.updateUser({
                        data: {
                          full_name: fullName,
                          given_name: credential.fullName.givenName,
                          family_name: credential.fullName.familyName,
                        },
                      });
                    }
                    // User is signed in.
                  }
                } else {
                  throw new Error("No identityToken.");
                }
              } catch (e: any) {
                if (e.code === "ERR_REQUEST_CANCELED") {
                  // handle that the user canceled the sign-in flow
                } else {
                  // handle other errors
                }
              }
            }}
          />
        </VStack>
      </VStack>
    </ShortBottomModal>
  );
});
