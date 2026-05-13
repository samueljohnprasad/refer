import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "./supabase";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  AuthFlowCancelledError,
  AuthIdentityConflictError,
  createSessionFromUrl,
  isIdentityConflictError,
} from "./google-auth";
import { router } from "expo-router";
import type { Session } from "@supabase/supabase-js";

WebBrowser.maybeCompleteAuthSession();

const saveAppleFullName = async (
  fullName: AppleAuthentication.AppleAuthenticationFullName | null,
): Promise<void> => {
  if (!fullName) return;

  const nameParts = [];
  if (fullName.givenName) nameParts.push(fullName.givenName);
  if (fullName.middleName) nameParts.push(fullName.middleName);
  if (fullName.familyName) nameParts.push(fullName.familyName);
  const resolvedFullName = nameParts.join(" ");

  await supabase.auth.updateUser({
    data: {
      full_name: resolvedFullName,
      given_name: fullName.givenName,
      family_name: fullName.familyName,
    },
  });
};

export async function signInWithApple(): Promise<Session | null> {
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
        data,
      } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      if (error) throw error;

      if (!error) {
        // Apple only provides the user's full name on the first sign-in
        // Save it to user metadata if available
        await saveAppleFullName(credential.fullName);
      }

      return data.session;
    } else {
      throw new Error("No identityToken.");
    }
  } catch (e: any) {
    if (e.code === "ERR_REQUEST_CANCELED") {
      throw new AuthFlowCancelledError();
    }
    throw e;
  }
}

const redirectUrl = AuthSession.makeRedirectUri();

export const signInWithAppleOAuth = async (): Promise<Session | null> => {
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(
    data.url, // The URL from Supabase
    redirectUrl // The deep link to your app
  );

  if (result.type === "success" && result.url) {
    const session = await createSessionFromUrl(result.url);
    // Navigate to tabs layout after successful login
    router.replace("/tabs/screens/onboard-container");
    return session;
  }

  throw new AuthFlowCancelledError();
};

export const linkAppleIdentity = async (): Promise<Session | null> => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error("No identityToken.");
    }

    const { data, error } = await supabase.auth.linkIdentity({
      provider: "apple",
      token: credential.identityToken,
    });

    if (error) {
      if (isIdentityConflictError(error)) {
        throw new AuthIdentityConflictError(error.message);
      }
      throw error;
    }

    await saveAppleFullName(credential.fullName);
    return data.session;
  } catch (e: any) {
    if (e.code === "ERR_REQUEST_CANCELED") {
      throw new AuthFlowCancelledError();
    }
    throw e;
  }
};

export const linkAppleIdentityOAuth = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.linkIdentity({
    provider: "apple",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    if (isIdentityConflictError(error)) {
      throw new AuthIdentityConflictError(error.message);
    }
    throw error;
  }

  if (!data?.url) return null;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type !== "success" || !result.url) {
    throw new AuthFlowCancelledError();
  }

  return createSessionFromUrl(result.url);
};
