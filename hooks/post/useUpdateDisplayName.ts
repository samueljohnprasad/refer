import { supabase } from "@/src/network/auth/supabase";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";

export const useUpdateDisplayName = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (displayName: string) => {
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
