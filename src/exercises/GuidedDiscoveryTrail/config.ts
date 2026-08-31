import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { validateStringBudget } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { MicrolearningContentIssue } from "@/src/components/exercise/microlearning/microlearningTypes";
import { GuidedDiscoveryTrailCategoryEngine } from "@/src/components/exercise/GuidedDiscoveryTrailCategoryEngine";
import { validateGuidedDiscoveryTrailContent, readGuidedDiscoveryTrailContent } from "@/src/components/exercise/guidedDiscoveryTrailContent";
import { readMicrolearningPhase, readStageIndex, sanitizeSelectedId } from "@/src/components/exercise/microlearning/microlearningResponse";

export const GuidedDiscoveryTrailConfig: CourseExerciseCategoryConfig = {
    category: CourseExerciseCategoryEnum.GuidedDiscoveryTrail,
    formats: [CourseExerciseCategoryEnum.GuidedDiscoveryTrail],
    engine: GuidedDiscoveryTrailCategoryEngine,
    goalLabel: "Discover why relief can strengthen avoidance.",
    unavailableCopy: "This guided discovery is not available yet.",
    interaction: {
        submissionMode: "explicit",
        getPrimaryLabel: (exercise, response) => {
            const trail = readGuidedDiscoveryTrailContent(exercise.content);
            if (!trail) return "Choose one";
            if (readMicrolearningPhase(response.phase) === "complete") return "Continue";
            const stageIndex = readStageIndex(response.stageIndex, trail.questions.length);
            const question = trail.questions[stageIndex];
            const selectedOptionId = sanitizeSelectedId(
                response.selectedOptionId,
                question.options.map((option) => option.id),
            );
            if (readMicrolearningPhase(response.phase) !== "feedback" || !selectedOptionId) {
                return "Choose one";
            }
            return stageIndex === trail.questions.length - 1
                ? "See the pattern"
                : "Next clue";
        },
        getPrimaryTransition: (exercise, response) => {
            const trail = readGuidedDiscoveryTrailContent(exercise.content);
            if (!trail || readMicrolearningPhase(response.phase) !== "feedback") {
                return null;
            }
            const stageIndex = readStageIndex(response.stageIndex, trail.questions.length);
            const question = trail.questions[stageIndex];
            const selectedOptionId = sanitizeSelectedId(
                response.selectedOptionId,
                question.options.map((option) => option.id),
            );
            if (!selectedOptionId) return null;

            const completedSummaries = trail.questions
                .slice(0, stageIndex + 1)
                .map((item) => item.summary);
            const complete = stageIndex === trail.questions.length - 1;
            return {
                kind: "response",
                ready: complete,
                response: {
                    ...response,
                    phase: complete ? "complete" : "active",
                    stageIndex: complete ? stageIndex : stageIndex + 1,
                    selectedOptionId: null,
                    feedbackText: null,
                    completedSummaries,
                    isCorrect: true,
                },
            };
        }
    },
    validation: (content) => {
        const issues: MicrolearningContentIssue[] = [];
        validateStringBudget(content, "title", 7, issues);
        validateStringBudget(content, "instruction", 12, issues);
        validateGuidedDiscoveryTrailContent(content as any, issues);
        return issues;
    },
};
