import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "./supabase";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { createSessionFromUrl } from "./google-auth";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
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
      }
    } else {
      throw new Error("No identityToken.");
    }
  } catch (e: any) {
    if (e.code === "ERR_REQUEST_CANCELED") {
    } else {
    }
  }
}

const redirectUrl = AuthSession.makeRedirectUri();

export const signInWithAppleOAuth = async () => {
  console.log("redirectUrlll", redirectUrl);
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: false,
    },
  });
  console.log("redirectUrlll data", data, error);
  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(
    data.url, // The URL from Supabase
    redirectUrl // The deep link to your app
  );
  console.log("redirectUrlll result", result);

  if (result.type === "success" && result.url) {
    try {
      await createSessionFromUrl(result.url);
      // Navigate to tabs layout after successful login
      router.replace("/tabs/home");
    } catch (parseError) {}
  }
};
