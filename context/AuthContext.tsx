import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { createSessionFromUrl } from "../lib/auth/google-auth";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Listen for auth changes **including** the INITIAL_SESSION event which
    // fires once Supabase finishes recovering any persisted session.
    // This avoids the race condition where getSession() returns null before
    // the async storage has been read.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      // INITIAL_SESSION fires exactly once and contains the session
      // restored from AsyncStorage (if any).
      if (event === "INITIAL_SESSION") {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        return; // no further handling needed
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Show success toast when user signs in (navigation handled by signin screen)
      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in successfully!");

        // Show success toast
        toast.show({
          placement: "bottom right",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>Signed in successfully!</ToastTitle>
            </Toast>
          ),
        });
      }
    });

    // Handle OAuth redirect when user returns to app
    const handleDeepLink = async (url: string) => {
      console.log("Deep link received:", url);
      if (url && url.includes("access_token")) {
        try {
          await createSessionFromUrl(url);
        } catch (error) {
          console.error("Error handling OAuth redirect:", error);
        }
      }
    };

    // Listen for URL changes (when user returns from OAuth)
    const urlSubscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link received:", url);
      handleDeepLink(url);
    });

    // Check if app was opened with a URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial deep link received:", url);
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.unsubscribe();
      urlSubscription?.remove();
    };
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      // Clear any stored session data
      await AsyncStorage.multiRemove([
        `sb-${process.env.EXPO_PUBLIC_SUPABASE_REF_ID}-auth-token`,
        `sb-${process.env.EXPO_PUBLIC_SUPABASE_REF_ID}-auth-token-1`,
        `sb-${process.env.EXPO_PUBLIC_SUPABASE_REF_ID}-auth-token-2`,
        "sb:token",
        "sb:state",
        "sb:session",
        "sb:provider_token",
        "sb:refresh_token",
        "sb:expires_at",
      ]);

      console.log("Signing out from Supabase");
      const response = await supabase.auth.signOut();
      console.log("Signed out from Supabase", response);
      if (response.error) throw response.error;

      // Reset all auth state
      setSession(null);
      setUser(null);

      console.log("Signed out successfully!");
      // Clear AsyncStorage completely if needed (use with caution)
      // await AsyncStorage.clear();
    } catch (error) {
      // Even if there's an error, we want to ensure the app is in a signed-out state
      setSession(null);
      setUser(null);
      await AsyncStorage.clear(); // As a last resort, clear everything
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
