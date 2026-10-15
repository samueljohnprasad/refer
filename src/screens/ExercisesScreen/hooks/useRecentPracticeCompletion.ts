import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import {
  getLatestPracticeCompletion,
  type PracticeCompletionV1,
} from "@/src/domains/practice/data/practiceCompletion.repo";

export function useRecentPracticeCompletion(): {
  completion: PracticeCompletionV1 | null;
} {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["latest_practice_completion", user?.id],
    queryFn: () => getLatestPracticeCompletion(user!.id),
    enabled: Boolean(user?.id),
  });

  return { completion: data ?? null };
}
