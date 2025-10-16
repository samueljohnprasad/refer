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
    let mounted = true;

    const load = async () => {
      try {
        // 2) Check supabase profile field if user exists
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          // Fall back to local flag on error
          if (mounted) setLoading(false);
          return;
        }

        const remoteCompleted = Boolean(data?.onboarding_completed);
        if (mounted) {
          setCompleted(remoteCompleted);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(() => ({ loading, completed }), [loading, completed]);
};
