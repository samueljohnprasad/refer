import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/src/network/auth/supabase";
import { useEffect, useState } from "react";
import { ONBOARDING_KEY } from "./useCompleteOnboarding";

export type OnboardingStatus = {
  loading: boolean;
  completed: boolean;
};

// ponytail: check local storage first + bounded timeout to prevent infinite loading screen
export const useOnboardingStatus = (): OnboardingStatus => {
  const [loading, setLoading] = useState<boolean>(true);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const load = async (): Promise<void> => {
      try {
        // 1) Fast local storage check
        const localStatus = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (localStatus === "true") {
          if (isMounted) {
            setCompleted(true);
            setLoading(false);
          }
          return;
        }

        // 2) Bounded network check against Supabase (max 2.5s)
        const networkTimeout = new Promise<{ user: null }>((resolve) =>
          setTimeout(() => resolve({ user: null }), 2500),
        );

        const authUserPromise = supabase.auth.getUser().then((res) => res.data);
        const authData = await Promise.race([authUserPromise, networkTimeout]);

        if (!authData?.user) {
          if (isMounted) setLoading(false);
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (isMounted) {
          const remoteCompleted = Boolean(data?.onboarding_completed);
          if (remoteCompleted) {
            await AsyncStorage.setItem(ONBOARDING_KEY, "true");
          }
          setCompleted(remoteCompleted);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { loading, completed };
};
