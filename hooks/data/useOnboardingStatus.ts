import { supabase } from "@/src/network/auth/supabase";
import { useEffect, useMemo, useState } from "react";

export type OnboardingStatus = {
  loading: boolean;
  completed: boolean;
};

export const useOnboardingStatus = (): OnboardingStatus => {
  const [loading, setLoading] = useState<boolean>(true);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        // 2) Check supabase profile field if user exists
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .maybeSingle();
        if (error) {
          // Fall back to local flag on error
          setLoading(false);
          return;
        }

        const remoteCompleted = Boolean(data?.onboarding_completed);

        setCompleted(remoteCompleted);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { loading, completed };
};
