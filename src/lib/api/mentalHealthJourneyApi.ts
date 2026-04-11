/**
 * Mental Health Journey API Client
 * Functions for fetching mental health journey data with extended content fields.
 *
 * Extends the base journey API with:
 * - Mental health template fetching (includes content JSONB, category, difficulty)
 * - Node completion logging (immutable audit trail)
 * - Streak management
 * - Insight Points ledger
 *
 * Reuses the base journeyApi for enrollment and progress operations.
 */

import { supabase } from "@/src/network/auth/supabase";
import type { ApiResponse } from "@/src/lib/api/journeyApi";
import type {
    MentalHealthTemplateNode,
    MentalHealthJourneyListItem,
    UserNodeCompletion,
    UserStreak,
    UpdateStreakResponse,
    IPLedgerEntry,
    IPTotals,
    IPSource,
    NodeContent,
    NodeResponseData,
} from "@/src/types/journey/mentalHealth";
import { createLogger } from "@/src/lib/logger";

/**
 * NOTE: New tables (user_node_completions, user_streaks, insight_points_ledger,
 * user_ip_totals) and new columns (content, title, xp_reward, etc.) were added
 * via migrations but database.types.ts hasn't been regenerated yet.
 *
 * Run `supabase gen types typescript --local > database.types.ts` after pushing
 * migrations to update the generated types and remove these `as any` casts.
 *
 * Until then, we use the untyped Supabase client accessor for new tables:
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;
const log = createLogger("MentalHealthJourneyAPI");

// ============================================================================
// Types for the extended template (matches DB + RPC output)
// ============================================================================

/** Unit within a mental health journey template */
export interface MHTemplateUnit {
    id: string;
    unitNumber: number;
    globalUnitNumber?: number;
    sectionId?: string;
    sectionNumber?: number;
    title: string;
    description: string;
    colorScheme: string;
    unlockRule: string;
    mascotPlacements: Array<{
        afterNodeIndex: number;
        position: string;
        message?: string;
    }>;
    nodes: MentalHealthTemplateNode[];
}

/** Section within a mental health journey template */
export interface MHTemplateSection {
    id: string;
    sectionNumber: number;
    title: string;
    description: string;
    colorScheme: string;
    unlockRule: string;
    mascotPlacements: Array<{
        afterNodeIndex: number;
        position: string;
        message?: string;
    }>;
    units: MHTemplateUnit[];
}

/** Full mental health journey template */
export interface MHJourneyTemplate {
    id: string;
    slug: string;
    title: string;
    description: string;
    version: number;
    colorScheme: string;
    category: string;
    difficulty: string;
    estimatedDays: number | null;
    totalNodes: number;
    colorThemeKey: string | null;
    iconKey: string | null;
    sections: MHTemplateSection[];
    units: MHTemplateUnit[];
}

// ============================================================================
// Template API — fetch with mental health content columns
// ============================================================================

/**
 * Fetch a mental health journey template by slug, including all content JSONB.
 * Falls back to direct table query if RPC doesn't include extended fields.
 */
