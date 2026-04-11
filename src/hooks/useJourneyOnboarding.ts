/**
 * useJourneyOnboarding
 * Hook for the new-user onboarding quiz flow.
 *
 * Responsibilities:
 * - Provide quiz questions (static data)
 * - Score answers to determine recommended journey category
 * - Find best matching journey from catalog
 * - Auto-enroll user into recommended journey
 * - Track whether user has completed/skipped onboarding (persisted)
 *
 * Follows container/hook separation — no UI logic here.
 */

import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
    MentalHealthJourneyListItem,
} from "@/src/types/journey";
import type {
    OnboardingQuestion,
} from "@/src/components/journey/JourneyOnboardingScreen";
import { fetchMHJourneyCatalog } from "@/src/lib/api/mentalHealthJourneyApi";
import { useMultiJourney } from "@/src/hooks/useMultiJourney";
import { createLogger } from "@/src/lib/logger";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ONBOARDING_COMPLETE_KEY = "@journey_onboarding_complete_v1";
const log = createLogger("useJourneyOnboarding");

// ---------------------------------------------------------------------------
// Quiz Data
// ---------------------------------------------------------------------------

const QUIZ_QUESTIONS: OnboardingQuestion[] = [
    {
        id: "goal",
        title: "What brings you here?",
        subtitle: "Pick the one that resonates most — you can always explore more later.",
        options: [
            {
                id: "calm_anxiety",
                label: "Calm my anxiety",
                emoji: "🌊",
                description: "Learn techniques to manage worry and anxious thoughts",
                categories: ["anxiety", "stress"],
            },
            {
                id: "improve_mood",
                label: "Improve my mood",
                emoji: "☀️",
                description: "Build habits that lift your emotional baseline",
                categories: ["mood", "growth"],
            },
            {
                id: "manage_stress",
                label: "Manage stress better",
                emoji: "🧘",
                description: "Develop resilience and healthy coping strategies",
                categories: ["stress", "self_compassion"],
            },
            {
                id: "sleep_better",
                label: "Sleep better",
                emoji: "🌙",
                description: "Wind down effectively and improve sleep quality",
                categories: ["sleep", "stress"],
            },
            {
                id: "grow_personally",
                label: "Grow as a person",
                emoji: "🌱",
                description: "Build self-awareness and emotional intelligence",
                categories: ["growth", "self_compassion"],
            },
        ],
    },
    {
        id: "experience",
        title: "How familiar are you with mental wellness?",
        subtitle: "This helps us pick the right starting point.",
        options: [
            {
                id: "beginner",
                label: "Just getting started",
                emoji: "🐣",
                description: "I'm new to guided mental health exercises",
                categories: ["beginner"],
            },
            {
                id: "some_experience",
                label: "I know some basics",
                emoji: "📚",
                description: "I've tried meditation or journaling before",
                categories: ["intermediate"],
            },
            {
                id: "experienced",
                label: "I practice regularly",
                emoji: "🧠",
                description: "I want to deepen my existing practice",
                categories: ["advanced"],
            },
        ],
    },
];

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Score quiz answers to produce a ranked list of journey categories.
 * Returns categories sorted by relevance score (descending).
 */
function scoreAnswers(
    answers: Record<string, string>,
    questions: OnboardingQuestion[],
): string[] {
    const scores: Record<string, number> = {};

    for (const question of questions) {
        const selectedOptionId: string | undefined = answers[question.id];
        if (!selectedOptionId) continue;

        const selectedOption = question.options.find(
            (o) => o.id === selectedOptionId,
        );
        if (!selectedOption) continue;

        for (const cat of selectedOption.categories) {
            scores[cat] = (scores[cat] ?? 0) + 1;
        }
    }

    return Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .map(([cat]) => cat);
}

/**
 * Find the best matching journey from the catalog based on scored categories.
 * Prefers beginner-difficulty journeys for new users.
 */
function findBestMatch(
    catalog: MentalHealthJourneyListItem[],
    rankedCategories: string[],
    difficultyPreference: string,
): MentalHealthJourneyListItem | null {
    // Filter out already-enrolled journeys
    const available: MentalHealthJourneyListItem[] = catalog.filter(
        (j: MentalHealthJourneyListItem) => !j.isEnrolled,
    );
    if (available.length === 0) return catalog[0] ?? null;

    // Try each ranked category in order
    for (const category of rankedCategories) {
        // Skip difficulty-level categories (handled separately)
        if (["beginner", "intermediate", "advanced"].includes(category)) continue;

        const matches: MentalHealthJourneyListItem[] = available.filter(
            (j: MentalHealthJourneyListItem) => j.category === category,
        );

        if (matches.length > 0) {
            // Prefer matching difficulty
            const diffMatch: MentalHealthJourneyListItem | undefined = matches.find(
                (j: MentalHealthJourneyListItem) => j.difficulty === difficultyPreference,
            );
            return diffMatch ?? matches[0];
        }
    }

    // Fallback: first available journey at preferred difficulty
    const diffFallback: MentalHealthJourneyListItem | undefined = available.find(
        (j: MentalHealthJourneyListItem) => j.difficulty === difficultyPreference,
    );
    return diffFallback ?? available[0];
}

