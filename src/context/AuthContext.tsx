import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { supabase } from "../network/auth/supabase";
import { createSessionFromUrl } from "../network/auth/google-auth";
import { router } from "expo-router";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isSigningOut: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isSigningOut: false,
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
  const [isSigningOut, setIsSigningOut] = useState(false);
  const toast = useToast();

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const { data } = await supabase.auth.getSession();
  //     const accessToken = data?.session?.access_token;
  //     // signOut();
  //   };
  //   fetchToken();
  // }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Show success toast when user signs in (navigation handled by signin screen)
      if (event === "SIGNED_IN" && session?.user) {
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

      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        await AsyncStorage.clear();
      }
    });

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

  const signOut = async (): Promise<void> => {
    try {
      setIsSigningOut(true);
      const response = await supabase.auth.signOut();
      if (response.error) throw response.error;
      setSession(null);
      setUser(null);
      await AsyncStorage.clear();

      router.replace("/");
    } catch (error) {
      setSession(null);
      setUser(null);
      await AsyncStorage.clear();
      router.replace("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isSigningOut,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
