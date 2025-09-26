import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { displayName: "" };
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      return {
        displayName: data?.display_name || "",
        userId: user.id,
      };
    },
    // Don't retry on 404 errors (user not found)
    retry: (failureCount, error: any) => {
      if (error?.code === "PGRST116") {
        // Record not found
        return false;
      }
      return failureCount < 2; // Retry other errors up to 3 times
    },
    // Cache for 5 minutes, stale after 1 minute
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUpdateDisplayName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          display_name: displayName.trim(),
        },
        { onConflict: "id" }
      );

      if (error) {
        console.log(error);
        throw error;
      }

      return { displayName: displayName.trim() };
    },
    onSuccess: (data) => {
    //   queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      // Update the cache directly
      queryClient.setQueryData(["userProfile"], (oldData: any) => {
        return {
          ...oldData,
          displayName: data.displayName,
        };
      });
    },
  });
};
