import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "@/database.types";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

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
