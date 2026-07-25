import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { useToast } from "heroui-native";
import { supabase } from "../network/auth/supabase";
import {
  AuthFlowCancelledError,
  AuthIdentityConflictError,
  createSessionFromUrl,
  isIdentityConflictError,
  linkGoogleIdentity,
  signInWithGoogleOAuth,
} from "../network/auth/google-auth";
import {
  linkAppleIdentity,
  linkAppleIdentityOAuth,
  signInWithApple,
  signInWithAppleOAuth,
} from "../network/auth/apple-auth";
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { WifiOffIcon, ReloadIcon } from "@hugeicons/core-free-icons";
import {
  registerPushToken,
  unregisterPushToken,
} from "../utils/pushTokenRegistration";
import { migrateGuestProgress } from "../lib/migrations/migrateGuestProgress";

export type AuthProviderId = "apple" | "google";

export interface AccountConflict {
  provider: AuthProviderId;
  anonymousUserId: string;
  message: string;
}

export type ClaimProfileResult =
  | { status: "linked"; session: Session; user: User }
  | { status: "existing_account"; conflict: AccountConflict }
  | { status: "cancelled" }
  | { status: "failed"; error: unknown };

export type MoveToExistingAccountResult =
  | { status: "signed_in"; session: Session; user: User }
  | { status: "cancelled" }
  | { status: "failed"; error: unknown };

const isAnonymousSignInDisabledError = (error: unknown): boolean => {
  const maybeError = error as {
    code?: string;
    message?: string;
    name?: string;
  };
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
    haystack.includes("anonymous sign-ins are disabled") ||
    haystack.includes("anonymous signups are disabled")
  );
};

const AUTH_STARTUP_TIMEOUT_MS = 10000;