export async function fetchMHJourneyTemplate(
    slug: string,
): Promise<ApiResponse<MHJourneyTemplate | null>> {
    try {
        const { data, error } = await supabase.rpc("get_journey_template", {
            p_slug: slug,
        });

        if (error || !data) {
            log.error("fetchMHJourneyTemplate RPC error", error?.message, { slug });
            return {
                data: null,
                success: false,
                error: error?.message ?? "Journey not found",
            };
        }

        const templateData = data as Record<string, unknown>;

        const toNode = (node: Record<string, unknown>): MentalHealthTemplateNode => ({
            id: node.id as string,
            nodeIndex: (node.nodeIndex ?? node.node_index ?? 0) as number,
            nodeType: (node.nodeType ?? node.node_type ?? "learn") as string,
            taskId: (node.taskId ?? node.task_id ?? "") as string,
            rewards: (node.rewards ?? []) as Array<{
                type: string;
                amount: number;
                icon: string;
            }>,
            content: (node.content ?? {}) as NodeContent,
            title: (node.title ?? null) as string | null,
            description: (node.description ?? null) as string | null,
            xpReward: (node.xpReward ?? node.xp_reward ?? 10) as number,
            estimatedMinutes:
                (node.estimatedMinutes ?? node.estimated_minutes ?? 3) as number,
            iconKey: (node.iconKey ?? node.icon_key ?? null) as string | null,
            variantKey: (node.variantKey ?? node.variant_key ?? "lesson") as string,
            metadata: node.metadata as Record<string, unknown> | undefined,
        });

        const toUnit = (unit: Record<string, unknown>): MHTemplateUnit => ({
            id: unit.id as string,
            unitNumber: (unit.unitNumber ?? unit.sectionUnitNumber ?? 1) as number,
            globalUnitNumber:
                (unit.globalUnitNumber ?? unit.unitNumber ?? null) as number | undefined,
            sectionId: (unit.sectionId ?? null) as string | undefined,
            sectionNumber: (unit.sectionNumber ?? null) as number | undefined,
            title: unit.title as string,
            description: (unit.description ?? "") as string,
            colorScheme: (unit.colorScheme ?? "blue") as string,
            unlockRule: (unit.unlockRule ?? "sequential") as string,
            mascotPlacements:
                (unit.mascotPlacements ?? []) as MHTemplateUnit["mascotPlacements"],
            nodes: ((unit.nodes ?? []) as Record<string, unknown>[]).map(toNode),
        });

        const sections: MHTemplateSection[] = (
            (templateData.sections ?? []) as Record<string, unknown>[]
        ).map((section) => ({
            id: section.id as string,
            sectionNumber: (section.sectionNumber ?? section.unitNumber ?? 1) as number,
            title: section.title as string,
            description: (section.description ?? "") as string,
            colorScheme: (section.colorScheme ?? "blue") as string,
            unlockRule: (section.unlockRule ?? "sequential") as string,
            mascotPlacements:
                (section.mascotPlacements ?? []) as MHTemplateSection["mascotPlacements"],
            units: ((section.units ?? []) as Record<string, unknown>[]).map(toUnit),
        }));

        const flatUnits: MHTemplateUnit[] = sections.length > 0
            ? sections.flatMap((section) => section.units)
            : ((templateData.units ?? []) as Record<string, unknown>[]).map(toUnit);

        const template: MHJourneyTemplate = {
            id: templateData.id as string,
            slug: templateData.slug as string,
            title: templateData.title as string,
            description: templateData.description as string,
            version: (templateData.version ?? 1) as number,
            colorScheme: (templateData.colorScheme ?? "blue") as string,
            category: (templateData.category ?? "general") as string,
            difficulty: (templateData.difficulty ?? "beginner") as string,
            estimatedDays: (templateData.estimatedDays ?? null) as number | null,
            totalNodes: (templateData.totalNodes ?? 0) as number,
            colorThemeKey: (templateData.colorThemeKey ?? null) as string | null,
            iconKey: (templateData.iconKey ?? null) as string | null,
            sections,
            units: flatUnits,
        };

        return { data: template, success: true };
    } catch (err) {
        log.error("fetchMHJourneyTemplate exception", err, { slug });
        return {
            data: null,
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

// ============================================================================
// Catalog API — with mental health fields
// ============================================================================

/**
 * Fetch all active mental health journeys for the catalog.
 */
export async function fetchMHJourneyCatalog(): Promise<
    ApiResponse<MentalHealthJourneyListItem[]>
> {
    try {
        const userId: string | undefined = (await supabase.auth.getUser()).data.user
            ?.id;

        const { data: journeys, error } = await db
            .from("journey_templates")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (error) {
            log.error("fetchMHJourneyCatalog query error", error.message);
            return { data: [], success: false, error: error.message };
        }

        const items: MentalHealthJourneyListItem[] = await Promise.all(
            (journeys ?? []).map(
                async (
                    j: Record<string, unknown>,
                ): Promise<MentalHealthJourneyListItem> => {
                    let completedNodes: number = 0;
                    let isEnrolled: boolean = false;
                    let enrollmentStatus: MentalHealthJourneyListItem["enrollmentStatus"] =
                        null;

                    if (userId) {
                        // Check enrollment
                        const { data: enrollment } = await db
                            .from("user_journey_enrollments")
                            .select("id, status")
                            .eq("user_id", userId)
                            .eq("journey_id", j.id as string)
                            .order("enrolled_at", { ascending: false })
                            .limit(1)
                            .maybeSingle();

                        if (enrollment) {
                            isEnrolled = enrollment.status === "active";
                            enrollmentStatus =
                                enrollment.status as MentalHealthJourneyListItem["enrollmentStatus"];

                            // Count completed nodes
                            const { count } = await db
                                .from("user_node_progress")
                                .select("id", { count: "exact", head: true })
                                .eq("enrollment_id", enrollment.id as string)
                                .eq("status", "completed");

                            completedNodes = count ?? 0;
                        }
                    }

                    return {
                        id: j.id as string,
                        slug: j.slug as string,
                        title: j.title as string,
                        description: (j.description ?? "") as string,
                        iconUrl: (j.icon_url ?? null) as string | null,
                        colorScheme: (j.color_scheme ?? "blue") as string,
                        category: (j.category ??
                            "general") as MentalHealthJourneyListItem["category"],
                        difficulty: (j.difficulty ??
                            "beginner") as MentalHealthJourneyListItem["difficulty"],
                        estimatedDays: (j.estimated_days ?? null) as number | null,
                        totalNodes: (j.total_nodes ?? 0) as number,
                        completedNodes,
                        isEnrolled,
                        enrollmentStatus,
                        colorThemeKey: (j.color_theme_key ?? null) as string | null,
                        iconKey: (j.icon_key ?? null) as string | null,
                    };
                },
            ),
        );

        return { data: items, success: true };
    } catch (err) {
        log.error("fetchMHJourneyCatalog exception", err);
        return {
            data: [],
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

// ============================================================================
// Node Completion API — immutable log
// ============================================================================

/** Payload for logging a node completion */
export interface LogNodeCompletionPayload {
    nodeId: string;
    journeyId: string;
    enrollmentId: string;
    nodeType: string;
    responseData: NodeResponseData | null;
    xpEarned: number;
    durationSeconds: number;
    moodBefore?: number;
    moodAfter?: number;
}

/**
 * Log a node completion to the immutable `user_node_completions` table.
 * Also updates `user_node_progress` with response data and XP.
 */
export async function logNodeCompletion(
    payload: LogNodeCompletionPayload,
): Promise<ApiResponse<UserNodeCompletion | null>> {
    try {
        const userId: string | undefined = (await supabase.auth.getUser()).data.user
            ?.id;
        if (!userId) {
            return { data: null, success: false, error: "Not authenticated" };
        }

        // Insert immutable completion log
        const { data, error } = await db
            .from("user_node_completions")
            .insert({
                user_id: userId,
                node_id: payload.nodeId,
                journey_id: payload.journeyId,
                enrollment_id: payload.enrollmentId,
                node_type: payload.nodeType,
                response_data: payload.responseData,
                xp_earned: payload.xpEarned,
                duration_seconds: payload.durationSeconds,
                mood_before: payload.moodBefore ?? null,
                mood_after: payload.moodAfter ?? null,
            })
            .select()
            .single();

        if (error) {
            log.error("logNodeCompletion insert error", error.message, {
                nodeId: payload.nodeId,
                enrollmentId: payload.enrollmentId,
            });
            return { data: null, success: false, error: error.message };
        }

        // Also update user_node_progress with response data
        await db
            .from("user_node_progress")
            .update({
                response_data: payload.responseData,
                mood_before: payload.moodBefore ?? null,
                mood_after: payload.moodAfter ?? null,
                duration_seconds: payload.durationSeconds,
                xp_earned: payload.xpEarned,
            })
            .eq("enrollment_id", payload.enrollmentId)
            .eq("node_id", payload.nodeId)
            .eq("user_id", userId);

        const completion: UserNodeCompletion = {
            id: data.id as string,
            userId: data.user_id as string,
            nodeId: data.node_id as string,
            journeyId: data.journey_id as string,
            enrollmentId: data.enrollment_id as string | null,
            nodeType: data.node_type as string,
            responseData: data.response_data as NodeResponseData | null,
            xpEarned: data.xp_earned as number,
            durationSeconds: data.duration_seconds as number | null,
            moodBefore: data.mood_before as number | null,
            moodAfter: data.mood_after as number | null,
            completedAt: data.completed_at as string,
        };

        return { data: completion, success: true };
    } catch (err) {
        log.error("logNodeCompletion exception", err, {
            nodeId: payload.nodeId,
            enrollmentId: payload.enrollmentId,
        });
        return {
            data: null,
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

// ============================================================================
// Streak API
// ============================================================================

/**
 * Fetch the current user's streak data.
 */
export async function fetchUserStreak(): Promise<
    ApiResponse<UserStreak | null>
> {
    try {
        const userId: string | undefined = (await supabase.auth.getUser()).data.user
            ?.id;
        if (!userId) {
            return { data: null, success: false, error: "Not authenticated" };
        }

        const { data, error } = await db
            .from("user_streaks")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {
            log.error("fetchUserStreak query error", error.message);
            return { data: null, success: false, error: error.message };
        }

        if (!data) {
            return { data: null, success: true };
        }

        const streak: UserStreak = {
            userId: data.user_id as string,
            currentStreak: data.current_streak as number,
            longestStreak: data.longest_streak as number,
            lastActivityDate: data.last_activity_date as string,
            streakFreezesAvailable: data.streak_freezes_available as number,
            restDaysUsedThisWeek: data.rest_days_used_this_week as number,
            weekStartDate: data.week_start_date as string,
            updatedAt: data.updated_at as string,
        };

        return { data: streak, success: true };
    } catch (err) {
        log.error("fetchUserStreak exception", err);
        return {
            data: null,
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

/**
 * Update the user's streak via the atomic RPC function.
 * Should be called on every node completion.
 */
export async function updateStreak(): Promise<
    ApiResponse<UpdateStreakResponse | null>
> {
    try {
        const { data, error } = await db.rpc("update_user_streak");

        if (error) {
            log.error("updateStreak RPC error", error.message);
            return { data: null, success: false, error: error.message };
        }

        return { data: data as unknown as UpdateStreakResponse, success: true };
    } catch (err) {
        log.error("updateStreak exception", err);
        return {
            data: null,
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

// ============================================================================
// Insight Points API
// ============================================================================

/**
 * Earn Insight Points — insert an entry into the ledger.
 */
export async function earnInsightPoints(params: {
    amount: number;
    source: IPSource;
    sourceId?: string;
    journeyId?: string;
    metadata?: Record<string, unknown>;
}): Promise<ApiResponse<IPLedgerEntry | null>> {
    try {
        const userId: string | undefined = (await supabase.auth.getUser()).data.user
            ?.id;
        if (!userId) {
            return { data: null, success: false, error: "Not authenticated" };
        }

        const { data, error } = await db
            .from("insight_points_ledger")
            .insert({
                user_id: userId,
                amount: params.amount,
                source: params.source,
                source_id: params.sourceId ?? null,
                journey_id: params.journeyId ?? null,
                metadata: params.metadata ?? null,
            })
            .select()
            .single();

        if (error) {
            log.error("earnInsightPoints insert error", error.message);
            return { data: null, success: false, error: error.message };
        }

        const entry: IPLedgerEntry = {
            id: data.id as string,
            userId: data.user_id as string,
            amount: data.amount as number,
            source: data.source as IPSource,
            sourceId: data.source_id as string | null,
            journeyId: data.journey_id as string | null,
            metadata: data.metadata as Record<string, unknown> | null,
            earnedAt: data.earned_at as string,
        };

        return { data: entry, success: true };
    } catch (err) {
        log.error("earnInsightPoints exception", err);
        return {
            data: null,
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

/**
 * Fetch aggregated IP totals for the current user.
 */
export async function fetchIPTotals(): Promise<ApiResponse<IPTotals>> {
    try {
        const userId: string | undefined = (await supabase.auth.getUser()).data.user
            ?.id;
        if (!userId) {
            return {
                data: { totalIp: 0, todayIp: 0, weekIp: 0 },
                success: false,
                error: "Not authenticated",
            };
        }

        const { data, error } = await db
            .from("user_ip_totals")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {
            log.error("fetchIPTotals query error", error.message);
            return {
                data: { totalIp: 0, todayIp: 0, weekIp: 0 },
                success: false,
                error: error.message,
            };
        }

        const totals: IPTotals = {
            totalIp: (data?.total_ip ?? 0) as number,
            todayIp: (data?.today_ip ?? 0) as number,
            weekIp: (data?.week_ip ?? 0) as number,
        };

        return { data: totals, success: true };
    } catch (err) {
        log.error("fetchIPTotals exception", err);
        return {
            data: { totalIp: 0, todayIp: 0, weekIp: 0 },
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

/**
 * Fetch completions for a specific journey (for mood comparison, AI reports).
 */
export async function fetchJourneyCompletions(
    journeyId: string,
): Promise<ApiResponse<UserNodeCompletion[]>> {
    try {
        const userId: string | undefined = (await supabase.auth.getUser()).data.user
            ?.id;
        if (!userId) {
            return { data: [], success: false, error: "Not authenticated" };
        }

        const { data, error } = await db
            .from("user_node_completions")
            .select("*")
            .eq("user_id", userId)
            .eq("journey_id", journeyId)
            .order("completed_at", { ascending: true });

        if (error) {
            log.error("fetchJourneyCompletions query error", error.message, {
                journeyId,
            });
            return { data: [], success: false, error: error.message };
        }

        const completions: UserNodeCompletion[] = (data ?? []).map(
            (row: Record<string, unknown>): UserNodeCompletion => ({
                id: row.id as string,
                userId: row.user_id as string,
                nodeId: row.node_id as string,
                journeyId: row.journey_id as string,
                enrollmentId: (row.enrollment_id ?? null) as string | null,
                nodeType: row.node_type as string,
                responseData: (row.response_data ?? null) as NodeResponseData | null,
                xpEarned: (row.xp_earned ?? 0) as number,
                durationSeconds: (row.duration_seconds ?? null) as number | null,
                moodBefore: (row.mood_before ?? null) as number | null,
                moodAfter: (row.mood_after ?? null) as number | null,
                completedAt: row.completed_at as string,
            }),
        );

        return { data: completions, success: true };
    } catch (err) {
        log.error("fetchJourneyCompletions exception", err, { journeyId });
        return {
            data: [],
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}
