import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import type { CopingCard, ExerciseType } from "@/src/types/exerciseFlow";

// ─── Query key ───────────────────────────────────────────────────────────────

const QUERY_KEY = (userId: string, includeArchived: boolean) =>
  ["coping_cards", userId, includeArchived] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type NewCopingCard = Omit<
  CopingCard,
  "id" | "user_id" | "created_at" | "starred" | "archived"
>;

export interface UseCopingCardsReturn {
  cards: CopingCard[];
  isLoading: boolean;
  saveCard: (card: NewCopingCard) => Promise<CopingCard>;
  toggleStar: (id: string) => Promise<void>;
  archiveCard: (id: string) => Promise<void>;
  unarchiveCard: (id: string) => Promise<void>;
  isError: boolean;
  refetch: () => void;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useCopingCards = (
  includeArchived = false,
): UseCopingCardsReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const qk = QUERY_KEY(user?.id ?? "", includeArchived);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const query = useQuery({
    queryKey: qk,
    queryFn: async (): Promise<CopingCard[]> => {
      if (!user?.id) throw new Error("User not authenticated");

      let q = supabase
        .from("coping_cards" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("starred", { ascending: false })
        .order("created_at", { ascending: false });

      if (!includeArchived) {
        q = q.eq("archived", false);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as any as CopingCard[];
    },
    enabled: !!user?.id,
  });

  // ── Save ──────────────────────────────────────────────────────────────────

  const saveMutation = useMutation<
    CopingCard,
    Error,
    NewCopingCard,
    { previous: CopingCard[] }
  >({
    mutationFn: async (card): Promise<CopingCard> => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("coping_cards" as any)
        .insert({
          ...card,
          user_id: user.id,
          starred: false,
          archived: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as any as CopingCard;
    },
    onMutate: async (card): Promise<{ previous: CopingCard[] }> => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<CopingCard[]>(qk) ?? [];
      const optimistic: CopingCard = {
        ...card,
        id: `temp-${Date.now()}`,
        user_id: user?.id ?? "",
        starred: false,
        archived: false,
        created_at: new Date().toISOString(),
      };
      queryClient.setQueryData<CopingCard[]>(qk, [optimistic, ...previous]);
      return { previous };
    },
    onError: (_err, _card, context) => {
      if (context?.previous) {
        queryClient.setQueryData<CopingCard[]>(qk, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qk });
    },
  });

  // ── Toggle star ───────────────────────────────────────────────────────────

  const starMutation = useMutation<
    void,
    Error,
    string,
    { previous: CopingCard[] }
  >({
    mutationFn: async (id): Promise<void> => {
      const current = query.data?.find((c) => c.id === id);
      if (!current) return;

      const { error } = await supabase
        .from("coping_cards" as any)
        .update({ starred: !current.starred })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onMutate: async (id): Promise<{ previous: CopingCard[] }> => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<CopingCard[]>(qk) ?? [];
      queryClient.setQueryData<CopingCard[]>(
        qk,
        previous.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c)),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData<CopingCard[]>(qk, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qk });
    },
  });

  // ── Archive / Unarchive ───────────────────────────────────────────────────

  const archiveMutation = useMutation<
    void,
    Error,
    { id: string; archived: boolean },
    { previous: CopingCard[] }
  >({
    mutationFn: async ({ id, archived }): Promise<void> => {
      const { error } = await supabase
        .from("coping_cards" as any)
        .update({ archived })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onMutate: async ({ id, archived }): Promise<{ previous: CopingCard[] }> => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<CopingCard[]>(qk) ?? [];
      queryClient.setQueryData<CopingCard[]>(
        qk,
        previous.map((c) => (c.id === id ? { ...c, archived } : c)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<CopingCard[]>(qk, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qk });
    },
  });

  // ── Stable callbacks ──────────────────────────────────────────────────────

  const saveCard = useCallback(
    (card: NewCopingCard) => saveMutation.mutateAsync(card),
    [saveMutation],
  );

  const toggleStar = useCallback(
    (id: string) => starMutation.mutateAsync(id),
    [starMutation],
  );

  const archiveCard = useCallback(
    (id: string) => archiveMutation.mutateAsync({ id, archived: true }),
    [archiveMutation],
  );

  const unarchiveCard = useCallback(
    (id: string) => archiveMutation.mutateAsync({ id, archived: false }),
    [archiveMutation],
  );

  return {
    cards: query.data ?? [],
    isLoading: query.isLoading,
    saveCard,
    toggleStar,
    archiveCard,
    unarchiveCard,
    isError: query.isError,
    refetch: query.refetch,
  };
};