const withTimeout = async <T,>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAnonymous: boolean;
  isSigningOut: boolean;
  accountConflict: AccountConflict | null;
  ensureAnonymousSession: () => Promise<Session | null>;
  claimProfile: (provider: AuthProviderId) => Promise<ClaimProfileResult>;
  moveToExistingAccount: (
    provider: AuthProviderId,
  ) => Promise<MoveToExistingAccountResult>;
  clearAccountConflict: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAnonymous: false,
  isSigningOut: false,
  accountConflict: null,
  ensureAnonymousSession: async () => null,
  claimProfile: async () => ({
    status: "failed",
    error: new Error("AuthProvider missing"),
  }),
  moveToExistingAccount: async () => ({
    status: "failed",
    error: new Error("AuthProvider missing"),
  }),
  clearAccountConflict: () => {},
  signOut: async () => {},
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Error Screen Component
const NetworkErrorScreen: React.FC<{
  onRetry: () => void;
  retrying: boolean;
}> = ({ onRetry, retrying }) => (
  <View className="flex-1 bg-gradient-to-b from-purple-50 to-white items-center justify-center px-6">
    <View className="items-center">
      <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-6">
        <HugeiconsIcon icon={WifiOffIcon} size={48} color="#DC2626" />
      </View>

      <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
        Connection Error
      </Text>

      <Text className="text-base text-gray-600 text-center mb-8 leading-6">
        Unable to connect to the server.{"\n"}
        Please check your internet connection and try again.
      </Text>

      <TouchableOpacity
        onPress={onRetry}
        disabled={retrying}
        activeOpacity={0.8}
        className="rounded-2xl overflow-hidden"
      >
        <LinearGradient
          colors={retrying ? ["#999", "#777"] : ["#7B61FF", "#9C7CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-8 py-4 flex-row items-center gap-3"
        >
          {retrying && <ActivityIndicator size="small" color="#FFF" />}
          {!retrying && (
            <HugeiconsIcon icon={ReloadIcon} size={20} color="#FFF" />
          )}
          <Text className="text-white text-lg font-bold">
            {retrying ? "Retrying..." : "Retry Connection"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [retrying, setRetrying] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [accountConflict, setAccountConflict] =
    useState<AccountConflict | null>(null);
  const { toast } = useToast();

  const ensureProfileForUser = async (nextUser: User): Promise<void> => {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { id: nextUser.id },
        { onConflict: "id", ignoreDuplicates: true },
      );

    if (profileError) {
      console.warn("[Auth] Failed to ensure profile row:", profileError);
    }
  };

  const ensureProfileForUserInBackground = (nextUser: User): void => {
    ensureProfileForUser(nextUser).catch((profileError) => {
      console.warn("[Auth] Failed to ensure profile row:", profileError);
    });
  };

  const ensureAnonymousSessionInternal = async (): Promise<Session | null> => {
    const {
      data: { session: currentSession },
      error: currentSessionError,
    } = await withTimeout(
      supabase.auth.getSession(),
      AUTH_STARTUP_TIMEOUT_MS,
      "Supabase getSession",
    );

    if (currentSessionError) throw currentSessionError;

    if (currentSession) {
      ensureProfileForUserInBackground(currentSession.user);
      return currentSession;
    }

    const { data, error: anonymousError } = await withTimeout(
      supabase.auth.signInAnonymously(),
      AUTH_STARTUP_TIMEOUT_MS,
      "Supabase anonymous sign-in",
    );

    if (anonymousError) {
      if (isAnonymousSignInDisabledError(anonymousError)) {
        console.warn(
          "[Auth] Anonymous sign-ins are disabled in Supabase. Enable Anonymous sign-ins in the hosted Supabase dashboard to use anonymous purchase/profile claiming.",
        );
        return null;
      }

      throw anonymousError;
    }
    if (data.session?.user) {
      ensureProfileForUserInBackground(data.session.user);
    }

    return data.session;
  };

  const initializeAuth = async () => {
    try {
      setError(false);
      setRetrying(true);

      const nextSession = await ensureAnonymousSessionInternal();
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
      setRetrying(false);
    } catch (err) {
      console.error("Auth initialization error:", err);
      setError(true);
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        setSession(session);
        setUser(session?.user ?? null);
        setError(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      // Show success toast when user signs in (navigation handled by signin screen)
      if (event === "SIGNED_IN" && session?.user) {
        ensureProfileForUserInBackground(session.user);

        if (!session.user.is_anonymous) {
          setTimeout(() => {
            // Register push token for remote notifications.
            registerPushToken(session.user.id).catch(console.error);
            // Legacy local guest migration is intentionally skipped for anonymous users.
            migrateGuestProgress(session.user.id).catch(console.error);

            toast.show({
              placement: "bottom",
              variant: "success",
              label: "Signed in successfully!",
            });
          }, 0);
        }
      }

      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        AsyncStorage.clear().catch(console.error);
      }
    });

    // Initialize auth after setting up the listener
    initializeAuth();

    // Handle OAuth redirect when user returns to app
    const handleDeepLink = async (url: string) => {
      if (url && url.includes("access_token")) {
        try {
          await createSessionFromUrl(url);
        } catch (error) {}
      }
    };

    // Listen for URL changes (when user returns from OAuth)
    const urlSubscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    // Check if app was opened with a URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.unsubscribe();
      urlSubscription?.remove();
    };
  }, []);

  const handleRetry = () => {
    initializeAuth();
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsSigningOut(true);
      const response = await supabase.auth.signOut();
      if (response.error) throw response.error;
      // Invalidate push token before clearing session
      if (user?.id) {
        await unregisterPushToken(user.id).catch(console.error);
      }
      await AsyncStorage.clear();

      const anonymousSession = await ensureAnonymousSessionInternal();
      setSession(anonymousSession);
      setUser(anonymousSession?.user ?? null);

      router.replace("/tabs/screens/onboard-container");
    } catch (error) {
      setSession(null);
      setUser(null);
      await AsyncStorage.clear();
      router.replace("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  const ensureAnonymousSession = async (): Promise<Session | null> => {
    const anonymousSession = await ensureAnonymousSessionInternal();
    setSession(anonymousSession);
    setUser(anonymousSession?.user ?? null);
    return anonymousSession;
  };

  const claimProfile = async (
    provider: AuthProviderId,
  ): Promise<ClaimProfileResult> => {
    let anonymousUserId = "";

    try {
      const currentSession = await ensureAnonymousSessionInternal();
      if (!currentSession?.user) {
        return {
          status: "failed",
          error: new Error("No anonymous session available."),
        };
      }

      anonymousUserId = currentSession.user.id;

      if (!currentSession.user.is_anonymous) {
        return {
          status: "linked",
          session: currentSession,
          user: currentSession.user,
        };
      }

      const linkedSession =
        provider === "google"
          ? await linkGoogleIdentity()
          : Platform.OS === "ios"
            ? await linkAppleIdentity()
            : await linkAppleIdentityOAuth();

      const nextSession =
        linkedSession ?? (await supabase.auth.getSession()).data.session;

      if (!nextSession?.user) {
        return {
          status: "failed",
          error: new Error("No session returned after linking identity."),
        };
      }

      await ensureProfileForUser(nextSession.user);
      setSession(nextSession);
      setUser(nextSession.user);
      setAccountConflict(null);

      return { status: "linked", session: nextSession, user: nextSession.user };
    } catch (err) {
      if (err instanceof AuthFlowCancelledError) {
        return { status: "cancelled" };
      }

      if (
        err instanceof AuthIdentityConflictError ||
        isIdentityConflictError(err)
      ) {
        const conflict: AccountConflict = {
          provider,
          anonymousUserId: anonymousUserId ?? "",
          message:
            err instanceof Error
              ? err.message
              : "This login is already linked to another Happy account.",
        };
        setAccountConflict(conflict);
        return { status: "existing_account", conflict };
      }

      return { status: "failed", error: err };
    }
  };

  const moveToExistingAccount = async (
    provider: AuthProviderId,
  ): Promise<MoveToExistingAccountResult> => {
    try {
      const nextSession =
        provider === "google"
          ? await signInWithGoogleOAuth()
          : Platform.OS === "ios"
            ? await signInWithApple()
            : await signInWithAppleOAuth();

      const resolvedSession =
        nextSession ?? (await supabase.auth.getSession()).data.session;

      if (!resolvedSession?.user) {
        return {
          status: "failed",
          error: new Error("No session returned after signing in."),
        };
      }

      await ensureProfileForUser(resolvedSession.user);
      setSession(resolvedSession);
      setUser(resolvedSession.user);
      setAccountConflict(null);

      return {
        status: "signed_in",
        session: resolvedSession,
        user: resolvedSession.user,
      };
    } catch (err) {
      if (err instanceof AuthFlowCancelledError) {
        return { status: "cancelled" };
      }

      return { status: "failed", error: err };
    }
  };

  const clearAccountConflict = (): void => {
    setAccountConflict(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAnonymous: Boolean(user?.is_anonymous),
    isSigningOut,
    accountConflict,
    ensureAnonymousSession,
    claimProfile,
    moveToExistingAccount,
    clearAccountConflict,
    signOut,
  };

  // Show error screen if initialization failed
  if (error && !loading) {
    return <NetworkErrorScreen onRetry={handleRetry} retrying={retrying} />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
