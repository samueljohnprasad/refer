import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "@/database.types";
import { Platform } from "react-native";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "https://xaqeueshxpehijtxwklo.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTY2ODMsImV4cCI6MjA2ODE3MjY4M30.hKxftlcs-j4W1TrsbdycfT2tK9qowc3ZrgG1ZJoFwo4";

const isReactNative = Platform.OS === "ios" || Platform.OS === "android";
const isBrowser = typeof window !== "undefined";

const storage = isReactNative
  ? AsyncStorage
  : isBrowser
  ? window.localStorage
  : {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Enable URL session detection for OAuth
  },
});
