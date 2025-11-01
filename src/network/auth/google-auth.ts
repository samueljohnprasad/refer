import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectUrl = Linking.createURL("/");
console.log("Using Supabase redirect:", redirectUrl);

const createSessionFromUrl = async (url: string) => {
  console.log("Creating session from URL:", url);

  const { params, errorCode } = QueryParams.getQueryParams(url);
  console.log("Parsed params:", params);
  console.log("Error code:", errorCode);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) {
    console.log("No access token found in URL");
    return;
  }

  console.log("Setting session with tokens...");
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    console.error("Error setting session:", error);
    throw error;
  }

  console.log("Session created successfully:", data.session?.user?.email);
  return data.session;
};

// Accept an optional Expo Router instance so we can programmatically
// navigate after the OAuth flow completes.
const performOAuth = async (router?: any) => {
  try {
    console.log("Starting OAuth with Supabase redirect");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        skipBrowserRedirect: true,
        redirectTo: "Happy://auth/callback", // Ensure Supabase keeps the dashboard path
        queryParams: {
          access_type: "offline",
          prompt: "select_account", // Force account selection to avoid cached sessions
        },
      },
    });
    if (error) throw error;
    if (data) {
      console.log("User data:", data);
      // await supabase
      //   .from("profiles")
      //   .insert([{ id: user.id, username: "new_user" }]);
    }
    console.log("OAuth URL:", data?.url);
    const result = await WebBrowser.openAuthSessionAsync(
      data.url, // The URL from Supabase
      redirectUrl // The deep link to your app
    );
    console.log("Browser result:", result.type);

    if (result.type === "success" && result.url) {
      try {
        await createSessionFromUrl(result.url);
        // Navigate to tabs layout after successful login
        router?.replace("/tabs");
      } catch (parseError) {
        console.error("Error parsing redirect URL:", parseError);
      }
    }
  } catch (error) {
    console.error("OAuth error:", error);
    throw error;
  }
};

const sendMagicLink = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) throw error;
  // Email sent.
};

export { performOAuth, sendMagicLink, createSessionFromUrl };
