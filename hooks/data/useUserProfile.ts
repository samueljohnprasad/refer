import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";

export const useUserProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!user) {
        return { displayName: "" };
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return {
        displayName: data?.display_name || "",
        userId: user.id,
      };
    },
    retry: (failureCount, error: any) => {
      if (error?.code === "PGRST116") {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
};
