import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "./supabase";
import { Router } from "expo-router";
import type { Session } from "@supabase/supabase-js";

WebBrowser.maybeCompleteAuthSession(); // required for web only
// Use a single redirect URI across platforms (iOS/Android)
// Ensure this exact value is added to Supabase Auth > URL configuration > Additional Redirect URLs
const redirectUrl = AuthSession.makeRedirectUri();

export class AuthIdentityConflictError extends Error {
  constructor(message = "This login is already linked to another account.") {
    super(message);
    this.name = "AuthIdentityConflictError";
  }
}

export class AuthFlowCancelledError extends Error {
  constructor(message = "Authentication was cancelled.") {
    super(message);
    this.name = "AuthFlowCancelledError";
  }
}

export const isIdentityConflictError = (error: unknown): boolean => {
  if (error instanceof AuthIdentityConflictError) return true;

  const maybeError = error as { code?: string; message?: string; name?: string };
  const haystack = [
    maybeError?.code,
    maybeError?.message,
    maybeError?.name,
    error instanceof Error ? error.message : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    haystack.includes("identity_already_exists") ||
    haystack.includes("already linked") ||
    haystack.includes("already exists") ||
    haystack.includes("already registered") ||
    haystack.includes("belongs to another")
  );
};

const createSessionFromUrl = async (url: string): Promise<Session | null> => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  const callbackErrorCode =
    errorCode ?? params.error_code ?? params.error ?? params.errorCode;

  if (callbackErrorCode) {
    const description =
      params.error_description ??
      params.errorDescription ??
      String(callbackErrorCode);

    if (String(callbackErrorCode) === "identity_already_exists") {
      throw new AuthIdentityConflictError(String(description));
    }

    throw new Error(String(description));
  }

  const { access_token, refresh_token } = params;

  if (!access_token) {
    return null;
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

const openAuthUrl = async (url: string): Promise<Session | null> => {
  const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

  if (result.type !== "success" || !result.url) {
    throw new AuthFlowCancelledError();
  }

  return createSessionFromUrl(result.url);
};

export const linkGoogleIdentity = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.linkIdentity({
    provider: "google",
    options: {
      skipBrowserRedirect: true,
      redirectTo: redirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    if (isIdentityConflictError(error)) {
      throw new AuthIdentityConflictError(error.message);
    }
    throw error;
  }

  if (!data?.url) return null;

  return openAuthUrl(data.url);
};

export const signInWithGoogleOAuth = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      skipBrowserRedirect: true,
      redirectTo: redirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) throw error;
  if (!data?.url) return null;

  return openAuthUrl(data.url);
};

// Accept an optional Expo Router instance so we can programmatically
// navigate after the OAuth flow completes.
const performOAuth = async ({ router }: { router: Router }) => {
  try {
    await signInWithGoogleOAuth();
    // Navigate to tabs layout after successful login
    router.replace("/tabs/screens/onboard-container");
  } catch (error) {
    throw error;
  }
};

export { performOAuth, createSessionFromUrl };
