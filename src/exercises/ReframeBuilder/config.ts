import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { validateStringBudget } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";
import { ReframeBuilderCategoryEngine } from "@/src/components/exercise/ReframeBuilderCategoryEngine";
import {
    buildReframeThought,
    createReframeBuilderResponse,
    hasCompleteReframeSelection,
    readReframeBuilderContent,
    validateReframeBuilderContent,
} from "@/src/components/exercise/reframeBuilderContent";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

export const ReframeBuilderConfig: CourseExerciseCategoryConfig = {
    category: CourseExerciseCategoryEnum.ReframeBuilder,
    formats: [CourseExerciseCategoryEnum.ReframeBuilder],
    engine: ReframeBuilderCategoryEngine,
    goalLabel: "Challenge a negative thought with evidence.",
    unavailableCopy: "This reframe builder is not available yet.",
    validation: (content) => {
        const issues: MicrolearningContentIssue[] = [];
        validateStringBudget(content, "title", 7, issues);
        validateStringBudget(content, "instruction", 12, issues);
        validateReframeBuilderContent(content as any, issues);
        return issues;
    },
    interaction: {
    submissionMode: "immediate",
        getPrimaryLabel: (
            exercise: Exercise,
            response: Record<string, unknown>,
        ): string => {
            if (response.phase === "complete") return "Continue";
            const content = readReframeBuilderContent(exercise.content);
            if (!content) return "Complete each slot";
            const normalized = createReframeBuilderResponse(content, response);
            return hasCompleteReframeSelection(content, normalized.selectedByTrayId)
                ? "Compare thoughts"
                : "Complete each slot";
        },
        getPrimaryTransition: (
            exercise: Exercise,
            response: Record<string, unknown>,
        ): CoursePrimaryTransition | undefined => {
            if (response.phase !== "active") return undefined;
            const content = readReframeBuilderContent(exercise.content);
            if (!content) return undefined;
            const normalized = createReframeBuilderResponse(content, response);
            if (
                !hasCompleteReframeSelection(content, normalized.selectedByTrayId) ||
                !buildReframeThought(content, normalized.selectedByTrayId)
            ) return undefined;
            return {
                kind: "response",
                ready: true,
                response: {
                    ...normalized,
                    phase: "complete",
                    stageIndex: content.trays.length - 1,
                    editingTrayId: null,
                    isCorrect: true,
                },
            };
        },
    },
};
