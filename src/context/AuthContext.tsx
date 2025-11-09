import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { supabase } from "../network/auth/supabase";
import { createSessionFromUrl } from "../network/auth/google-auth";
import { useCheckStreakOnLaunch } from "@/hooks/data/useUpdateStreak";
import { router } from "expo-router";

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
  const checkStreakMutation = useCheckStreakOnLaunch();

  useEffect(() => {
    const fetchToken = async () => {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.access_token;
      // signOut();

      console.log("accessToken", accessToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    // Listen for auth changes **including** the INITIAL_SESSION event which
    // fires once Supabase finishes recovering any persisted session.
    // This avoids the race condition where getSession() returns null before
    // the async storage has been read.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      // INITIAL_SESSION fires exactly once and contains the session
      // restored from AsyncStorage (if any).
      if (event === "INITIAL_SESSION") {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check streak on app launch
        if (session?.user?.id) {
          checkStreakMutation.mutate(session.user.id);
        }
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

        // Check streak on sign in
        if (session.user.id) {
          checkStreakMutation.mutate(session.user.id);
        }
      }

      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        await AsyncStorage.clear();
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
      const response = await supabase.auth.signOut();
      if (response.error) throw response.error;
      setSession(null);
      setUser(null);
      await AsyncStorage.clear();
      console.log("Signed out successfully!");

      router.replace("/");
    } catch (error) {
      setSession(null);
      setUser(null);
      await AsyncStorage.clear();
      router.replace("/");
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
