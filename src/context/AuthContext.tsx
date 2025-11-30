import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { supabase } from "../network/auth/supabase";
import { createSessionFromUrl } from "../network/auth/google-auth";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { WifiOffIcon, ReloadIcon } from "@hugeicons/core-free-icons";

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
  const toast = useToast();

  const initializeAuth = async () => {
    try {
      setError(false);
      setRetrying(true);

      // Trigger a session refresh which will fire the INITIAL_SESSION event
      const { error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      // Session and user will be set by onAuthStateChange INITIAL_SESSION event
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") {
        // Handle potential network error during initial session
        if (!session && error) {
          return; // Keep error state if we failed to initialize
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setError(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      // Show success toast when user signs in (navigation handled by signin screen)
      if (event === "SIGNED_IN" && session?.user) {
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

  // Show error screen if initialization failed
  if (error && !loading) {
    return <NetworkErrorScreen onRetry={handleRetry} retrying={retrying} />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
