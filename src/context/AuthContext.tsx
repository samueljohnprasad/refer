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
    const fetchToken = async () => {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.access_token;
      // signOut();

      console.log("accessToken", accessToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

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
