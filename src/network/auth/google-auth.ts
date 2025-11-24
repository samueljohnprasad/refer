import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "./supabase";
import { Router } from "expo-router";

WebBrowser.maybeCompleteAuthSession(); // required for web only
// Use a single redirect URI across platforms (iOS/Android)
// Ensure this exact value is added to Supabase Auth > URL configuration > Additional Redirect URLs
const redirectUrl = AuthSession.makeRedirectUri();
console.log("redirectUrl", redirectUrl);

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) {
    return;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    throw error;
  }

  return data.session;
};

// Accept an optional Expo Router instance so we can programmatically
// navigate after the OAuth flow completes.
const performOAuth = async ({ router }: { router: Router }) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        skipBrowserRedirect: true,
        redirectTo: redirectUrl, // Must match the return URL below
        queryParams: {
          access_type: "offline",
          prompt: "select_account", // Force account selection to avoid cached sessions
        },
      },
    });

    if (error) throw error;

    const result = await WebBrowser.openAuthSessionAsync(
      data.url, // The URL from Supabase
      redirectUrl // The deep link to your app
    );

    if (result.type === "success" && result.url) {
      try {
        await createSessionFromUrl(result.url);
        // Navigate to tabs layout after successful login
        router.replace("/tabs/home");
      } catch (parseError) {}
    }
  } catch (error) {
    throw error;
  }
};

export { performOAuth, createSessionFromUrl };
