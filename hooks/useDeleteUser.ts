import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { deleteUserAuth } from "@/src/network/transcribeAudio";

interface DeleteUserDataResult {
  success: boolean;
  message: string;
}

export const useDeleteUser = () => {
  const { user } = useAuth();

  return useMutation<DeleteUserDataResult, Error, void>({
    mutationFn: async (): Promise<DeleteUserDataResult> => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      try {
        await deleteUserAuth();
        return {
          success: true,
          message: "All personal data has been permanently deleted",
        };
      } catch (error) {
        throw error;
      }
    },
  });
};
