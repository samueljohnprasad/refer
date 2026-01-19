import React, { useCallback, useMemo } from "react";
import {
  useInfiniteQuery,
  QueryFunctionContext,
  InfiniteData,
} from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { JournalEntry } from "@/hooks/data/types";
import { TWO_HOUR } from "@/constants/Colors";

const PAGE_SIZE: number = 10;

interface BookmarkedJournalsPage {
  data: JournalEntry[];
  count: number;
  nextPage?: number;
}

interface UseBookmarkedJournalsReturn {
  data: JournalEntry[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  refetch: () => void;
  totalCount: number;
}

export const useBookmarkedJournals = (): UseBookmarkedJournalsReturn => {
  const { user } = useAuth();

  const loadBookmarkedJournals = useCallback(
    async (
      context: QueryFunctionContext<readonly unknown[], number>
    ): Promise<BookmarkedJournalsPage> => {
      const pageParam: number = context.pageParam ?? 1;
      if (!user?.id) {
        return { data: [], count: 0 };
      }

      try {
        // Get total count (only on first page)
        let totalCount: number = 0;
        if (pageParam === 1) {
          const { count, error: countError } = await supabase
            .from("journal_records")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("is_bookmarked", true);

          totalCount = count || 0;
        }

        // Get paginated data
        const startIndex: number = (pageParam - 1) * PAGE_SIZE;
        const endIndex: number = startIndex + PAGE_SIZE - 1;

        const { data, error } = await supabase
          .from("journal_records")
          .select(
            `*,
            journal_ai_insights(
              id,
              journal_entry_id,
              created_at,
              aiInsights,
              feelings,
              energyLevel,
              stressLevel,
              sleepQuality,
              achievements,
              worries,
              goals,
              triggers,
              copingStrategies,
              "physical-symptoms"
            ),
            moods(*)
            `
          )
          .eq("user_id", user.id)
          .eq("is_bookmarked", true)
          .order("bookmarked_at", { ascending: false })
          .range(startIndex, endIndex);

        if (error) {
          throw error;
        }

        if (!data) {
          return { data: [], count: totalCount };
        }

        const hasNextPage: boolean = data.length === PAGE_SIZE;
        return {
          data: data as JournalEntry[],
          count: totalCount,
          nextPage: hasNextPage ? pageParam + 1 : undefined,
        };
      } catch (err) {
        return { data: [], count: 0 };
      }
    },
    [user?.id]
  );

  const query = useInfiniteQuery<
    BookmarkedJournalsPage,
    Error,
    InfiniteData<BookmarkedJournalsPage>,
    readonly unknown[],
    number
  >({
    queryKey: ["bookmarked_journals", user?.id],
    queryFn: loadBookmarkedJournals,
    initialPageParam: 1,
    getNextPageParam: (lastPage: BookmarkedJournalsPage) => lastPage.nextPage,
    staleTime: TWO_HOUR,
    gcTime: TWO_HOUR,
    enabled: !!user?.id,
    retry: 2,
    retryDelay: (attemptIndex: number): number =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Flatten all pages into a single array
  const allData: JournalEntry[] = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flatMap(
      (page: BookmarkedJournalsPage) => page.data
    );
  }, [query.data?.pages]);

  // Get total count from first page
  const totalCount: number = useMemo(() => {
    return query.data?.pages[0]?.count || 0;
  }, [query.data?.pages]);

  return {
    data: allData,
    isLoading: query.isLoading,
    error: query.error,
    hasNextPage: query.hasNextPage || false,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: query.refetch,
    totalCount,
  };
};
