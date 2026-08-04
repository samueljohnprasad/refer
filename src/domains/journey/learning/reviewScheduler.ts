import type {
  V1ReviewCandidate,
  V1SkillMastery,
} from "@/src/types/journeyLearning";

const REVIEW_INTERVAL_DAYS = [1, 3, 10] as const;

export function scheduleNextV1Review(
  fromIso: string,
  completedReviewCount: number,
): string {
  const index = Math.min(completedReviewCount, REVIEW_INTERVAL_DAYS.length - 1);
  const next = new Date(fromIso);
  next.setUTCDate(next.getUTCDate() + REVIEW_INTERVAL_DAYS[index]);
  return next.toISOString();
}

export function selectDueV1Reviews(
  masteryRows: V1SkillMastery[],
  nowIso: string,
  limit = 3,
): V1ReviewCandidate[] {
  const now = Date.parse(nowIso);

  return masteryRows
    .filter((mastery) => mastery.nextReviewAt && Date.parse(mastery.nextReviewAt) <= now)
    .sort((left, right) => {
      const leftTime = Date.parse(left.nextReviewAt ?? nowIso);
      const rightTime = Date.parse(right.nextReviewAt ?? nowIso);
      return leftTime - rightTime;
    })
    .slice(0, limit)
    .map((mastery) => ({
      skillId: mastery.skillId,
      dueAt: mastery.nextReviewAt ?? nowIso,
      stage: mastery.stage,
      needsReview: mastery.needsReview,
    }));
}