// ---------------------------------------------------------------------------
// Return Type
// ---------------------------------------------------------------------------

export interface UseJourneyOnboardingReturn {
    /** Quiz questions to display */
    questions: OnboardingQuestion[];
    /** Whether onboarding has been completed/skipped previously */
    hasCompletedOnboarding: boolean;
    /** Whether we're still checking onboarding status */
    isCheckingStatus: boolean;
    /** Whether auto-enrollment is in progress */
    isEnrolling: boolean;
    /** Process quiz answers and auto-enroll */
    handleQuizComplete: (answers: Record<string, string>) => Promise<void>;
    /** Skip onboarding and go to catalog */
    handleSkip: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useJourneyOnboarding(): UseJourneyOnboardingReturn {
    const { enrollInJourney, switchJourney } = useMultiJourney();
    const [hasCompletedOnboarding, setHasCompletedOnboarding] =
        useState<boolean>(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
    const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

    // Check if onboarding was already completed
    useEffect(() => {
        const checkStatus = async (): Promise<void> => {
            try {
                const value: string | null = await AsyncStorage.getItem(
                    ONBOARDING_COMPLETE_KEY,
                );
                setHasCompletedOnboarding(value === "true");
                log.info("Loaded onboarding status", {
                    storedValue: value,
                    hasCompleted: value === "true",
                });
            } catch {
                setHasCompletedOnboarding(false);
                log.warn("Failed to read onboarding status, defaulting to false");
            } finally {
                setIsCheckingStatus(false);
            }
        };
        checkStatus();
    }, []);

    const markOnboardingComplete = useCallback(async (): Promise<void> => {
        try {
            await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
            setHasCompletedOnboarding(true);
            log.info("Marked onboarding complete");
        } catch (error) {
            log.error("Failed to mark onboarding complete", error);
        }
    }, []);

    const handleQuizComplete = useCallback(
        async (answers: Record<string, string>): Promise<void> => {
            try {
                setIsEnrolling(true);
                log.info("Quiz complete received", { answers });

                // 1. Score answers
                const rankedCategories: string[] = scoreAnswers(
                    answers,
                    QUIZ_QUESTIONS,
                );

                // Determine difficulty preference from experience question
                const experienceAnswer: string | undefined = answers["experience"];
                let difficultyPreference: string = "beginner";
                if (experienceAnswer === "some_experience") {
                    difficultyPreference = "intermediate";
                } else if (experienceAnswer === "experienced") {
                    difficultyPreference = "advanced";
                }
                log.info("Computed onboarding recommendation inputs", {
                    rankedCategories,
                    difficultyPreference,
                });

                // 2. Fetch catalog to find best match
                const catalogRes = await fetchMHJourneyCatalog();
                if (!catalogRes.success || catalogRes.data.length === 0) {
                    log.warn("Failed to fetch journey catalog, skipping auto-enroll");
                    await markOnboardingComplete();
                    return;
                }

                // 3. Find best matching journey
                const bestMatch: MentalHealthJourneyListItem | null = findBestMatch(
                    catalogRes.data,
                    rankedCategories,
                    difficultyPreference,
                );
                log.info("Resolved best journey match", {
                    bestMatchSlug: bestMatch?.slug ?? null,
                    catalogCount: catalogRes.data.length,
                });

                if (bestMatch) {
                    try {
                        // 4. Auto-enroll when possible
                        log.info("Attempting auto-enroll", { slug: bestMatch.slug });
                        await enrollInJourney(bestMatch);
                        log.info("Auto-enroll succeeded", { slug: bestMatch.slug });
                    } catch (error) {
                        // Guests / preview users can still open the recommended
                        // journey even if a persisted enrollment cannot be created.
                        log.warn(
                            "Auto-enroll failed, falling back to preview journey",
                            error,
                            { slug: bestMatch.slug },
                        );
                        await switchJourney(bestMatch.slug);
                        log.info("Preview journey selected after enroll failure", {
                            slug: bestMatch.slug,
                        });
                    }
                } else {
                    log.warn("No best match could be resolved from onboarding quiz");
                }

                // 5. Mark onboarding complete
                await markOnboardingComplete();
            } catch (error) {
                log.error("Quiz completion error", error);
                await markOnboardingComplete();
            } finally {
                setIsEnrolling(false);
                log.info("Quiz completion flow ended");
            }
        },
        [enrollInJourney, markOnboardingComplete, switchJourney],
    );

    const handleSkip = useCallback(async (): Promise<void> => {
        log.info("Onboarding skipped");
        await markOnboardingComplete();
    }, [markOnboardingComplete]);

    return {
        questions: QUIZ_QUESTIONS,
        hasCompletedOnboarding,
        isCheckingStatus,
        isEnrolling,
        handleQuizComplete,
        handleSkip,
    };
}
